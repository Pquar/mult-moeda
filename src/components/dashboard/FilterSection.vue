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
  currencies: Array<{ code: string, name: string, value: number }>
  hasActiveFilters: boolean
  baseCurrency: string
  currencyRates: { [key: string]: number }
}

interface Emits {
  (e: 'update:selectedCurrency', value: string): void
  (e: 'update:selectedCompany', value: string): void
  (e: 'update:selectedSubsidiaryCompany', value: string): void
  (e: 'update:baseCurrency', value: string): void
  (e: 'update:currencyRate', currencyCode: string, rate: number): void
  (e: 'resetCurrencyRates'): void
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

const updateBaseCurrency = (value: string) => {
  emit('update:baseCurrency', value)
}

const updateCurrencyRate = (currencyCode: string, rate: number) => {
  emit('update:currencyRate', currencyCode, rate)
}

const resetCurrencyRates = () => {
  emit('resetCurrencyRates')
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
            Filtre os dados por moeda, empresa e subsidiária. Ajuste também as taxas de câmbio para análises específicas
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
            class="text-xs"
            @click="clearFilters"
          >
            <i class="fas fa-times w-3 h-3 mr-1"></i>
            Limpar
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Moeda</label>
          <select 
            :value="selectedCurrency"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e')] bg-[length:1.5em_1.5em] bg-[position:right_0.5rem_center] bg-no-repeat pr-10"
            @change="updateCurrency(($event.target as HTMLSelectElement).value)"
          >
            <option value="all">Todas as moedas</option>
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Empresa</label>
          <select 
            :value="selectedCompany"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e')] bg-[length:1.5em_1.5em] bg-[position:right_0.5rem_center] bg-no-repeat pr-10"
            @change="updateCompany(($event.target as HTMLSelectElement).value)"
          >
            <option value="all">Todas as empresas</option>
            <option v-for="company in allCompanies" :key="company" :value="company">
              {{ company }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Empresa Subsidiária</label>
          <select 
            :value="selectedSubsidiaryCompany"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e')] bg-[length:1.5em_1.5em] bg-[position:right_0.5rem_center] bg-no-repeat pr-10"
            @change="updateSubsidiaryCompany(($event.target as HTMLSelectElement).value)"
          >
            <option value="all">Todas as subsidiárias</option>
            <option v-for="subsidiaryCompany in allSubsidiaryCompanies" :key="subsidiaryCompany.code" :value="subsidiaryCompany.code">
              {{ subsidiaryCompany.code }} - {{ subsidiaryCompany.name }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Moeda Base do Sistema</label>
          <select 
            :value="baseCurrency"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e')] bg-[length:1.5em_1.5em] bg-[position:right_0.5rem_center] bg-no-repeat pr-10"
            @change="updateBaseCurrency(($event.target as HTMLSelectElement).value)"
          >
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
          <p class="text-xs text-gray-500">
            <i class="fas fa-info-circle mr-1"></i>
            Todos os valores serão convertidos para {{ baseCurrency }}
          </p>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-6">
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <i class="fas fa-exchange-alt text-blue-600"></i>
            Taxas de Conversão (1 BRL = ? da moeda)
          </h4>
          <p class="text-xs text-gray-500 mt-1">
            Ajuste as taxas de conversão das moedas. BRL é sempre 1.0 (moeda base)
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            v-for="currency in currencies.filter(c => c.code !== 'BRL')" 
            :key="currency.code" 
            class="space-y-2"
          >
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span 
                class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                :class="{
                  'bg-green-500': currency.code === 'USD',
                  'bg-blue-500': currency.code === 'EUR',
                  'bg-purple-500': currency.code === 'GBP'
                }"
              >
                {{ currency.code.charAt(0) }}
              </span>
              {{ currency.code }} - {{ currency.name }}
            </label>
            <div class="relative">
              <input 
                type="number"
                :value="currencyRates[currency.code] || currency.value"
                step="0.01"
                min="0.001"
                :placeholder="currency.value.toFixed(3)"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white pr-16"
                @input="updateCurrencyRate(currency.code, parseFloat(($event.target as HTMLInputElement).value))"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span class="text-gray-500 text-sm">{{ currency.code }}</span>
              </div>
            </div>
            <p class="text-xs text-gray-500">
              Padrão: {{ currency.value.toFixed(3) }} {{ currency.code }}
              <span class="text-gray-400">
                (1 {{ currency.code }} = {{ (1 / currency.value).toFixed(2) }} BRL)
              </span>
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white bg-yellow-500">
                B
              </span>
              BRL - Brazilian Real (Base)
            </label>
            <div class="relative">
              <input 
                type="number"
                value="1.000"
                disabled
                class="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 pr-16"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span class="text-gray-400 text-sm">BRL</span>
              </div>
            </div>
            <p class="text-xs text-gray-500">
              Moeda base de referência (sempre 1.0)
            </p>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            class="text-xs"
            @click="resetCurrencyRates"
          >
            <i class="fas fa-undo w-3 h-3 mr-1"></i>
            Resetar Taxas Padrão
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>