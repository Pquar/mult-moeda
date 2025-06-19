<script setup lang="ts">
import { ref, computed } from 'vue'
import { payments, invoices, workers, currencies } from '@/lib/payments'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardFooter from '@/components/ui/CardFooter.vue'
import Table from '@/components/ui/Table.vue'
import TableHeader from '@/components/ui/TableHeader.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableRow from '@/components/ui/TableRow.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableCell from '@/components/ui/TableCell.vue'
import Chart from '@/components/ui/Chart.vue'

// Estado para filtros
const selectedCurrency = ref('all')
const selectedCompany = ref('all')

// Função para formatar valores monetários
const formatCurrency = (amount: number, currency: any) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2
  }).format(amount)
}

// Função para converter valores para BRL (moeda base)
const convertToBRL = (amount: number, currency: any) => {
  if (currency.code === 'BRL') {
    return amount
  }
  // Para converter de outras moedas para BRL, dividimos pelo valor da taxa
  return amount / currency.value
}

// Pagamentos filtrados
const filteredPayments = computed(() => {
  return payments.filter(payment => {
    const currencyMatch = selectedCurrency.value === 'all' || payment.currency.code === selectedCurrency.value
    const companyMatch = selectedCompany.value === 'all' || payment.company === selectedCompany.value
    return currencyMatch && companyMatch
  })
})

// Faturas filtradas
const filteredInvoices = computed(() => {
  return invoices.filter(invoice => {
    const currencyMatch = selectedCurrency.value === 'all' || invoice.currency.code === selectedCurrency.value
    const companyMatch = selectedCompany.value === 'all' || invoice.company === selectedCompany.value
    return currencyMatch && companyMatch
  })
})

// Empregados filtrados
const filteredWorkers = computed(() => {
  return workers.filter(worker => {
    const currencyMatch = selectedCurrency.value === 'all' || worker.currency.code === selectedCurrency.value
    const companyMatch = selectedCompany.value === 'all' || worker.company === selectedCompany.value
    return currencyMatch && companyMatch
  })
})

// Total geral em BRL (baseado nos pagamentos filtrados)
const totalInBRL = computed(() => {
  return filteredPayments.value.reduce((total, payment) => {
    return total + convertToBRL(payment.amount, payment.currency)
  }, 0)
})

// Empresas únicas (baseado nos dados filtrados)
const uniqueCompanies = computed(() => {
  const companies = [...new Set(filteredPayments.value.map(p => p.company))]
  return companies.sort()
})

// Cargos únicos (baseado nos empregados filtrados)
const uniqueRoles = computed(() => {
  const roles = [...new Set(filteredWorkers.value.map(w => w.role))]
  return roles.sort()
})

// Empresas para o filtro (todas as empresas disponíveis)
const allCompanies = computed(() => {
  const companies = [...new Set(payments.map(p => p.company))]
  return companies.sort()
})

// Verificar se há filtros ativos
const hasActiveFilters = computed(() => {
  return selectedCurrency.value !== 'all' || selectedCompany.value !== 'all'
})

// Função para limpar filtros
const clearFilters = () => {
  selectedCurrency.value = 'all'
  selectedCompany.value = 'all'
}

// Cálculo de lucros por empresa
const profitsByCompany = computed(() => {
  const companies = [...new Set(filteredPayments.value.map(p => p.company))]
  
  return companies.map(company => {
    // Pagamentos da empresa
    const companyPayments = filteredPayments.value.filter(p => p.company === company)
    const totalRevenue = companyPayments.reduce((sum, payment) => {
      return sum + convertToBRL(payment.amount, payment.currency)
    }, 0)

    // Gastos com empregados da empresa
    const companyWorkers = filteredWorkers.value.filter(w => w.company === company)
    const totalCosts = companyWorkers.reduce((sum, worker) => {
      const workerCost = worker.hoursWorked * worker.hourlyRate
      return sum + convertToBRL(workerCost, worker.currency)
    }, 0)

    // Lucro
    const profit = totalRevenue - totalCosts
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0

    return {
      company,
      revenue: totalRevenue,
      costs: totalCosts,
      profit,
      profitMargin,
      currency: { code: 'BRL' } // Sempre em BRL para consistência
    }
  }).sort((a, b) => b.profit - a.profit) // Ordenar por lucro decrescente
})

// Totais gerais de lucro
const totalProfit = computed(() => {
  return profitsByCompany.value.reduce((sum, company) => sum + company.profit, 0)
})

const totalRevenue = computed(() => {
  return profitsByCompany.value.reduce((sum, company) => sum + company.revenue, 0)
})

const totalCosts = computed(() => {
  return profitsByCompany.value.reduce((sum, company) => sum + company.costs, 0)
})

const overallProfitMargin = computed(() => {
  return totalRevenue.value > 0 ? (totalProfit.value / totalRevenue.value) * 100 : 0
})

// Cálculo de salários mensais dos profissionais
const monthlySalariesByProject = computed(() => {
  const projects = [...new Set(filteredWorkers.value.map(w => w.company))]
  
  return projects.map(project => {
    const projectWorkers = filteredWorkers.value.filter(w => w.company === project)
    
    const workersWithSalary = projectWorkers.map(worker => {
      // Assumindo que hoursWorked é mensal, calculamos o salário mensal
      const monthlySalary = worker.hoursWorked * worker.hourlyRate
      const monthlySalaryBRL = convertToBRL(monthlySalary, worker.currency)
      
      return {
        ...worker,
        monthlySalary: monthlySalary,
        monthlySalaryBRL: monthlySalaryBRL
      }
    })
    
    // Calcular receita real do projeto vinda dos pagamentos
    const projectPayments = filteredPayments.value.filter(p => p.company === project)
    const projectRevenue = projectPayments.reduce((sum, payment) => {
      return sum + convertToBRL(payment.amount, payment.currency)
    }, 0)
    
    const totalMonthlyCost = workersWithSalary.reduce((sum, worker) => sum + worker.monthlySalaryBRL, 0)
    const averageSalary = workersWithSalary.length > 0 ? totalMonthlyCost / workersWithSalary.length : 0
    const projectProfit = projectRevenue - totalMonthlyCost
    
    return {
      project,
      workers: workersWithSalary.sort((a, b) => b.monthlySalaryBRL - a.monthlySalaryBRL),
      totalMonthlyCost,
      projectRevenue,
      projectProfit,
      averageSalary,
      workerCount: workersWithSalary.length,
      paymentsCount: projectPayments.length
    }
  }).sort((a, b) => b.projectRevenue - a.projectRevenue) // Ordenar por receita decrescente
})

// Totais gerais de salários mensais
const totalMonthlyCosts = computed(() => {
  return monthlySalariesByProject.value.reduce((sum, project) => sum + project.totalMonthlyCost, 0)
})

const averageProjectCost = computed(() => {
  return monthlySalariesByProject.value.length > 0 ? 
    totalMonthlyCosts.value / monthlySalariesByProject.value.length : 0
})

const highestPaidWorker = computed(() => {
  const allWorkers = monthlySalariesByProject.value.flatMap(p => p.workers)
  return allWorkers.length > 0 ? 
    allWorkers.reduce((highest, current) => 
      current.monthlySalaryBRL > highest.monthlySalaryBRL ? current : highest
    ) : null
})

// Estatísticas por moeda (baseado nos pagamentos filtrados)
const statsByCurrency = computed(() => {
  const stats = currencies.map(currency => {
    const paymentsInCurrency = filteredPayments.value.filter(p => p.currency.code === currency.code)
    const total = paymentsInCurrency.reduce((sum, p) => sum + p.amount, 0)
    return {
      currency,
      count: paymentsInCurrency.length,
      total,
      totalBRL: convertToBRL(total, currency)
    }
  })
  return stats
})

// Dados para o gráfico de distribuição de custos por empresa
const costDistributionData = computed(() => {
  const dataByCompany = monthlySalariesByProject.value.map(project => ({
    company: project.project,
    cost: project.totalMonthlyCost,
    revenue: project.projectRevenue,
    profit: project.projectProfit,
    workerCount: project.workerCount,
    paymentsCount: project.paymentsCount
  }))

  const totalRevenue = dataByCompany.reduce((sum, item) => sum + item.revenue, 0)
  
  // Cores predefinidas para as empresas
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
  ]

  let cumulativePercentage = 0

  return dataByCompany
    .sort((a, b) => b.revenue - a.revenue) // Ordenar por receita decrescente
    .map((item, index) => {
      const percentage = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0
      const result = {
        company: item.company,
        cost: item.cost,
        revenue: item.revenue,
        profit: item.profit,
        workerCount: item.workerCount,
        paymentsCount: item.paymentsCount,
        percentage,
        cumulativePercentage,
        color: colors[index % colors.length]
      }
      cumulativePercentage += percentage
      return result
    })
})

// Totais gerais de receita
const totalProjectRevenue = computed(() => {
  return monthlySalariesByProject.value.reduce((sum, project) => sum + project.projectRevenue, 0)
})

// Função para converter dados para CSV
const convertToCSV = (data: any[], headers: string[]) => {
  const csvHeaders = headers.join(',')
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] || ''
      // Escapar aspas e envolver em aspas se contém vírgula
      const stringValue = String(value).replace(/"/g, '""')
      return stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"') 
        ? `"${stringValue}"` 
        : stringValue
    }).join(',')
  )
  return [csvHeaders, ...csvRows].join('\n')
}

// Função para fazer download do CSV
const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Função para exportar pagamentos
const exportPaymentsCSV = () => {
  const data = filteredPayments.value.map(payment => ({
    'ID': payment.id,
    'Empresa': payment.company,
    'Descrição': payment.description,
    'Valor Original': payment.amount,
    'Moeda': payment.currency.code,
    'Valor em BRL': convertToBRL(payment.amount, payment.currency).toFixed(2),
    'Data': payment.date,
    'Status': payment.status,
    'Categoria': payment.category
  }))
  
  const headers = ['ID', 'Empresa', 'Descrição', 'Valor Original', 'Moeda', 'Valor em BRL', 'Data', 'Status', 'Categoria']
  const csvContent = convertToCSV(data, headers)
  downloadCSV(csvContent, `pagamentos_${new Date().toISOString().split('T')[0]}.csv`)
}

// Função para exportar profissionais por projeto
const exportWorkersCSV = () => {
  const data = monthlySalariesByProject.value.flatMap(project => 
    project.workers.map(worker => ({
      'Projeto': project.project,
      'Nome': worker.name,
      'Email': worker.email,
      'Cargo': worker.role,
      'Taxa por Hora (Original)': worker.hourlyRate,
      'Moeda': worker.currency.code,
      'Horas Trabalhadas': worker.hoursWorked,
      'Salário Mensal (Original)': worker.monthlySalary.toFixed(2),
      'Salário Mensal (BRL)': worker.monthlySalaryBRL.toFixed(2),
      'Empresa': worker.company
    }))
  )
  
  const headers = ['Projeto', 'Nome', 'Email', 'Cargo', 'Taxa por Hora (Original)', 'Moeda', 'Horas Trabalhadas', 'Salário Mensal (Original)', 'Salário Mensal (BRL)', 'Empresa']
  const csvContent = convertToCSV(data, headers)
  downloadCSV(csvContent, `profissionais_${new Date().toISOString().split('T')[0]}.csv`)
}

// Função para exportar análise de lucros
const exportProfitsCSV = () => {
  const data = profitsByCompany.value.map(company => ({
    'Empresa': company.company,
    'Receita Total (BRL)': company.revenue.toFixed(2),
    'Custos Totais (BRL)': company.costs.toFixed(2),
    'Lucro (BRL)': company.profit.toFixed(2),
    'Margem de Lucro (%)': company.profitMargin.toFixed(2)
  }))
  
  const headers = ['Empresa', 'Receita Total (BRL)', 'Custos Totais (BRL)', 'Lucro (BRL)', 'Margem de Lucro (%)']
  const csvContent = convertToCSV(data, headers)
  downloadCSV(csvContent, `analise_lucros_${new Date().toISOString().split('T')[0]}.csv`)
}

// Função para exportar faturas
const exportInvoicesCSV = () => {
  const data = filteredInvoices.value.map(invoice => ({
    'ID': invoice.id,
    'Empresa': invoice.company,
    'Cliente': invoice.client,
    'Valor Original': invoice.amount,
    'Moeda': invoice.currency.code,
    'Valor em BRL': convertToBRL(invoice.amount, invoice.currency).toFixed(2),
    'Data de Vencimento': invoice.dueDate,
    'Status': invoice.status,
    'Descrição': invoice.description
  }))
  
  const headers = ['ID', 'Empresa', 'Cliente', 'Valor Original', 'Moeda', 'Valor em BRL', 'Data de Vencimento', 'Status', 'Descrição']
  const csvContent = convertToCSV(data, headers)
  downloadCSV(csvContent, `faturas_${new Date().toISOString().split('T')[0]}.csv`)
}

// Função para exportar relatório completo (todos os dados)
const exportCompleteReportCSV = () => {
  // Criar um relatório resumido com informações principais
  const summaryData = [{
    'Total de Pagamentos': filteredPayments.value.length,
    'Total em BRL': totalInBRL.value.toFixed(2),
    'Total de Profissionais': filteredWorkers.value.length,
    'Custo Mensal Total': totalMonthlyCosts.value.toFixed(2),
    'Receita Total': totalProjectRevenue.value.toFixed(2),
    'Lucro Total': totalProfit.value.toFixed(2),
    'Margem de Lucro Geral (%)': overallProfitMargin.value.toFixed(2),
    'Data do Relatório': new Date().toLocaleString('pt-BR'),
    'Filtros Aplicados': hasActiveFilters.value ? `Moeda: ${selectedCurrency.value}, Empresa: ${selectedCompany.value}` : 'Nenhum filtro aplicado'
  }]
  
  const headers = ['Total de Pagamentos', 'Total em BRL', 'Total de Profissionais', 'Custo Mensal Total', 'Receita Total', 'Lucro Total', 'Margem de Lucro Geral (%)', 'Data do Relatório', 'Filtros Aplicados']
  const csvContent = convertToCSV(summaryData, headers)
  downloadCSV(csvContent, `relatorio_completo_${new Date().toISOString().split('T')[0]}.csv`)
}

// ...existing code...
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Sistema Multi-Moeda</h1>
        <p class="text-muted-foreground">Dashboard de Pagamentos Globais (Base: Real Brasileiro)</p>
      </div>
      <div class="flex space-x-2">
        <Button variant="outline" @click="exportCompleteReportCSV">
          Exportar Relatório Completo
        </Button>
        <Button variant="outline" @click="exportPaymentsCSV">
          Exportar Pagamentos
        </Button>
      </div>
    </div>
    
    <!-- Filtros em Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          <span>Filtros</span>
          <div class="flex items-center space-x-2">
            <span v-if="hasActiveFilters" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Filtros Ativos
            </span>
            <Button v-if="hasActiveFilters" variant="outline" size="sm" @click="clearFilters">
              Limpar Filtros
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Filtre os dados por moeda e empresa
          <span v-if="hasActiveFilters" class="block mt-1 text-blue-600">
            Mostrando {{ filteredPayments.length }} de {{ payments.length }} pagamentos
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Moeda:</label>
            <select v-model="selectedCurrency" class="w-full p-2 border border-gray-300 rounded-md">
              <option value="all">Todas as Moedas</option>
              <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                {{ currency.code }} - {{ currency.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Empresa:</label>
            <select v-model="selectedCompany" class="w-full p-2 border border-gray-300 rounded-md">
              <option value="all">Todas as Empresas</option>
              <option v-for="company in allCompanies" :key="company" :value="company">
                {{ company }}
              </option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Estatísticas em Charts -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Total Geral -->
      <Chart 
        title="Total Geral (BRL)" 
        :value="formatCurrency(totalInBRL, { code: 'BRL' })"
        :description="`${filteredPayments.length} pagamentos filtrados`"
        color="green"
        trend="up"
        trend-value="+12.5%"
      />
      
      <!-- Estatísticas por Moeda -->
      <Chart 
        v-for="stat in statsByCurrency" 
        :key="stat.currency.code"
        :title="`Total ${stat.currency.code}`"
        :value="formatCurrency(stat.total, stat.currency)"
        :description="`${stat.count} pagamentos`"
        :color="stat.currency.code === 'BRL' ? 'green' : stat.currency.code === 'EUR' ? 'blue' : 'yellow'"
        trend="neutral"
        :trend-value="`≈ ${formatCurrency(stat.totalBRL, { code: 'BRL' })}`"
      />
    </div>

    <!-- Tabela de Pagamentos usando componentes Table -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Pagamentos ({{ filteredPayments.length }})</CardTitle>
            <CardDescription>Lista completa de todos os pagamentos registrados</CardDescription>
          </div>
          <Button variant="outline" size="sm" @click="exportPaymentsCSV">
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Moeda</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Subsidiária</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="payment in filteredPayments" :key="payment.id">
              <TableCell>
                <div>
                  <div class="font-medium">{{ payment.company }}</div>
                  <div class="text-sm text-muted-foreground">{{ payment.email }}</div>
                </div>
              </TableCell>
              <TableCell>
                <div class="font-medium">{{ formatCurrency(payment.amount, payment.currency) }}</div>
                <div class="text-sm text-muted-foreground">
                  ≈ {{ formatCurrency(convertToBRL(payment.amount, payment.currency), { code: 'BRL' }) }}
                </div>
              </TableCell>
              <TableCell>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-800': payment.currency.code === 'USD',
                        'bg-blue-100 text-blue-800': payment.currency.code === 'EUR',
                        'bg-yellow-100 text-yellow-800': payment.currency.code === 'BRL'
                      }">
                  {{ payment.currency.code }}
                </span>
              </TableCell>
              <TableCell>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-800': payment.status === 'success',
                        'bg-yellow-100 text-yellow-800': payment.status === 'pending',
                        'bg-blue-100 text-blue-800': payment.status === 'processing',
                        'bg-red-100 text-red-800': payment.status === 'failed'
                      }">
                  {{ payment.status }}
                </span>
              </TableCell>
              <TableCell>{{ new Date(payment.date).toLocaleDateString('pt-BR') }}</TableCell>
              <TableCell>{{ payment.subsidiaryCompany }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Grid de Cards para diferentes seções -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Card de Invoices -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Faturas Recentes</CardTitle>
              <CardDescription>{{ filteredInvoices.length }} faturas filtradas</CardDescription>
            </div>
            <Button variant="outline" size="sm" @click="exportInvoicesCSV">
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-if="filteredInvoices.length === 0" class="text-center py-4 text-muted-foreground">
              Nenhuma fatura encontrada com os filtros selecionados
            </div>
            <div v-for="invoice in filteredInvoices.slice(0, 5)" :key="invoice.id" 
                 class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p class="font-medium">{{ invoice.company }}</p>
                <p class="text-sm text-muted-foreground">{{ invoice.invoiceNumber }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium">{{ formatCurrency(invoice.amount, invoice.currency) }}</p>
                <span class="text-xs px-2 py-1 rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': invoice.status === 'success',
                        'bg-yellow-100 text-yellow-800': invoice.status === 'pending',
                        'bg-blue-100 text-blue-800': invoice.status === 'processing',
                        'bg-red-100 text-red-800': invoice.status === 'failed'
                      }">
                  {{ invoice.status }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full">
            Ver Todas as Faturas ({{ filteredInvoices.length }})
          </Button>
        </CardFooter>
      </Card>

      <!-- Card de Empregados por Empresa -->
      <Card>
        <CardHeader>
          <CardTitle>Equipe por Empresa</CardTitle>
          <CardDescription>{{ filteredWorkers.length }} empregados filtrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-if="uniqueCompanies.length === 0" class="text-center py-4 text-muted-foreground">
              Nenhuma empresa encontrada com os filtros selecionados
            </div>
            <div v-for="company in uniqueCompanies.slice(0, 6)" :key="company" 
                 class="flex items-center justify-between">
              <span class="font-medium">{{ company }}</span>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-muted-foreground">
                  {{ filteredWorkers.filter(w => w.company === company).length }} funcionários
                </span>
                <div class="flex -space-x-1">
                  <div v-for="worker in filteredWorkers.filter(w => w.company === company).slice(0, 3)" 
                       :key="worker.id"
                       class="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium">
                    {{ worker.name.charAt(0) }}
                  </div>
                  <div v-if="filteredWorkers.filter(w => w.company === company).length > 3"
                       class="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                    +{{ filteredWorkers.filter(w => w.company === company).length - 3 }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full">
            Gerenciar Equipes ({{ uniqueCompanies.length }} empresas)
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Cards de Análise por Cargo -->
    <Card>
      <CardHeader>
        <CardTitle>Análise por Cargo</CardTitle>
        <CardDescription>Distribuição de empregados filtrados por função</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="uniqueRoles.length === 0" class="text-center py-8 text-muted-foreground">
          Nenhum cargo encontrado com os filtros selecionados
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div v-for="role in uniqueRoles" :key="role" 
               class="text-center p-4 border rounded-lg">
            <div class="text-2xl font-bold text-blue-600">
              {{ filteredWorkers.filter(w => w.role === role).length }}
            </div>
            <div class="text-sm text-muted-foreground mt-1">{{ role }}</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Análise de Lucros -->
    <div class="space-y-6">
      <!-- Cards de Resumo Financeiro -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Chart 
          title="Receita Total" 
          :value="formatCurrency(totalRevenue, { code: 'BRL' })"
          description="Soma de todos os pagamentos"
          color="green"
          trend="up"
          trend-value="+8.2%"
        />
        
        <Chart 
          title="Custos Totais" 
          :value="formatCurrency(totalCosts, { code: 'BRL' })"
          description="Gastos com profissionais"
          color="red"
          trend="up"
          trend-value="+5.1%"
        />
        
        <Chart 
          title="Lucro Total" 
          :value="formatCurrency(totalProfit, { code: 'BRL' })"
          :description="totalProfit >= 0 ? 'Lucro positivo' : 'Prejuízo'"
          :color="totalProfit >= 0 ? 'green' : 'red'"
          :trend="totalProfit >= 0 ? 'up' : 'down'"
          :trend-value="`${overallProfitMargin.toFixed(1)}% margem`"
        />
        
        <Chart 
          title="Margem de Lucro" 
          :value="`${overallProfitMargin.toFixed(1)}%`"
          description="Lucro / Receita"
          :color="overallProfitMargin >= 20 ? 'green' : overallProfitMargin >= 10 ? 'yellow' : 'red'"
          :trend="overallProfitMargin >= 15 ? 'up' : overallProfitMargin >= 5 ? 'neutral' : 'down'"
        />
      </div>

      <!-- Tabela de Lucros por Empresa -->
      <Card>
        <CardHeader>
          <CardTitle>Análise de Lucros por Empresa</CardTitle>
          <CardDescription>
            Receitas vs. Custos - Baseado em pagamentos e gastos com profissionais
            <span v-if="hasActiveFilters" class="block mt-1 text-blue-600">
              Dados filtrados: {{ profitsByCompany.length }} empresas
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="profitsByCompany.length === 0" class="text-center py-8 text-muted-foreground">
            Nenhuma empresa encontrada com os filtros selecionados
          </div>
          <Table v-else>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead class="text-right">Receita (BRL)</TableHead>
                <TableHead class="text-right">Custos (BRL)</TableHead>
                <TableHead class="text-right">Lucro (BRL)</TableHead>
                <TableHead class="text-right">Margem (%)</TableHead>
                <TableHead class="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="company in profitsByCompany" :key="company.company">
                <TableCell>
                  <div class="font-medium">{{ company.company }}</div>
                  <div class="text-sm text-muted-foreground">
                    {{ filteredWorkers.filter(w => w.company === company.company).length }} funcionários
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <div class="font-medium text-green-600">
                    {{ formatCurrency(company.revenue, { code: 'BRL' }) }}
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <div class="font-medium text-red-600">
                    {{ formatCurrency(company.costs, { code: 'BRL' }) }}
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <div class="font-bold" :class="{
                    'text-green-600': company.profit >= 0,
                    'text-red-600': company.profit < 0
                  }">
                    {{ formatCurrency(company.profit, { code: 'BRL' }) }}
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <span class="font-medium" :class="{
                    'text-green-600': company.profitMargin >= 20,
                    'text-yellow-600': company.profitMargin >= 10 && company.profitMargin < 20,
                    'text-red-600': company.profitMargin < 10
                  }">
                    {{ company.profitMargin.toFixed(1) }}%
                  </span>
                </TableCell>
                <TableCell class="text-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
                    'bg-green-100 text-green-800': company.profitMargin >= 20,
                    'bg-yellow-100 text-yellow-800': company.profitMargin >= 10 && company.profitMargin < 20,
                    'bg-orange-100 text-orange-800': company.profitMargin >= 0 && company.profitMargin < 10,
                    'bg-red-100 text-red-800': company.profitMargin < 0
                  }">
                    {{ company.profitMargin >= 20 ? 'Excelente' : 
                       company.profitMargin >= 10 ? 'Bom' : 
                       company.profitMargin >= 0 ? 'Regular' : 'Prejuízo' }}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div class="flex items-center justify-between w-full">
            <div class="text-sm text-muted-foreground">
              Calculado com base em {{ filteredPayments.length }} pagamentos e {{ filteredWorkers.length }} profissionais
            </div>
            <Button variant="outline" @click="exportProfitsCSV">
              Exportar Análise Financeira
            </Button>
          </div>
        </CardFooter>
      </Card>

      <!-- Gráfico Visual de Barras Simples -->
      <Card>
        <CardHeader>
          <CardTitle>Comparativo Visual - Top 5 Empresas</CardTitle>
          <CardDescription>Receita vs. Custos vs. Lucro das empresas mais lucrativas</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-6">
            <div v-for="company in profitsByCompany.slice(0, 5)" :key="company.company" 
                 class="space-y-2">
              
              <!-- Nome da empresa e valores -->
              <div class="flex items-center justify-between">
                <h4 class="font-medium">{{ company.company }}</h4>
                <div class="text-sm text-muted-foreground">
                  Lucro: {{ formatCurrency(company.profit, { code: 'BRL' }) }}
                </div>
              </div>
              
              <!-- Barras visuais -->
              <div class="space-y-1">
                <!-- Receita -->
                <div class="flex items-center space-x-2">
                  <div class="w-16 text-xs text-muted-foreground">Receita</div>
                  <div class="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div class="bg-green-500 h-4 rounded-full transition-all duration-500"
                         :style="{ width: `${Math.min((company.revenue / Math.max(...profitsByCompany.map(c => c.revenue))) * 100, 100)}%` }">
                    </div>
                    <span class="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {{ formatCurrency(company.revenue, { code: 'BRL' }) }}
                    </span>
                  </div>
                </div>
                
                <!-- Custos -->
                <div class="flex items-center space-x-2">
                  <div class="w-16 text-xs text-muted-foreground">Custos</div>
                  <div class="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div class="bg-red-500 h-4 rounded-full transition-all duration-500"
                         :style="{ width: `${Math.min((company.costs / Math.max(...profitsByCompany.map(c => c.revenue))) * 100, 100)}%` }">
                    </div>
                    <span class="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {{ formatCurrency(company.costs, { code: 'BRL' }) }}
                    </span>
                  </div>
                </div>
                
                <!-- Lucro -->
                <div class="flex items-center space-x-2">
                  <div class="w-16 text-xs text-muted-foreground">Lucro</div>
                  <div class="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div class="h-4 rounded-full transition-all duration-500"
                         :class="company.profit >= 0 ? 'bg-green-600' : 'bg-red-600'"
                         :style="{ width: `${Math.min(Math.abs(company.profit) / Math.max(...profitsByCompany.map(c => Math.abs(c.profit))) * 100, 100)}%` }">
                    </div>
                    <span class="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {{ formatCurrency(company.profit, { code: 'BRL' }) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Análise de Salários Mensais -->
    <div class="space-y-6">
      <!-- Cards de Resumo Salarial -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Chart 
          title="Custo Mensal Total" 
          :value="formatCurrency(totalMonthlyCosts, { code: 'BRL' })"
          description="Soma de todos os salários"
          color="blue"
          trend="up"
          trend-value="+6.8%"
        />
        
        <Chart 
          title="Custo Médio por Projeto" 
          :value="formatCurrency(averageProjectCost, { code: 'BRL' })"
          description="Média de custos por empresa"
          color="yellow"
          trend="neutral"
        />
        
        <Chart 
          title="Maior Salário" 
          :value="highestPaidWorker ? formatCurrency(highestPaidWorker.monthlySalaryBRL, { code: 'BRL' }) : 'N/A'"
          :description="highestPaidWorker ? highestPaidWorker.name : 'Nenhum profissional'"
          color="green"
          trend="up"
        />
        
        <Chart 
          title="Total de Profissionais" 
          :value="filteredWorkers.length.toString()"
          description="Distribuídos nos projetos"
          color="purple"
          trend="neutral"
        />
      </div>

      <!-- Tabela de Salários por Projeto -->
      <Card>
        <CardHeader>
          <CardTitle>Salários Mensais por Projeto</CardTitle>
          <CardDescription>
            Detalhamento dos custos mensais com profissionais por empresa
            <span v-if="hasActiveFilters" class="block mt-1 text-blue-600">
              Dados filtrados: {{ monthlySalariesByProject.length }} projetos
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="monthlySalariesByProject.length === 0" class="text-center py-8 text-muted-foreground">
            Nenhum projeto encontrado com os filtros selecionados
          </div>
          <div v-else class="space-y-8">
            <div v-for="project in monthlySalariesByProject" :key="project.project" 
                 class="border rounded-lg p-6">
              
              <!-- Header do Projeto -->
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="text-lg font-semibold">{{ project.project }}</h3>
                  <p class="text-sm text-muted-foreground">
                    {{ project.workerCount }} profissionais • {{ project.paymentsCount }} pagamentos •
                    Custo mensal: {{ formatCurrency(project.totalMonthlyCost, { code: 'BRL' }) }}
                  </p>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-green-600">
                    {{ formatCurrency(project.projectRevenue, { code: 'BRL' }) }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Receita do projeto
                  </div>
                  <div class="text-sm mt-1" :class="project.projectProfit >= 0 ? 'text-green-600' : 'text-red-600'">
                    Lucro: {{ formatCurrency(project.projectProfit, { code: 'BRL' }) }}
                  </div>
                </div>
              </div>

              <!-- Lista de Profissionais -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="worker in project.workers" :key="worker.id" 
                     class="border rounded-lg p-4 bg-gray-50">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="font-medium">{{ worker.name }}</h4>
                      <p class="text-sm text-muted-foreground">{{ worker.role }}</p>
                      <p class="text-xs text-muted-foreground mt-1">{{ worker.email }}</p>
                    </div>
                    <div class="ml-4 text-right">
                      <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
                        {{ worker.name.charAt(0) }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4 space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-muted-foreground">Taxa/hora:</span>
                      <span class="font-medium">{{ formatCurrency(worker.hourlyRate, worker.currency) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-muted-foreground">Horas/mês:</span>
                      <span class="font-medium">{{ worker.hoursWorked }}h</span>
                    </div>
                    <div class="flex justify-between text-sm border-t pt-2">
                      <span class="text-muted-foreground">Salário original:</span>
                      <span class="font-medium">{{ formatCurrency(worker.monthlySalary, worker.currency) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-muted-foreground font-semibold">Salário (BRL):</span>
                      <span class="font-bold text-blue-600">{{ formatCurrency(worker.monthlySalaryBRL, { code: 'BRL' }) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Barra Visual da Receita do Projeto -->
              <div class="mt-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium">Participação na receita total</span>
                  <span class="text-sm text-muted-foreground">
                    {{ totalProjectRevenue > 0 ? ((project.projectRevenue / totalProjectRevenue) * 100).toFixed(1) : '0.0' }}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-green-600 h-3 rounded-full transition-all duration-500"
                       :style="{ width: `${totalProjectRevenue > 0 ? (project.projectRevenue / totalProjectRevenue) * 100 : 0}%` }">
                  </div>
                </div>
                
                <!-- Barra adicional para lucro/prejuízo -->
                <div class="mt-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium">Status financeiro</span>
                    <span class="text-sm" :class="project.projectProfit >= 0 ? 'text-green-600' : 'text-red-600'">
                      {{ project.projectProfit >= 0 ? 'Lucro' : 'Prejuízo' }}: {{ formatCurrency(Math.abs(project.projectProfit), { code: 'BRL' }) }}
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="h-2 rounded-full transition-all duration-500"
                         :class="project.projectProfit >= 0 ? 'bg-green-500' : 'bg-red-500'"
                         :style="{ width: `${project.projectRevenue > 0 ? Math.min((Math.abs(project.projectProfit) / project.projectRevenue) * 100, 100) : 0}%` }">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div class="flex items-center justify-between w-full">
            <div class="text-sm text-muted-foreground">
              Receita total: {{ formatCurrency(totalProjectRevenue, { code: 'BRL' }) }} • 
              Custo mensal: {{ formatCurrency(totalMonthlyCosts, { code: 'BRL' }) }} • 
              {{ filteredWorkers.length }} profissionais em {{ monthlySalariesByProject.length }} projetos
            </div>
            <Button variant="outline" @click="exportWorkersCSV">
              Exportar Profissionais
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>

    <!-- Gráfico de Distribuição de Receitas por Empresa -->
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Receitas por Empresa</CardTitle>
        <CardDescription>Participação percentual de cada empresa nas receitas totais</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <!-- Gráfico Donut Manual -->
          <div class="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <!-- Gráfico Visual -->
            <div class="relative w-64 h-64 mx-auto">
              <!-- Círculo base -->
              <svg class="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                <!-- Círculo de fundo -->
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                
                <!-- Segmentos do gráfico -->
                <circle v-for="(segment) in costDistributionData" 
                        :key="segment.company"
                        cx="50" cy="50" r="40" 
                        fill="none" 
                        :stroke="segment.color"
                        stroke-width="8"
                        :stroke-dasharray="`${segment.percentage * 2.51327} 251.327`"
                        :stroke-dashoffset="`${251.327 - (segment.cumulativePercentage * 2.51327)}`"
                        class="transition-all duration-500 opacity-80 hover:opacity-100"
                />
              </svg>
              
              <!-- Centro do gráfico -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="text-2xl font-bold">{{ costDistributionData.length }}</div>
                <div class="text-sm text-muted-foreground">Empresas</div>
              </div>
            </div>

            <!-- Legenda -->
            <div class="flex-1 space-y-3">
              <div v-for="segment in costDistributionData" 
                   :key="segment.company"
                   class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                
                <div class="flex items-center space-x-3">
                  <!-- Indicador de cor -->
                  <div class="w-4 h-4 rounded-full" 
                       :style="{ backgroundColor: segment.color }">
                  </div>
                  
                  <!-- Info da empresa -->
                  <div>
                    <h4 class="font-medium">{{ segment.company }}</h4>
                    <p class="text-sm text-muted-foreground">
                      {{ segment.workerCount }} profissionais • {{ segment.paymentsCount }} pagamentos
                    </p>
                  </div>
                </div>
                
                <!-- Valores -->
                <div class="text-right">
                  <div class="font-bold text-green-600">{{ segment.percentage.toFixed(1) }}%</div>
                  <div class="text-sm font-medium text-green-700">
                    {{ formatCurrency(segment.revenue, { code: 'BRL' }) }}
                  </div>
                  <div class="text-xs text-muted-foreground">
                    Custo: {{ formatCurrency(segment.cost, { code: 'BRL' }) }}
                  </div>
                  <div class="text-xs" :class="segment.profit >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ segment.profit >= 0 ? 'Lucro' : 'Prejuízo' }}: {{ formatCurrency(Math.abs(segment.profit), { code: 'BRL' }) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Barras Horizontais Comparativas -->
          <div class="space-y-4">
            <h4 class="font-medium text-lg">Comparativo de Receitas</h4>
            <div class="space-y-3">
              <div v-for="segment in costDistributionData" 
                   :key="segment.company + '_bar'"
                   class="space-y-2">
                
                <!-- Header da barra -->
                <div class="flex items-center justify-between">
                  <span class="font-medium">{{ segment.company }}</span>
                  <div class="text-sm space-x-4">
                    <span class="text-muted-foreground">{{ segment.percentage.toFixed(1) }}%</span>
                    <span class="font-medium text-green-600">{{ formatCurrency(segment.revenue, { code: 'BRL' }) }}</span>
                  </div>
                </div>
                
                <!-- Barra visual -->
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="h-3 rounded-full transition-all duration-700"
                       :style="{ 
                         width: `${segment.percentage}%`,
                         backgroundColor: segment.color 
                       }">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div class="flex items-center justify-between w-full">
          <div class="text-sm text-muted-foreground">
            Receita total: {{ formatCurrency(totalProjectRevenue, { code: 'BRL' }) }} • 
            Custo total: {{ formatCurrency(totalMonthlyCosts, { code: 'BRL' }) }}
          </div>
          <Button variant="outline" @click="exportCompleteReportCSV">
            Relatório Detalhado (CSV)
          </Button>
        </div>
      </CardFooter>
    </Card>

  </div>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>
