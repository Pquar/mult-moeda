<template>
    <div class="space-y-6">
        
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">Análise Financeira</h3>
                    <p class="text-sm text-gray-600 mt-1">
                        Relatórios de lucros, custos e performance por empresa
                    </p>
                </div>
                <div class="flex items-center space-x-3">
                    <button
class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        @click="$emit('exportProfits')">
                        <i class="fas fa-chart-line w-4 h-4 mr-2"></i>
                        Exportar Análise
                    </button>
                    <button
class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        @click="$emit('exportWorkers')">
                        <i class="fas fa-users w-4 h-4 mr-2"></i>
                        Exportar Profissionais
                    </button>
                </div>
            </div>
        </div>

        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Receita Total</p>
                        <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalRevenue, { code: 'BRL' }) }}
                        </p>
                    </div>
                </div>
                <div class="mt-4">
                    <span class="text-sm text-green-600 flex items-center">
                        <i class="fas fa-arrow-up text-xs mr-1"></i>
                        +8.2% vs período anterior
                    </span>
                </div>
            </div>

            
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Custos Totais</p>
                        <p class="text-2xl font-bold text-red-600">{{ formatCurrency(totalCosts, { code: 'BRL' }) }}</p>
                    </div>
                </div>
                <div class="mt-4">
                    <span class="text-sm text-red-600 flex items-center">
                        <i class="fas fa-arrow-up text-xs mr-1"></i>
                        +5.1% gastos com pessoal
                    </span>
                </div>
            </div>

            
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Lucro Total</p>
                        <p class="text-2xl font-bold" :class="totalProfit >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ formatCurrency(totalProfit, { code: 'BRL' }) }}
                        </p>
                    </div>

                </div>
                <div class="mt-4">
                    <span
class="text-sm flex items-center"
                        :class="totalProfit >= 0 ? 'text-green-600' : 'text-red-600'">
                        <i :class="totalProfit >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="text-xs mr-1"></i>
                        {{ overallProfitMargin.toFixed(1) }}% margem de lucro
                    </span>
                </div>
            </div>

            
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Margem de Lucro</p>
                        <p
class="text-2xl font-bold" :class="{
                            'text-green-600': overallProfitMargin >= 20,
                            'text-yellow-600': overallProfitMargin >= 10 && overallProfitMargin < 20,
                            'text-red-600': overallProfitMargin < 10
                        }">
                            {{ overallProfitMargin.toFixed(1) }}%
                        </p>
                    </div>

                </div>
                <div class="mt-4">
                    <span class="text-sm text-gray-500">Lucro / Receita</span>
                </div>
            </div>
        </div>

        
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Performance por Empresa</h3>
                        <p class="text-sm text-gray-600 mt-1">
                            Análise detalhada de receitas vs. custos
                            <span v-if="hasActiveFilters" class="text-blue-600 ml-2">
                                ({{ profitsByCompany.length }} empresas filtradas)
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="p-6">
                <div v-if="profitsByCompany.length === 0" class="text-center py-8">
                    <div class="text-gray-500">
                        <i class="fas fa-building text-3xl mb-4"></i>
                    </div>
                    <h3 class="text-sm font-medium text-gray-900 mb-2">Nenhuma empresa encontrada</h3>
                    <p class="text-sm text-gray-500">
                        Não há empresas que correspondam aos filtros selecionados.
                    </p>
                </div>

                <div v-else class="space-y-6">
                    
                    <div
v-for="company in profitsByCompany.slice(0, 5)" :key="company.company"
                        class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">

                        
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h4 class="text-lg font-semibold text-gray-900">{{ company.company }}</h4>
                                <p class="text-sm text-gray-500">
                                    {{filteredWorkers.filter(w => w.company === company.company).length}} funcionários
                                </p>
                            </div>
                            <div class="text-right">
                                <div
class="text-2xl font-bold"
                                    :class="company.profit >= 0 ? 'text-green-600' : 'text-red-600'">
                                    {{ formatCurrency(company.profit, { code: 'BRL' }) }}
                                </div>
                                <div class="text-sm text-gray-500">Lucro líquido</div>
                            </div>
                        </div>

                        
                        <div class="grid grid-cols-3 gap-4 mb-4">
                            <div class="text-center">
                                <div class="text-lg font-semibold text-green-600">
                                    {{ formatCurrency(company.revenue, { code: 'BRL' }) }}
                                </div>
                                <div class="text-xs text-gray-500">Receita</div>
                            </div>
                            <div class="text-center">
                                <div class="text-lg font-semibold text-red-600">
                                    {{ formatCurrency(company.costs, { code: 'BRL' }) }}
                                </div>
                                <div class="text-xs text-gray-500">Custos</div>
                            </div>
                            <div class="text-center">
                                <div
class="text-lg font-semibold" :class="{
                                    'text-green-600': company.profitMargin >= 20,
                                    'text-yellow-600': company.profitMargin >= 10 && company.profitMargin < 20,
                                    'text-red-600': company.profitMargin < 10
                                }">
                                    {{ company.profitMargin.toFixed(1) }}%
                                </div>
                                <div class="text-xs text-gray-500">Margem</div>
                            </div>
                        </div>

                        
                        <div class="space-y-3">
                            
                            <div class="flex items-center space-x-3">
                                <div class="w-16 text-xs text-gray-600">Receita</div>
                                <div class="flex-1 bg-gray-200 rounded-full h-4 relative">
                                    <div
class="bg-green-500 h-4 rounded-full transition-all duration-500"
                                        :style="{ width: `${Math.min((company.revenue / Math.max(...profitsByCompany.map(c => c.revenue))) * 100, 100)}%` }">
                                    </div>
                                    <span
                                        class="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                                        {{ formatCurrency(company.revenue, { code: 'BRL' }) }}
                                    </span>
                                </div>
                            </div>

                            
                            <div class="flex items-center space-x-3">
                                <div class="w-16 text-xs text-gray-600">Custos</div>
                                <div class="flex-1 bg-gray-200 rounded-full h-4 relative">
                                    <div
class="bg-red-500 h-4 rounded-full transition-all duration-500"
                                        :style="{ width: `${Math.min((company.costs / Math.max(...profitsByCompany.map(c => c.revenue))) * 100, 100)}%` }">
                                    </div>
                                    <span
                                        class="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                                        {{ formatCurrency(company.costs, { code: 'BRL' }) }}
                                    </span>
                                </div>
                            </div>

                            
                            <div class="flex items-center space-x-3">
                                <div class="w-16 text-xs text-gray-600">Lucro</div>
                                <div class="flex-1 bg-gray-200 rounded-full h-4 relative">
                                    <div
class="h-4 rounded-full transition-all duration-500"
                                        :class="company.profit >= 0 ? 'bg-green-600' : 'bg-red-600'"
                                        :style="{ width: `${Math.min(Math.abs(company.profit) / Math.max(...profitsByCompany.map(c => Math.abs(c.profit))) * 100, 100)}%` }">
                                    </div>
                                    <span
                                        class="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                                        {{ formatCurrency(company.profit, { code: 'BRL' }) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 flex justify-end">
                            <span
class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" :class="{
                                'bg-green-100 text-green-800': company.profitMargin >= 20,
                                'bg-yellow-100 text-yellow-800': company.profitMargin >= 10 && company.profitMargin < 20,
                                'bg-orange-100 text-orange-800': company.profitMargin >= 0 && company.profitMargin < 10,
                                'bg-red-100 text-red-800': company.profitMargin < 0
                            }">
                                {{ company.profitMargin >= 20 ? 'Excelente' :
                                    company.profitMargin >= 10 ? 'Bom' :
                                        company.profitMargin >= 0 ? 'Regular' : 'Prejuízo' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="profitsByCompany.length > 0" class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div class="flex items-center justify-between text-sm text-gray-600">
                    <span>
                        Calculado com base em {{ filteredPayments.length }} pagamentos e {{ filteredWorkers.length }}
                        profissionais
                    </span>
                    <div class="flex items-center space-x-4">
                        <span>Total: {{ formatCurrency(totalRevenue, { code: 'BRL' }) }}</span>
                        <span>Lucro: {{ formatCurrency(totalProfit, { code: 'BRL' }) }}</span>
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

interface Company {
    company: string
    revenue: number
    costs: number
    profit: number
    profitMargin: number
    currency: Currency
}

interface Payment {
    id: string
    company: string
}

interface Worker {
    id: string
    company: string
}

interface Props {
    totalRevenue: number
    totalCosts: number
    totalProfit: number
    overallProfitMargin: number
    profitsByCompany: Company[]
    filteredPayments: Payment[]
    filteredWorkers: Worker[]
    hasActiveFilters: boolean
    formatCurrency: (amount: number, currency: any) => string
}

defineProps<Props>()
defineEmits<{
    exportProfits: []
    exportWorkers: []
}>()
</script>