<script setup lang="ts">
import { ref, computed } from 'vue'
import { payments, invoices, workers, currencies } from '@/lib/payments'
import Button from '@/components/ui/Button.vue'

// Estado para filtros
const selectedCurrency = ref('all')
const selectedCompany = ref('all')

// Função para formatar valores monetários
const formatCurrency = (amount: number, currency: any) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2
  }).format(amount)
}

// Função para converter valores para USD
const convertToUSD = (amount: number, currency: any) => {
  return amount / currency.value
}

// Pagamentos filtrados
const filteredPayments = computed(() => {
  return payments.filter(payment => {
    const currencyMatch = selectedCurrency.value === 'all' || payment.currency.code === selectedCurrency.value
    const companyMatch = selectedCompany.value === 'all' || payment.company === selectedCompany.value
    return currencyMatch && companyMatch
  })
})

// Total geral em USD
const totalInUSD = computed(() => {
  return payments.reduce((total, payment) => {
    return total + convertToUSD(payment.amount, payment.currency)
  }, 0)
})

// Empresas únicas
const uniqueCompanies = computed(() => {
  const companies = [...new Set(payments.map(p => p.company))]
  return companies.sort()
})

// Estatísticas por moeda
const statsByCurrency = computed(() => {
  const stats = currencies.map(currency => {
    const paymentsInCurrency = payments.filter(p => p.currency.code === currency.code)
    const total = paymentsInCurrency.reduce((sum, p) => sum + p.amount, 0)
    return {
      currency,
      count: paymentsInCurrency.length,
      total,
      totalUSD: convertToUSD(total, currency)
    }
  })
  return stats
})
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Sistema Multi-Moeda - Dashboard de Pagamentos</h1>
    
    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por Moeda:</label>
        <select v-model="selectedCurrency" class="w-full p-2 border border-gray-300 rounded-md">
          <option value="all">Todas as Moedas</option>
          <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
            {{ currency.code }} - {{ currency.name }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por Empresa:</label>
        <select v-model="selectedCompany" class="w-full p-2 border border-gray-300 rounded-md">
          <option value="all">Todas as Empresas</option>
          <option v-for="company in uniqueCompanies" :key="company" :value="company">
            {{ company }}
          </option>
        </select>
      </div>
    </div>

    <!-- Estatísticas por Moeda -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="stat in statsByCurrency" :key="stat.currency.code" 
           class="bg-white p-6 rounded-lg border shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ stat.currency.name }} ({{ stat.currency.code }})
        </h3>
        <div class="space-y-2">
          <p class="text-sm text-gray-600">Pagamentos: {{ stat.count }}</p>
          <p class="text-lg font-bold text-blue-600">
            {{ formatCurrency(stat.total, stat.currency) }}
          </p>
          <p class="text-sm text-gray-500">
            ≈ {{ formatCurrency(stat.totalUSD, { code: 'USD' }) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Total Geral -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h2 class="text-xl font-bold text-blue-900 mb-2">Total Geral (USD)</h2>
      <p class="text-3xl font-bold text-blue-600">
        {{ formatCurrency(totalInUSD, { code: 'USD' }) }}
      </p>
      <p class="text-sm text-blue-700 mt-2">
        Baseado em {{ payments.length }} pagamentos de {{ uniqueCompanies.length }} empresas
      </p>
    </div>

    <!-- Tabela de Pagamentos -->
    <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          Pagamentos ({{ filteredPayments.length }})
        </h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Moeda
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subsidiária
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payment in filteredPayments" :key="payment.id" 
                class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ payment.company }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ payment.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(payment.amount, payment.currency) }}
                </div>
                <div class="text-sm text-gray-500">
                  ≈ {{ formatCurrency(convertToUSD(payment.amount, payment.currency), { code: 'USD' }) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-800': payment.currency.code === 'USD',
                        'bg-blue-100 text-blue-800': payment.currency.code === 'EUR',
                        'bg-yellow-100 text-yellow-800': payment.currency.code === 'BRL'
                      }">
                  {{ payment.currency.code }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-800': payment.status === 'success',
                        'bg-yellow-100 text-yellow-800': payment.status === 'pending',
                        'bg-blue-100 text-blue-800': payment.status === 'processing',
                        'bg-red-100 text-red-800': payment.status === 'failed'
                      }">
                  {{ payment.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ new Date(payment.date).toLocaleDateString('pt-BR') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ payment.subsidiaryCompany }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Resumo de Empregados -->
    <div class="mt-8 bg-white rounded-lg border shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          Empregados por Empresa ({{ workers.length }})
        </h2>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="company in uniqueCompanies" :key="company" 
               class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">{{ company }}</h3>
            <div class="space-y-1">
              <div v-for="worker in workers.filter(w => w.company === company)" 
                   :key="worker.id" class="text-sm">
                <span class="text-gray-900">{{ worker.name }}</span>
                <span class="text-gray-500 ml-2">({{ worker.role }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>
