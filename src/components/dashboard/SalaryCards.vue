<template>
  <div class="space-y-6">
    <!-- Cards de Resumo Salarial -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Custo Mensal Total -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Custo Mensal Total</p>
            <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(totalMonthlyCosts, { code: 'BRL' }) }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <i class="fas fa-money-bills text-blue-600 text-xl"></i>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-blue-600 flex items-center">
            <i class="fas fa-arrow-up text-xs mr-1"></i>
            +6.8% vs período anterior
          </span>
        </div>
      </div>

      <!-- Custo Médio por Projeto -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Custo Médio por Projeto</p>
            <p class="text-2xl font-bold text-yellow-600">{{ formatCurrency(averageProjectCost, { code: 'BRL' }) }}</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <i class="fas fa-chart-bar text-yellow-600 text-xl"></i>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-500">Média de custos por empresa</span>
        </div>
      </div>

      <!-- Maior Salário -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Maior Salário</p>
            <p class="text-2xl font-bold text-green-600">
              {{ highestPaidWorker ? formatCurrency(highestPaidWorker.monthlySalaryBRL, { code: 'BRL' }) : 'N/A' }}
            </p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <i class="fas fa-crown text-green-600 text-xl"></i>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-green-600">
            {{ highestPaidWorker ? highestPaidWorker.name : 'Nenhum profissional' }}
          </span>
        </div>
      </div>

      <!-- Total de Profissionais -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total de Profissionais</p>
            <p class="text-2xl font-bold text-purple-600">{{ filteredWorkers.length }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-full">
            <i class="fas fa-users text-purple-600 text-xl"></i>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-500">Distribuídos nos projetos</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Worker {
  id: string
  name: string
  monthlySalaryBRL: number
}

interface Props {
  totalMonthlyCosts: number
  averageProjectCost: number
  highestPaidWorker: Worker | null
  filteredWorkers: Array<any>
  formatCurrency: (amount: number, currency: any) => string
}

defineProps<Props>()
</script>

<!-- SalaryCards uses only Tailwind CSS -->
