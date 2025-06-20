<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center justify-between">
        <span><i class="fas fa-filter mr-2"></i>Filtros</span>
        <div class="flex items-center space-x-2">
          <span v-if="hasActiveFilters" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <i class="fas fa-check-circle mr-1"></i>
            Filtros Ativos
          </span>
          <Button v-if="hasActiveFilters" variant="outline" size="sm" @click="$emit('clearFilters')">
            <i class="fas fa-times mr-2"></i>
            Limpar Filtros
          </Button>
        </div>
      </CardTitle>
      <CardDescription>
        Filtre os dados por moeda e empresa
        <span v-if="hasActiveFilters" class="block mt-1 text-blue-600">
          <i class="fas fa-info-circle mr-1"></i>
          Mostrando {{ filteredPayments.length }} de {{ totalPayments }} pagamentos
        </span>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-coins mr-2"></i>Moeda:
          </label>
          <select 
            :value="selectedCurrency" 
            @change="$emit('update:selectedCurrency', ($event.target as HTMLSelectElement).value)"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas as Moedas</option>
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-building mr-2"></i>Empresa:
          </label>
          <select 
            :value="selectedCompany" 
            @change="$emit('update:selectedCompany', ($event.target as HTMLSelectElement).value)"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas as Empresas</option>
            <option v-for="company in allCompanies" :key="company" :value="company">
              {{ company }}
            </option>
          </select>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'

// Props
interface Props {
  selectedCurrency: string
  selectedCompany: string
  currencies: any[]
  allCompanies: string[]
  hasActiveFilters: boolean
  filteredPayments: any[]
  totalPayments: number
}

defineProps<Props>()

// Emits
defineEmits<{
  'update:selectedCurrency': [value: string]
  'update:selectedCompany': [value: string]
  clearFilters: []
}>()
</script>
