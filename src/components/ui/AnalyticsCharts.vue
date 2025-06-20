<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Receita Total</CardTitle>
          <CardDescription>Receita acumulada de todos os pagamentos da 5 maiores empresas</CardDescription>
        </CardHeader>
        <ChartArea
title="Receita Total" :value="formatCurrency(totalRevenue, { code: 'BRL' })"
          description="Soma de todos os pagamentos" color="green" :data="revenueChartData" />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custos Totais</CardTitle>
          <CardDescription>Distribuição dos gastos por empresa</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold mb-2">{{ formatCurrency(totalCosts, { code: 'BRL' }) }}</div>
          <div class="w-full">
            <ChartPie :data="costsDistributionData" :size="140" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lucro Total</CardTitle>
          <CardDescription>{{ totalProfit >= 0 ? 'Lucro positivo' : 'Prejuízo' }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold" :class="totalProfit >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatCurrency(totalProfit, { code: 'BRL' }) }}
          </div>
          <div class="text-sm text-gray-600 mt-2">
            Margem: {{ overallProfitMargin.toFixed(1) }}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Margem de Lucro</CardTitle>
          <CardDescription>Margem média de lucro das empresas</CardDescription>
        </CardHeader>
        <ChartArea
title="Margem de Lucro" :value="`${overallProfitMargin.toFixed(1)}%`" description="Lucro / Receita"
          :color="overallProfitMargin >= 20 ? 'green' : overallProfitMargin >= 10 ? 'yellow' : 'red'"
          :data="marginTrendData" />
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Composição Financeira por Empresa</CardTitle>
        <CardDescription>Receita total (verde) e custos (vermelho) na mesma coluna - Top 5 empresas</CardDescription>
      </CardHeader>        <CardContent>
          <div class="w-full">
            <ChartStackedColumn :data="profitColumnData" :height="200" />
          </div>
        </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Receita por Empresa</CardTitle>
        <CardDescription>Visualização da participação de cada empresa na receita total</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="w-full">
          <ChartPie :data="companyDistributionData" :size="200" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Comparativo Visual - Top 5 Empresas</CardTitle>
        <CardDescription>Receita vs. Custos vs. Lucro das empresas mais lucrativas</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <div v-for="company in profitsByCompany.slice(0, 5)" :key="company.company" class="space-y-2">

            <div class="flex items-center justify-between">
              <h4 class="font-medium">{{ company.company }}</h4>
              <div class="text-sm text-muted-foreground">
                Lucro: {{ formatCurrency(company.profit, { code: 'BRL' }) }}
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <div class="w-16 text-xs text-muted-foreground">Receita</div>
                <div class="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div
class="bg-green-500 h-4 rounded-full transition-all duration-500"
                    :style="{ width: `${Math.min((company.revenue / Math.max(...profitsByCompany.map(c => c.revenue))) * 100, 100)}%` }">
                  </div>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {{ formatCurrency(company.revenue, { code: 'BRL' }) }}
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <div class="w-16 text-xs text-muted-foreground">Custos</div>
                <div class="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div
class="bg-red-500 h-4 rounded-full transition-all duration-500"
                    :style="{ width: `${Math.min((company.costs / Math.max(...profitsByCompany.map(c => c.revenue))) * 100, 100)}%` }">
                  </div>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {{ formatCurrency(company.costs, { code: 'BRL' }) }}
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <div class="w-16 text-xs text-muted-foreground">Lucro</div>
                <div class="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div
class="h-4 rounded-full transition-all duration-500"
                    :class="company.profit >= 0 ? 'bg-green-600' : 'bg-red-600'"
                    :style="{ width: `${Math.min(Math.abs(company.profit) / Math.max(...profitsByCompany.map(c => Math.abs(c.profit))) * 100, 100)}%` }">
                  </div>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {{ formatCurrency(company.profit, { code: 'BRL' }) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import ChartArea from '@/components/ui/ChartArea.vue'
import ChartPie from '@/components/ui/ChartPie.vue'
import ChartStackedColumn from '@/components/ui/ChartStackedColumn.vue'

interface Props {
  totalRevenue: number
  totalCosts: number
  totalProfit: number
  overallProfitMargin: number
  profitsByCompany: any[]
  formatCurrency: (amount: number, currency: any) => string
}

const props = defineProps<Props>()

const revenueChartData = computed(() => {
  return [...props.profitsByCompany]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((company, index) => ({
    label: company.company,
    value: company.revenue,
    color: `hsl(${120 + index * 30}, 65%, 50%)`
  }))
})

const marginTrendData = computed(() => {
  return props.profitsByCompany.slice(0, 6).map((company) => ({
    label: company.company,
    value: company.profitMargin,
    color: company.profitMargin >= 20 ? '#10B981' : company.profitMargin >= 10 ? '#F59E0B' : '#EF4444'
  }))
})

const companyDistributionData = computed(() => {
  return props.profitsByCompany.map((company, index) => ({
    label: company.company,
    value: company.revenue,
    color: `hsl(${index * 360 / props.profitsByCompany.length}, 65%, 50%)`
  }))
})

const costsDistributionData = computed(() => {
  return props.profitsByCompany.map((company, index) => ({
    label: company.company,
    value: company.costs,
    color: `hsl(${index * 360 / props.profitsByCompany.length + 180}, 65%, 45%)`
  }))
})

const profitColumnData = computed(() => {
  const topCompanies = props.profitsByCompany.slice(0, 5)
  
  return topCompanies.map((company) => ({
    label: company.company,
    segments: [
      {
        value: company.revenue,
        color: '#10B981',
        name: 'Receita',
        tooltip: `${props.formatCurrency(company.revenue, { code: 'BRL' })}`
      },
      {
        value: company.costs,
        color: '#EF4444',
        name: 'Custos',
        tooltip: `${props.formatCurrency(company.costs, { code: 'BRL' })}`
      }
    ]
  }))
})
</script>
