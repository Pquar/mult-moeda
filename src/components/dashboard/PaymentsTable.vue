<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            Pagamentos ({{ filteredPayments.length }})
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            Lista completa de todos os pagamentos registrados
          </p>
        </div>
        <button
          @click="$emit('exportPayments')"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i class="fas fa-download w-4 h-4 mr-2"></i>
          Exportar CSV
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
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
          <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ payment.company }}</div>
                <div class="text-sm text-gray-500">{{ payment.email }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ formatCurrency(payment.amount, payment.currency) }}
              </div>
              <div class="text-sm text-gray-500">
                ≈ {{ formatCurrency(convertToBRL(payment.amount, payment.currency), { code: 'BRL' }) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800': payment.currency.code === 'USD',
                  'bg-blue-100 text-blue-800': payment.currency.code === 'EUR',
                  'bg-yellow-100 text-yellow-800': payment.currency.code === 'BRL'
                }"
              >
                {{ payment.currency.code }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800': payment.status === 'success',
                  'bg-yellow-100 text-yellow-800': payment.status === 'pending',
                  'bg-blue-100 text-blue-800': payment.status === 'processing',
                  'bg-red-100 text-red-800': payment.status === 'failed'
                }"
              >
                {{ payment.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ new Date(payment.date).toLocaleDateString('pt-BR') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ payment.subsidiaryCompany }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredPayments.length === 0" class="text-center py-8">
      <div class="text-gray-500">
        <i class="fas fa-file-invoice text-3xl mb-4"></i>
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-2">Nenhum pagamento encontrado</h3>
      <p class="text-sm text-gray-500">
        Não há pagamentos que correspondam aos filtros selecionados.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Payment {
  id: string
  company: string
  email: string
  amount: number
  currency: { code: string }
  status: string
  date: string
  subsidiaryCompany: string
}

interface Props {
  filteredPayments: Payment[]
  formatCurrency: (amount: number, currency: any) => string
  convertToBRL: (amount: number, currency: any) => number
}

defineProps<Props>()
defineEmits<{
  exportPayments: []
}>()
</script>

<!-- PaymentsTable uses only Tailwind CSS -->
