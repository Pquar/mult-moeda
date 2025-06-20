<script setup lang="ts">
import { currencies } from '@/lib/payments'
import FilterSection from '@/components/dashboard/FilterSection.vue'
import AnalyticsSection from '@/components/dashboard/AnalyticsSection.vue'
import AnalyticsCharts from '@/components/ui/AnalyticsCharts.vue'
import PaymentsTable from '@/components/dashboard/PaymentsTable.vue'
import ProfitsSection from '@/components/dashboard/ProfitsSection.vue'
import TeamSection from '@/components/dashboard/TeamSection.vue'
import SalaryTable from '@/components/dashboard/SalaryTable.vue'
import InvoicesSection from '@/components/dashboard/InvoicesSection.vue'

import {
  selectedCurrency,
  selectedCompany,
  selectedSubsidiaryCompany,
  baseCurrency,
  
  formatCurrency,
  convertToBRL,
  clearFilters,
  currencyRates,
  updateCurrencyRate,
  resetCurrencyRates,
  

  filteredPayments,
  filteredWorkers,
  filteredInvoices,
  totalInBRL,
  totalInBaseCurrency,
  allCompanies,
  allSubsidiaryCompanies,
  hasActiveFilters,
  
  statsByCurrency,
  uniqueCompanies,
  uniqueRoles,
  profitsByCompany,
  totalProfit,
  totalRevenue,
  totalCosts,
  overallProfitMargin,
  
  monthlySalariesByProject,
  totalMonthlyCosts,
  totalProjectRevenue,
  averageProjectCost,
  highestPaidWorker,
  

  exportPayments,
  exportWorkers,
  exportProfits,
  exportAnalytics,
  exportFullReport
} from '@/stores/businessLogic'
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto flex flex-col gap-4"> 
      <div id="dashboard" class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
        <p class="text-gray-600 mt-2">Sistema de gestão multi-moeda para pagamentos e análises</p>
      </div>
 
      <FilterSection
        v-model:selected-currency="selectedCurrency"
        v-model:selected-company="selectedCompany"
        v-model:selected-subsidiary-company="selectedSubsidiaryCompany"
        v-model:base-currency="baseCurrency"
        :currencies="currencies"
        :all-companies="allCompanies"
        :all-subsidiary-companies="allSubsidiaryCompanies"
        :has-active-filters="hasActiveFilters"
        :currency-rates="currencyRates"
        @update:currency-rate="updateCurrencyRate"
        @reset-currency-rates="resetCurrencyRates"
        @clear-filters="clearFilters"
      />
 
      <section id="analytics">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Análise de Faturamento</h2>
        </div>
        <AnalyticsSection
          :stats-by-currency="statsByCurrency"
          :total-in-b-r-l="totalInBRL"
          :total-in-base-currency="totalInBaseCurrency"
          :base-currency="baseCurrency"
          :format-currency="formatCurrency"
          :has-active-filters="hasActiveFilters"
          :filtered-payments="filteredPayments"
          :filtered-workers="filteredWorkers"
          :filtered-invoices="filteredInvoices"
          @export-payments="exportPayments"
        />
         
        <div class="mt-8">
          <AnalyticsCharts
            :total-revenue="totalRevenue"
            :total-costs="totalCosts"
            :total-profit="totalProfit"
            :overall-profit-margin="overallProfitMargin"
            :profits-by-company="profitsByCompany"
            :format-currency="formatCurrency"
          />
        </div>
      </section>
 
      <section id="payments">
        <PaymentsTable
          :filtered-payments="filteredPayments"
          :format-currency="formatCurrency"
          :convert-to-b-r-l="convertToBRL"
          @export-payments="exportPayments"
        />
      </section>
 
      <section id="profits">
        <ProfitsSection
          :profits-by-company="profitsByCompany"
          :total-profit="totalProfit"
          :total-revenue="totalRevenue"
          :total-costs="totalCosts"
          :overall-profit-margin="overallProfitMargin"
          :format-currency="formatCurrency"
          :filtered-payments="filteredPayments"
          :filtered-workers="filteredWorkers"
          :has-active-filters="hasActiveFilters"
          @export-profits="exportProfits"
        />
      </section>
 
      <section id="team">
        <TeamSection
          :filtered-workers="filteredWorkers"
          :filtered-invoices="filteredInvoices"
          :unique-companies="uniqueCompanies"
          :unique-roles="uniqueRoles"
          :format-currency="formatCurrency"
          @export-workers="exportWorkers"
        />
      </section>
 
      <InvoicesSection
        :selected-currency="selectedCurrency"
        :selected-company="selectedCompany"
        :format-currency="formatCurrency"
        :convert-to-b-r-l="convertToBRL"
      />
 
      <section id="salaries">
        <SalaryTable
          :monthly-salaries-by-project="monthlySalariesByProject"
          :total-project-revenue="totalProjectRevenue"
          :total-monthly-costs="totalMonthlyCosts"
          :average-project-cost="averageProjectCost"
          :highest-paid-worker="highestPaidWorker"
          :filtered-workers="filteredWorkers"
          :has-active-filters="hasActiveFilters"
          :format-currency="formatCurrency"
          @export-workers="exportWorkers"
        />
      </section>
 
      <section id="reports" class="mb-8">
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Relatórios Disponíveis</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              class="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="exportPayments"
            >
              <i class="fas fa-file-alt text-blue-600"></i>
              <span>Relatório de Pagamentos</span>
            </button>
            <button
              class="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="exportProfits"
            >
              <i class="fas fa-calculator text-green-600"></i>
              <span>Análise de Custos</span>
            </button>
            <button
              class="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="exportAnalytics"
            >
              <i class="fas fa-chart-pie text-purple-600"></i>
              <span>Analytics por Moeda</span>
            </button>
            <button
              class="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="exportFullReport"
            >
              <i class="fas fa-file-download text-orange-600"></i>
              <span>Relatório Completo</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
