<script setup lang="ts">
import Chart from '@/components/ui/Chart.vue'

interface Props {
  totalInBRL: number
  filteredPayments: Array<any>
  filteredWorkers: Array<any>
  filteredInvoices: Array<any>
  statsByCurrency: Array<{
    currency: { code: string, name: string }
    count: number
    total: number
    totalBRL: number
  }>
  formatCurrency: (amount: number, currency: any) => string
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Geral -->
    <Chart 
      title="Total Geral" 
      :value="formatCurrency(totalInBRL, { code: 'BRL' })"
      description="Valor total em Real Brasileiro"
      color="blue"
      trend="up"
      trend-value="+12.5%"
    />
    
    <!-- Pagamentos -->
    <Chart 
      title="Pagamentos" 
      :value="filteredPayments.length.toString()"
      description="Total de transações registradas"
      color="green"
      trend="up"
      trend-value="+5.2%"
    />
    
    <!-- Profissionais -->
    <Chart 
      title="Profissionais" 
      :value="filteredWorkers.length.toString()"
      description="Equipe ativa no sistema"
      color="purple"
      trend="up"
      trend-value="+2.1%"
    />
    
    <!-- Faturas -->
    <Chart 
      title="Faturas" 
      :value="filteredInvoices.length.toString()"
      description="Documentos fiscais emitidos"
      color="yellow"
      trend="neutral"
    />
  </div>

  <!-- Estatísticas por Moeda -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Chart 
      v-for="stat in statsByCurrency.filter(s => s.count > 0)" 
      :key="stat.currency.code"
      :title="`${stat.currency.code} (${stat.count})`" 
      :value="formatCurrency(stat.total, stat.currency)"
      :description="`≈ ${formatCurrency(stat.totalBRL, { code: 'BRL' })}`"
      color="blue"
      trend="neutral"
    />
  </div>
</template>
