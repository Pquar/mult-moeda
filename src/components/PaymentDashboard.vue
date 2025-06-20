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

// Importar todo o estado e lógica de negócio do store centralizado
import {
  // Estados dos filtros
  selectedCurrency,
  selectedCompany,
  selectedSubsidiaryCompany,
  
  // Funções utilitárias
  formatCurrency,
  convertToBRL,
  clearFilters,
  
  // Dados computados principais
  filteredPayments,
  filteredWorkers,
  filteredInvoices,
  totalInBRL,
  allCompanies,
  allSubsidiaryCompanies,
  hasActiveFilters,
  
  // Estatísticas e análises
  statsByCurrency,
  uniqueCompanies,
  uniqueRoles,
  profitsByCompany,
  totalProfit,
  totalRevenue,
  totalCosts,
  overallProfitMargin,
  
  // Dados de salários e projetos
  monthlySalariesByProject,
  totalMonthlyCosts,
  totalProjectRevenue,
  averageProjectCost,
  highestPaidWorker,
  
  // Funções de exportação
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
      <!-- Header -->
      <div id="dashboard" class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
        <p class="text-gray-600 mt-2">Sistema de gestão multi-moeda para pagamentos e análises</p>
      </div>

      <!-- Filtros -->
      <FilterSection
        v-model:selectedCurrency="selectedCurrency"
        v-model:selectedCompany="selectedCompany"
        v-model:selectedSubsidiaryCompany="selectedSubsidiaryCompany"
        :currencies="currencies"
        :allCompanies="allCompanies"
        :allSubsidiaryCompanies="allSubsidiaryCompanies"
        :hasActiveFilters="hasActiveFilters"
        @clearFilters="clearFilters"
      />

      <!-- Analytics Section -->
      <section id="analytics">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Análise de Faturamento</h2>
        </div>
        <AnalyticsSection
          :statsByCurrency="statsByCurrency"
          :totalInBRL="totalInBRL"
          :formatCurrency="formatCurrency"
          :hasActiveFilters="hasActiveFilters"
          :filteredPayments="filteredPayments"
          :filteredWorkers="filteredWorkers"
          :filteredInvoices="filteredInvoices"
          @exportPayments="exportPayments"
        />
        
        <!-- Gráficos de Analytics -->
        <div class="mt-8">
          <AnalyticsCharts
            :totalRevenue="totalRevenue"
            :totalCosts="totalCosts"
            :totalProfit="totalProfit"
            :overallProfitMargin="overallProfitMargin"
            :profitsByCompany="profitsByCompany"
            :formatCurrency="formatCurrency"
          />
        </div>
      </section>

      <!-- Tabela de Pagamentos -->
      <section id="payments">
        <PaymentsTable
          :filteredPayments="filteredPayments"
          :formatCurrency="formatCurrency"
          :convertToBRL="convertToBRL"
          @exportPayments="exportPayments"
        />
      </section>

      <!-- Seção de Lucros -->
      <section id="profits">
        <ProfitsSection
          :profitsByCompany="profitsByCompany"
          :totalProfit="totalProfit"
          :totalRevenue="totalRevenue"
          :totalCosts="totalCosts"
          :overallProfitMargin="overallProfitMargin"
          :formatCurrency="formatCurrency"
          :filteredPayments="filteredPayments"
          :filteredWorkers="filteredWorkers"
          :hasActiveFilters="hasActiveFilters"
          @exportProfits="exportProfits"
        />
      </section>

      <!-- Seção da Equipe -->
      <section id="team">
        <TeamSection
          :filteredWorkers="filteredWorkers"
          :filteredInvoices="filteredInvoices"
          :uniqueCompanies="uniqueCompanies"
          :uniqueRoles="uniqueRoles"
          :formatCurrency="formatCurrency"
          @exportWorkers="exportWorkers"
        />
      </section>

      <!-- Faturas -->
      <InvoicesSection
        :selectedCurrency="selectedCurrency"
        :selectedCompany="selectedCompany"
        :formatCurrency="formatCurrency"
        :convertToBRL="convertToBRL"
      />

      <!-- Tabela de Salários -->
      <section id="salaries">
        <SalaryTable
          :monthlySalariesByProject="monthlySalariesByProject"
          :totalProjectRevenue="totalProjectRevenue"
          :totalMonthlyCosts="totalMonthlyCosts"
          :averageProjectCost="averageProjectCost"
          :highestPaidWorker="highestPaidWorker"
          :filteredWorkers="filteredWorkers"
          :hasActiveFilters="hasActiveFilters"
          :formatCurrency="formatCurrency"
          @exportWorkers="exportWorkers"
        />
      </section>

      <!-- Relatórios -->
      <section id="reports" class="mb-8">
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Relatórios Disponíveis</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              @click="exportPayments"
              class="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i class="fas fa-file-alt text-blue-600"></i>
              <span>Relatório de Pagamentos</span>
            </button>
            <button
              @click="exportProfits"
              class="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i class="fas fa-calculator text-green-600"></i>
              <span>Análise de Custos</span>
            </button>
            <button
              @click="exportAnalytics"
              class="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i class="fas fa-chart-pie text-purple-600"></i>
              <span>Analytics por Moeda</span>
            </button>
            <button
              @click="exportFullReport"
              class="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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

<!-- PaymentDashboard uses only Tailwind CSS -->