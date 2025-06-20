<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Custos Mensais por Projeto</h3>
          <p class="text-sm text-gray-600 mt-1">
            Detalhamento dos custos mensais com profissionais por empresa
            <span v-if="hasActiveFilters" class="block mt-1 text-blue-600">
              Dados filtrados: {{ monthlySalariesByProject.length }} projetos
            </span>
          </p>
        </div>
        <button
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="$emit('exportWorkers')"
        >
          <i class="fas fa-users w-4 h-4 mr-2"></i>
          Exportar Profissionais
        </button>
      </div>
    </div>

    <div class="p-6">
      <div v-if="monthlySalariesByProject.length === 0" class="text-center py-8">
        <div class="text-gray-500">
          <i class="fas fa-briefcase text-3xl mb-4"></i>
        </div>
        <h3 class="text-sm font-medium text-gray-900 mb-2">Nenhum projeto encontrado</h3>
        <p class="text-sm text-gray-500">
          Não há projetos que correspondam aos filtros selecionados.
        </p>
      </div>

      <div v-else class="space-y-8">
        <div 
          v-for="project in monthlySalariesByProject" 
          :key="project.project" 
          class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ project.project }}</h3>
              <p class="text-sm text-gray-500">
                {{ project.workerCount }} profissionais • {{ project.paymentsCount }} pagamentos •
                Custo mensal: {{ formatCurrency(project.totalMonthlyCost, { code: 'BRL' }) }}
              </p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600">
                {{ formatCurrency(project.projectRevenue, { code: 'BRL' }) }}
              </div>
              <div class="text-sm text-gray-500">
                Receita do projeto
              </div>
              <div 
                class="text-sm mt-1" 
                :class="project.projectProfit >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                Lucro: {{ formatCurrency(project.projectProfit, { code: 'BRL' }) }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="worker in project.workers" 
              :key="worker.id" 
              class="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ worker.name }}</h4>
                  <p class="text-sm text-gray-500">{{ worker.role }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ worker.email }}</p>
                </div>
                <div class="ml-4 text-right">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-medium text-white">
                    {{ getInitials(worker.name) }}
                  </div>
                </div>
              </div>
              
              <div class="mt-4 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Taxa/hora:</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(worker.hourlyRate, worker.currency) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Horas/mês:</span>
                  <span class="font-medium text-gray-900">{{ worker.hoursWorked }}h</span>
                </div>
                <div class="flex justify-between text-sm border-t border-gray-200 pt-2">
                  <span class="text-gray-500">Salário original:</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(worker.monthlySalary || 0, worker.currency) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500 font-semibold">Salário (BRL):</span>
                  <span class="font-bold text-blue-600">{{ formatCurrency(worker.monthlySalaryBRL || 0, { code: 'BRL' }) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Participação na receita total</span>
              <span class="text-sm text-gray-500">
                {{ totalProjectRevenue > 0 ? ((project.projectRevenue / totalProjectRevenue) * 100).toFixed(1) : '0.0' }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-green-600 h-3 rounded-full transition-all duration-500"
                :style="{ width: `${totalProjectRevenue > 0 ? (project.projectRevenue / totalProjectRevenue) * 100 : 0}%` }"
              >
              </div>
            </div>
            
            <div class="mt-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Status financeiro</span>
                <span 
                  class="text-sm font-medium"
                  :class="project.projectProfit >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ project.projectProfit >= 0 ? 'Lucro' : 'Prejuízo' }}: {{ formatCurrency(Math.abs(project.projectProfit), { code: 'BRL' }) }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :class="project.projectProfit >= 0 ? 'bg-green-500' : 'bg-red-500'"
                  :style="{ width: `${project.projectRevenue > 0 ? Math.min((Math.abs(project.projectProfit) / project.projectRevenue) * 100, 100) : 0}%` }"
                >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="monthlySalariesByProject.length > 0" class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>
          Receita total: {{ formatCurrency(totalProjectRevenue, { code: 'BRL' }) }} • 
          Custo mensal: {{ formatCurrency(totalMonthlyCosts, { code: 'BRL' }) }} • 
          {{ filteredWorkers.length }} profissionais em {{ monthlySalariesByProject.length }} projetos
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Currency {
  code: string
}

interface Worker {
  id: string
  name: string
  email: string
  role: string
  hourlyRate: number
  hoursWorked: number
  currency: Currency
  monthlySalary?: number
  monthlySalaryBRL?: number
}

interface Project {
  project: string
  workers: Worker[]
  workerCount: number
  paymentsCount: number
  totalMonthlyCost: number
  projectRevenue: number
  projectProfit: number
}

interface Props {
  monthlySalariesByProject: Project[]
  totalProjectRevenue: number
  totalMonthlyCosts: number
  averageProjectCost: number
  highestPaidWorker: Worker | null
  filteredWorkers: Array<any> 
  hasActiveFilters: boolean
  formatCurrency: (amount: number, currency: any) => string
}

defineProps<Props>()

defineEmits<{
  exportWorkers: []
}>()

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>
