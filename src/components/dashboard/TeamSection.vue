<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Faturas Recentes</h3>
              <p class="text-sm text-gray-600 mt-1">{{ filteredInvoices.length }} faturas filtradas</p>
            </div>
            <button
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="$emit('exportInvoices')"
            >
              <i class="fas fa-file-export w-4 h-4 mr-2"></i>
              Exportar CSV
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div v-if="filteredInvoices.length === 0" class="text-center py-8">
            <div class="text-gray-500">
              <i class="fas fa-receipt text-3xl mb-4"></i>
            </div>
            <h3 class="text-sm font-medium text-gray-900 mb-2">Nenhuma fatura encontrada</h3>
            <p class="text-sm text-gray-500">
              Não há faturas que correspondam aos filtros selecionados.
            </p>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="invoice in filteredInvoices.slice(0, 6)" 
              :key="invoice.id" 
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i class="fas fa-file-invoice text-blue-600"></i>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ invoice.company }}</p>
                    <p class="text-sm text-gray-500 truncate">{{ invoice.invoiceNumber || `#${invoice.id}` }}</p>
                    <p class="text-xs text-gray-400">{{ invoice.client || 'Cliente não especificado' }}</p>
                  </div>
                </div>
              </div>
              
              <div class="text-right ml-4">
                <p class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(invoice.amount, invoice.currency) }}
                </p>
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': invoice.status === 'success',
                    'bg-yellow-100 text-yellow-800': invoice.status === 'pending',
                    'bg-blue-100 text-blue-800': invoice.status === 'processing',
                    'bg-red-100 text-red-800': invoice.status === 'failed'
                  }"
                >
                  {{ getStatusLabel(invoice.status) }}
                </span>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatDate(invoice.dueDate || invoice.date) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredInvoices.length > 6" class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button class="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver Todas as Faturas ({{ filteredInvoices.length }})
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Equipe por Empresa</h3>
              <p class="text-sm text-gray-600 mt-1">{{ filteredWorkers.length }} profissionais filtrados</p>
            </div>
            <button
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="$emit('exportWorkers')"
            >
              <i class="fas fa-users w-4 h-4 mr-2"></i>
              Exportar Equipes
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div v-if="uniqueCompanies.length === 0" class="text-center py-8">
            <div class="text-gray-500">
              <i class="fas fa-building text-3xl mb-4"></i>
            </div>
            <h3 class="text-sm font-medium text-gray-900 mb-2">Nenhuma empresa encontrada</h3>
            <p class="text-sm text-gray-500">
              Não há empresas que correspondam aos filtros selecionados.
            </p>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="company in uniqueCompanies.slice(0, 8)" 
              :key="company" 
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-building text-purple-600"></i>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ company }}</p>
                  <p class="text-sm text-gray-500">
                    {{ getCompanyWorkers(company).length }} funcionários
                  </p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm text-gray-900">
                    {{ getCompanyWorkers(company).length }} pessoas
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ getUniqueRolesInCompany(company).length }} cargos diferentes
                  </p>
                </div>
                
                <div class="flex -space-x-1">
                  <div 
                    v-for="worker in getCompanyWorkers(company).slice(0, 4)" 
                    :key="worker.id"
                    class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                    :title="worker.name"
                  >
                    {{ getInitials(worker.name) }}
                  </div>
                  <div 
                    v-if="getCompanyWorkers(company).length > 4"
                    class="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                  >
                    +{{ getCompanyWorkers(company).length - 4 }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="uniqueCompanies.length > 8" class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button class="w-full text-sm text-purple-600 hover:text-purple-700 font-medium">
            Gerenciar Todas as Equipes ({{ uniqueCompanies.length }} empresas)
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Análise por Cargo</h3>
        <p class="text-sm text-gray-600 mt-1">Distribuição de profissionais por função</p>
      </div>
      
      <div class="p-6">
        <div v-if="uniqueRoles.length === 0" class="text-center py-8">
          <div class="text-gray-500">
            <i class="fas fa-user-tie text-3xl mb-4"></i>
          </div>
          <h3 class="text-sm font-medium text-gray-900 mb-2">Nenhum cargo encontrado</h3>
          <p class="text-sm text-gray-500">
            Não há cargos que correspondam aos filtros selecionados.
          </p>
        </div>
        
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div 
            v-for="role in uniqueRoles" 
            :key="role" 
            class="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div class="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-blue-600 text-lg"></i>
            </div>
            <div class="text-2xl font-bold text-blue-600 mb-1">
              {{ getRoleCount(role) }}
            </div>
            <div class="text-sm text-gray-600 font-medium">{{ role }}</div>
            <div class="text-xs text-gray-500 mt-1">
              {{ getRoleCompanies(role).length }} empresas
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
}

interface Invoice {
  id: string
  company: string
  client?: string
  amount: number
  currency: Currency
  status: string
  dueDate?: string
  date?: string
  invoiceNumber?: string
}

interface Worker {
  id: string
  name: string
  email: string
  role: string
  company: string
  currency: Currency
  hourlyRate: number
  hoursWorked: number
}

interface Props {
  filteredInvoices: Invoice[]
  filteredWorkers: Worker[]
  uniqueCompanies: string[]
  uniqueRoles: string[]
  formatCurrency: (amount: number, currency: any) => string
}

const props = defineProps<Props>()

defineEmits<{
  exportInvoices: []
  exportWorkers: []
}>()

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'success': 'Pago',
    'pending': 'Pendente',
    'processing': 'Processando',
    'failed': 'Falhou'
  }
  return labels[status] || status
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const getInitials = (name: string) => {
  return name.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getCompanyWorkers = (company: string) => {
  return props.filteredWorkers.filter(w => w.company === company)
}

const getUniqueRolesInCompany = (company: string) => {
  const workers = getCompanyWorkers(company)
  return [...new Set(workers.map(w => w.role))]
}

const getRoleCount = (role: string) => {
  return props.filteredWorkers.filter(w => w.role === role).length
}

const getRoleCompanies = (role: string) => {
  const workers = props.filteredWorkers.filter(w => w.role === role)
  return [...new Set(workers.map(w => w.company))]
}
</script>