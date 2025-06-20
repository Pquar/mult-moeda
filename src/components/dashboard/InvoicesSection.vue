<script setup lang="ts">
import { ref, computed } from 'vue'
import { invoices } from '@/lib/payments'
import ChartArea from '@/components/ui/ChartArea.vue'


const props = defineProps<{
  selectedCurrency: string
  selectedCompany: string
  formatCurrency: (amount: number, currency: any) => string
  convertToBRL: (amount: number, currency: any) => number
}>()


const invoicesPeriod = ref<'day' | 'week' | 'month'>('month')
const selectedMonth = ref<string>('')

const filteredInvoices = computed(() => {
  return invoices.filter(invoice => {
    const currencyMatch = props.selectedCurrency === 'all' || invoice.currency.code === props.selectedCurrency
    const companyMatch = props.selectedCompany === 'all' || invoice.company === props.selectedCompany
    return currencyMatch && companyMatch
  })
})

const availableMonths = computed(() => {
  const months = new Set<string>()
  
  filteredInvoices.value.forEach(invoice => {
    const date = new Date(invoice.issueDate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    months.add(monthKey)
  })
  

  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    months.add(monthKey)
  }
  
  return Array.from(months)
    .sort()
    .reverse()
    .map(monthKey => {
      const date = new Date(monthKey + '-01')
      return {
        value: monthKey,
        label: new Intl.DateTimeFormat('pt-BR', { 
          month: 'long', 
          year: 'numeric' 
        }).format(date)
      }
    })
})


const invoicesChartData = computed(() => {
  const periodData: { [key: string]: number } = {}
  
  
  let invoicesToProcess = filteredInvoices.value
  if (selectedMonth.value && invoicesPeriod.value === 'day') {
    invoicesToProcess = filteredInvoices.value.filter(invoice => {
      const date = new Date(invoice.issueDate)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      return monthKey === selectedMonth.value
    })
  }
  
  
  invoicesToProcess.forEach(invoice => {
    const date = new Date(invoice.issueDate)
    let periodKey: string
    
    if (invoicesPeriod.value === 'day') {
      periodKey = date.toISOString().split('T')[0]
    } else if (invoicesPeriod.value === 'week') {
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      periodKey = startOfWeek.toISOString().split('T')[0]
    } else {
      periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }
    
    const amountInBRL = props.convertToBRL(invoice.amount, invoice.currency)
    periodData[periodKey] = (periodData[periodKey] || 0) + amountInBRL
  })
  
  
  const now = new Date()
  const periods = []
  
  if (invoicesPeriod.value === 'day') {
    if (selectedMonth.value) {
      const [year, month] = selectedMonth.value.split('-').map(Number)
      const daysInMonth = new Date(year, month, 0).getDate()
      
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month - 1, d)
        const periodKey = date.toISOString().split('T')[0]
        const periodLabel = new Intl.DateTimeFormat('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }).format(date)
        
        periods.push({
          label: periodLabel,
          value: periodData[periodKey] || 0,
          date: periodKey
        })
      }
    } else {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(now.getDate() - i)
        const periodKey = date.toISOString().split('T')[0]
        const periodLabel = new Intl.DateTimeFormat('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }).format(date)
        
        periods.push({
          label: periodLabel,
          value: periodData[periodKey] || 0,
          date: periodKey
        })
      }
    }
  } else if (invoicesPeriod.value === 'week') {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(now.getDate() - (i * 7))
      
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      const periodKey = startOfWeek.toISOString().split('T')[0]
      
      const weekOfMonth = Math.ceil((startOfWeek.getDate() + startOfWeek.getDay()) / 7)
      const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(startOfWeek)
      const year = startOfWeek.getFullYear().toString().slice(-2)
      
      periods.push({
        label: `${monthName}/${year}-S${weekOfMonth}`,
        value: periodData[periodKey] || 0,
        date: periodKey
      })
    }
  } else {
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const periodLabel = new Intl.DateTimeFormat('pt-BR', { 
        month: 'short', 
        year: '2-digit' 
      }).format(date)
      
      periods.push({
        label: periodLabel,
        value: periodData[periodKey] || 0,
        date: periodKey
      })
    }
  }
  
  return periods
})


const exportInvoicesChart = () => {
  const csvData = invoicesChartData.value.map(item => ({
    'Período': item.label,
    'Data': item.date,
    'Valor Total (BRL)': item.value.toFixed(2),
    'Período de Agrupamento': invoicesPeriod.value === 'day' ? 'Diário' : 
                             invoicesPeriod.value === 'week' ? 'Semanal' : 'Mensal'
  }))
  
  const filename = `faturas_${invoicesPeriod.value === 'day' ? 'diario' : 
                              invoicesPeriod.value === 'week' ? 'semanal' : 'mensal'}.csv`
  downloadCSV(csvData, filename)
}


const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <section id="invoices" class="mb-8">
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Faturas</h2>
          <p class="text-sm text-gray-600 mt-1">
            Análise {{ invoicesPeriod === 'day' ? 'diária' : invoicesPeriod === 'week' ? 'semanal' : 'mensal' }} do volume de faturamento
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-sm text-gray-500">
            <span class="font-medium">Total de Faturas:</span>
            {{ filteredInvoices.length }}
          </div>
          <div class="text-sm text-gray-500">
            <span class="font-medium">Valor Total:</span>
            {{ formatCurrency(
              filteredInvoices.reduce((sum, invoice) => 
                sum + convertToBRL(invoice.amount, invoice.currency), 0
              ), 
              { code: 'BRL', symbol: 'BRL' }
            ) }}
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700">Visualizar por:</label>
            <div class="flex items-center gap-2">
              <button
                :class="[
                  'px-3 py-1.5 text-sm rounded-md transition-colors',
                  invoicesPeriod === 'day' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                ]"
                @click="invoicesPeriod = 'day'"
              >
                Dia
              </button>
              <button
                :class="[
                  'px-3 py-1.5 text-sm rounded-md transition-colors',
                  invoicesPeriod === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                ]"
                @click="invoicesPeriod = 'week'"
              >
                Semana
              </button>
              <button
                :class="[
                  'px-3 py-1.5 text-sm rounded-md transition-colors',
                  invoicesPeriod === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                ]"
                @click="invoicesPeriod = 'month'"
              >
                Mês
              </button>
            </div>
          </div>
          
          <div v-if="invoicesPeriod === 'day'" class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">Mês específico:</label>
            <select 
              v-model="selectedMonth"
              class="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Últimos 30 dias</option>
              <option 
                v-for="month in availableMonths" 
                :key="month.value" 
                :value="month.value"
              >
                {{ month.label }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            @click="exportInvoicesChart"
          >
            Exportar Dados do Gráfico
          </button>
        </div>
      </div>
      
      <div class="flex justify-center">
        <ChartArea
          :data="invoicesChartData"
          :width="800"
          :height="300"
          color="#10b981"
          :title="`Faturamento ${invoicesPeriod === 'day' ? 'Diário' : invoicesPeriod === 'week' ? 'Semanal' : 'Mensal'} (BRL)`"
          y-axis-label="Valor em BRL"
        />
      </div>
    </div>
  </section>
</template>
