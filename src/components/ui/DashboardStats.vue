<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

    <Chart 
      :title="`Total Geral (${baseCurrency})`" 
      :value="formatCurrency(totalInBaseCurrency, { code: baseCurrency })"
      :description="`${filteredPayments.length} pagamentos filtrados`"
      color="green"
      trend="up"
      trend-value="+12.5%"
    />

    <Chart 
      v-for="stat in statsByCurrency" 
      :key="stat.currency.code"
      :title="`Total ${stat.currency.code}`"
      :value="formatCurrency(stat.total, stat.currency)"
      :description="`${stat.count} pagamentos`"
      :color="stat.currency.code === 'BRL' ? 'green' : stat.currency.code === 'EUR' ? 'blue' : 'yellow'"
      trend="neutral"
      :trend-value="`≈ ${formatCurrency(stat.totalInBaseCurrency, { code: baseCurrency })}`"
    />
  </div>
</template>

<script setup lang="ts">
import Chart from '@/components/ui/Chart.vue'

interface Props {
  totalInBRL: number
  totalInBaseCurrency: number
  baseCurrency: string
  filteredPayments: any[]
  statsByCurrency: any[]
  formatCurrency: (amount: number, currency: any) => string
}

defineProps<Props>()
</script>
