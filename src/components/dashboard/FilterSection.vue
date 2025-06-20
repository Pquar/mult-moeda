<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'

interface Props {
  selectedCurrency: string
  selectedCompany: string
  selectedSubsidiaryCompany: string
  allCompanies: string[]
  allSubsidiaryCompanies: Array<{ code: string, name: string }>
  currencies: Array<{ code: string, name: string }>
  hasActiveFilters: boolean
}

interface Emits {
  (e: 'update:selectedCurrency', value: string): void
  (e: 'update:selectedCompany', value: string): void
  (e: 'update:selectedSubsidiaryCompany', value: string): void
  (e: 'clearFilters'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const updateCurrency = (value: string) => {
  emit('update:selectedCurrency', value)
}

const updateCompany = (value: string) => {
  emit('update:selectedCompany', value)
}

const updateSubsidiaryCompany = (value: string) => {
  emit('update:selectedSubsidiaryCompany', value)
}

const clearFilters = () => {
  emit('clearFilters')
}
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="flex items-center gap-2">
            <i class="fas fa-filter text-blue-600"></i>
            <span>Filtros</span>
          </CardTitle>
          <CardDescription>
            Filtre os dados por moeda e empresa para análises específicas
          </CardDescription>
        </div>
        <div class="flex items-center space-x-2">
          <span v-if="hasActiveFilters" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Filtros ativos
          </span>
          <Button 
            v-if="hasActiveFilters" 
            variant="outline" 
            size="sm" 
            @click="clearFilters"
            class="text-xs"
          >
            <i class="fas fa-times w-3 h-3 mr-1"></i>
            Limpar
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Filtro de Moeda -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Moeda</label>
          <select 
            :value="selectedCurrency"
            @change="updateCurrency(($event.target as HTMLSelectElement).value)"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e')] bg-[length:1.5em_1.5em] bg-[position:right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="all">Todas as moedas</option>
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>

        <!-- Filtro de Empresa -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Empresa</label>
          <select 
            :value="selectedCompany"
            @change="updateCompany(($event.target as HTMLSelectElement).value)"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e')] bg-[length:1.5em_1.5em] bg-[position:right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="all">Todas as empresas</option>
            <option v-for="company in allCompanies" :key="company" :value="company">
              {{ company }}
            </option>
          </select>
        </div>

        <!-- Filtro de Empresa Subsidiária -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Empresa Subsidiária</label>
          <select 
            :value="selectedSubsidiaryCompany"
            @change="updateSubsidiaryCompany(($event.target as HTMLSelectElement).value)"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e')] bg-[length:1.5em_1.5em] bg-[position:right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="all">Todas as subsidiárias</option>
            <option v-for="subsidiaryCompany in allSubsidiaryCompanies" :key="subsidiaryCompany.code" :value="subsidiaryCompany.code">
              {{ subsidiaryCompany.code }} - {{ subsidiaryCompany.name }}
            </option>
          </select>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<!-- FilterSection uses only Tailwind CSS -->
