<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Total Geral -->
    <Chart 
      title="Total Geral (BRL)" 
      :value="formatCurrency(totalInBRL, { code: 'BRL' })"
      :description="`${filteredPayments.length} pagamentos filtrados`"
      color="green"
      trend="up"
      trend-value="+12.5%"
    />
    
    <!-- Estatísticas por Moeda -->
    <Chart 
      v-for="stat in statsByCurrency" 
      :key="stat.currency.code"
      :title="`Total ${stat.currency.code}`"
      :value="formatCurrency(stat.total, stat.currency)"
      :description="`${stat.count} pagamentos`"
      :color="stat.currency.code === 'BRL' ? 'green' : stat.currency.code === 'EUR' ? 'blue' : 'yellow'"
      trend="neutral"
      :trend-value="`≈ ${formatCurrency(stat.totalBRL, { code: 'BRL' })}`"
    />
  </div>
</template>

<script setup lang="ts">
import Chart from '@/components/ui/Chart.vue'

// Props
interface Props {
  totalInBRL: number
  filteredPayments: any[]
  statsByCurrency: any[]
  formatCurrency: (amount: number, currency: any) => string
}

defineProps<Props>()
</script>
