<template>
  <div class="space-y-6">
    <!-- Cards de Analytics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total de Pagamentos -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total de Pagamentos</p>
            <p class="text-2xl font-bold text-gray-900">{{ filteredPayments.length }}</p>
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-gray-500">Filtrados no período</span>
        </div>
      </div>

      <!-- Total em BRL -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Geral (BRL)</p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalInBRL, { code: 'BRL' }) }}</p>
          </div>

        </div>
        <div class="mt-2">
          <span class="text-sm text-green-600 flex items-center">
            <i class="fas fa-arrow-up text-xs mr-1"></i>
            +12.5% vs último período
          </span>
        </div>
      </div>

      <!-- Total de Profissionais -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Profissionais</p>
            <p class="text-2xl font-bold text-gray-900">{{ filteredWorkers.length }}</p>
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-gray-500">Ativos nos projetos</span>
        </div>
      </div>

      <!-- Total de Faturas -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Faturas</p>
            <p class="text-2xl font-bold text-gray-900">{{ filteredInvoices.length }}</p>
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-gray-500">Em processamento</span>
        </div>
      </div>
    </div>

    <!-- Estatísticas por Moeda -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Distribuição por Moeda</h3>
        <p class="text-sm text-gray-600 mt-1">Valores totais organizados por moeda</p>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="stat in statsByCurrency" 
            :key="stat.currency.code"
            class="relative overflow-hidden rounded-lg border border-gray-200 p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ stat.currency.name }}</p>
                <p class="text-xl font-bold text-gray-900">
                  {{ formatCurrency(stat.total, stat.currency) }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ stat.count }} pagamentos
                </p>
              </div>
              <div 
                class="p-2"
                :class="{
                  'bg-green-100': stat.currency.code === 'USD',
                  'bg-blue-100': stat.currency.code === 'EUR',
                  'bg-yellow-100': stat.currency.code === 'BRL'
                }"
              >
                <span 
                  class="text-lg font-bold"
                  :class="{
                    'text-green-600': stat.currency.code === 'USD',
                    'text-blue-600': stat.currency.code === 'EUR',
                    'text-yellow-600': stat.currency.code === 'BRL'
                  }"
                >
                  {{ stat.currency.code }}
                </span>
              </div>
            </div>
            
            <!-- Equivalência em BRL -->
            <div class="mt-3 pt-3 border-t border-gray-100">
              <p class="text-xs text-gray-500">Equivalente em BRL:</p>
              <p class="text-sm font-medium text-gray-700">
                {{ formatCurrency(stat.totalBRL, { code: 'BRL' }) }}
              </p>
            </div>

            <!-- Barra de progresso visual -->
            <div class="mt-3">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :class="{
                    'bg-green-500': stat.currency.code === 'USD',
                    'bg-blue-500': stat.currency.code === 'EUR',
                    'bg-yellow-500': stat.currency.code === 'BRL'
                  }"
                  :style="{ 
                    width: `${totalInBRL > 0 ? (stat.totalBRL / totalInBRL * 100) : 0}%` 
                  }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ totalInBRL > 0 ? (stat.totalBRL / totalInBRL * 100).toFixed(1) : '0.0' }}% do total
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfico de Tendências Simples -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Resumo Visual</h3>
        <p class="text-sm text-gray-600 mt-1">Comparação visual dos totais por moeda</p>
      </div>
      
      <div class="p-6">
        <div class="space-y-4">
          <div 
            v-for="stat in statsByCurrency" 
            :key="stat.currency.code + '_chart'"
            class="flex items-center space-x-4"
          >
            <div class="w-20 text-sm font-medium text-gray-700">
              {{ stat.currency.code }}
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-600">{{ stat.count }} pagamentos</span>
                <span class="font-medium text-gray-900">
                  {{ formatCurrency(stat.totalBRL, { code: 'BRL' }) }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="h-3 rounded-full transition-all duration-700"
                  :class="{
                    'bg-green-500': stat.currency.code === 'USD',
                    'bg-blue-500': stat.currency.code === 'EUR',
                    'bg-yellow-500': stat.currency.code === 'BRL'
                  }"
                  :style="{ 
                    width: `${totalInBRL > 0 ? (stat.totalBRL / totalInBRL * 100) : 0}%` 
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Currency {
  code: string
  name: string
}

interface Payment {
  id: string
  amount: number
  currency: Currency
}

interface Worker {
  id: string
  name: string
}

interface Invoice {
  id: string
  amount: number
  currency: Currency
}

interface CurrencyStats {
  currency: Currency
  count: number
  total: number
  totalBRL: number
}

interface Props {
  totalInBRL: number
  filteredPayments: Payment[]
  filteredWorkers: Worker[]
  filteredInvoices: Invoice[]
  statsByCurrency: CurrencyStats[]
  formatCurrency: (amount: number, currency: any) => string
}

defineProps<Props>()
</script>

<!-- AnalyticsSection uses only Tailwind CSS -->
