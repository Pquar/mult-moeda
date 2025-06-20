import { ref, computed } from 'vue'
import { payments, invoices, workers, currencies } from '@/lib/payments'

// Estado global dos filtros
export const selectedCurrency = ref('all')
export const selectedCompany = ref('all')
export const selectedSubsidiaryCompany = ref('all')

// Estado para filtros de faturas
export const invoicesPeriod = ref<'day' | 'week' | 'month'>('month')
export const selectedMonth = ref<string>('')

// Função para formatar valores monetários
export const formatCurrency = (amount: number, currency: any) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2
  }).format(amount)
}

// Função para converter valores para BRL (moeda base)
export const convertToBRL = (amount: number, currency: any) => {
  if (currency.code === 'BRL') {
    return amount
  }
  return amount / currency.value
}

// Função para limpar filtros
export const clearFilters = () => {
  selectedCurrency.value = 'all'
  selectedCompany.value = 'all'
  selectedSubsidiaryCompany.value = 'all'
}

// Pagamentos filtrados
export const filteredPayments = computed(() => {
  return payments.filter(payment => {
    const currencyMatch = selectedCurrency.value === 'all' || payment.currency.code === selectedCurrency.value
    const companyMatch = selectedCompany.value === 'all' || payment.company === selectedCompany.value
    const subsidiaryMatch = selectedSubsidiaryCompany.value === 'all' || payment.subsidiaryCompany === selectedSubsidiaryCompany.value
    return currencyMatch && companyMatch && subsidiaryMatch
  })
})

// Faturas filtradas
export const filteredInvoices = computed(() => {
  return invoices.filter(invoice => {
    const currencyMatch = selectedCurrency.value === 'all' || invoice.currency.code === selectedCurrency.value
    const companyMatch = selectedCompany.value === 'all' || invoice.company === selectedCompany.value
    const subsidiaryMatch = selectedSubsidiaryCompany.value === 'all' || invoice.subsidiaryCompany === selectedSubsidiaryCompany.value
    return currencyMatch && companyMatch && subsidiaryMatch
  })
})

// Empregados filtrados
export const filteredWorkers = computed(() => {
  return workers.filter(worker => {
    const currencyMatch = selectedCurrency.value === 'all' || worker.currency.code === selectedCurrency.value
    const companyMatch = selectedCompany.value === 'all' || worker.company === selectedCompany.value
    return currencyMatch && companyMatch
  })
})

// Total geral em BRL
export const totalInBRL = computed(() => {
  return filteredPayments.value.reduce((total, payment) => {
    return total + convertToBRL(payment.amount, payment.currency)
  }, 0)
})

// Empresas para o filtro
export const allCompanies = computed(() => {
  const companies = [...new Set(payments.map(p => p.company))]
  return companies.sort()
})

// Empresas subsidiárias para o filtro
export const allSubsidiaryCompanies = computed(() => {
  const subsidiaryCompanies = [...new Set(payments.map(p => p.subsidiaryCompany))]
  return subsidiaryCompanies.map(code => {
    const names: { [key: string]: string } = {
      'COMPANY_USD': 'Subsidiária USD',
      'COMPANY_EUR': 'Subsidiária EUR', 
      'COMPANY_BRL': 'Subsidiária BRL'
    }
    return {
      code,
      name: names[code] || code
    }
  }).sort((a, b) => a.name.localeCompare(b.name))
})

// Verificar se há filtros ativos
export const hasActiveFilters = computed(() => {
  return selectedCurrency.value !== 'all' || selectedCompany.value !== 'all' || selectedSubsidiaryCompany.value !== 'all'
})

// Estatísticas por moeda
export const statsByCurrency = computed(() => {
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

// Empresas únicas (baseado nos dados filtrados)
export const uniqueCompanies = computed(() => {
  const companies = [...new Set(filteredPayments.value.map(p => p.company))]
  return companies.sort()
})

// Cargos únicos (baseado nos empregados filtrados)
export const uniqueRoles = computed(() => {
  const roles = [...new Set(filteredWorkers.value.map(w => w.role))]
  return roles.sort()
})

// Cálculo de lucros por empresa
export const profitsByCompany = computed(() => {
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
export const totalProfit = computed(() => {
  return profitsByCompany.value.reduce((sum, company) => sum + company.profit, 0)
})

export const totalRevenue = computed(() => {
  return profitsByCompany.value.reduce((sum, company) => sum + company.revenue, 0)
})

export const totalCosts = computed(() => {
  return profitsByCompany.value.reduce((sum, company) => sum + company.costs, 0)
})

export const overallProfitMargin = computed(() => {
  return totalRevenue.value > 0 ? (totalProfit.value / totalRevenue.value) * 100 : 0
})

// Cálculo de salários mensais dos profissionais por projeto
export const monthlySalariesByProject = computed(() => {
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
    const projectProfit = projectRevenue - totalMonthlyCost
    
    return {
      project,
      workers: workersWithSalary.sort((a, b) => b.monthlySalaryBRL - a.monthlySalaryBRL),
      totalMonthlyCost,
      projectRevenue,
      projectProfit,
      workerCount: workersWithSalary.length,
      paymentsCount: projectPayments.length
    }
  }).sort((a, b) => b.projectRevenue - a.projectRevenue) // Ordenar por receita decrescente
})

// Totais gerais de salários mensais
export const totalMonthlyCosts = computed(() => {
  return monthlySalariesByProject.value.reduce((sum, project) => sum + project.totalMonthlyCost, 0)
})

// Total de receita de projetos
export const totalProjectRevenue = computed(() => {
  return monthlySalariesByProject.value.reduce((sum, project) => sum + project.projectRevenue, 0)
})

// Custo médio por projeto
export const averageProjectCost = computed(() => {
  return monthlySalariesByProject.value.length > 0 ? 
    totalMonthlyCosts.value / monthlySalariesByProject.value.length : 0
})

// Profissional com maior salário
export const highestPaidWorker = computed(() => {
  const allWorkers = monthlySalariesByProject.value.flatMap(p => p.workers)
  return allWorkers.length > 0 ? 
    allWorkers.reduce((highest, current) => 
      (current.monthlySalaryBRL || 0) > (highest.monthlySalaryBRL || 0) ? current : highest
    ) : null
})

// Meses disponíveis baseado nas faturas
export const availableMonths = computed(() => {
  const months = new Set<string>()
  
  filteredInvoices.value.forEach(invoice => {
    const date = new Date(invoice.issueDate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    months.add(monthKey)
  })
  
  // Adicionar últimos 12 meses mesmo se não houver dados
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    months.add(monthKey)
  }
  
  return Array.from(months)
    .sort()
    .reverse()
    .map(monthKey => {
      const date = new Date(monthKey + '-01')
      return {
        value: monthKey,
        label: new Intl.DateTimeFormat('pt-BR', { 
          month: 'long', 
          year: 'numeric' 
        }).format(date)
      }
    })
})

// Dados para o gráfico de faturas baseado no período selecionado
export const invoicesChartData = computed(() => {
  const periodData: { [key: string]: number } = {}
  
  // Filtrar faturas por mês se selecionado (apenas para visualização diária)
  let invoicesToProcess = filteredInvoices.value
  if (selectedMonth.value && invoicesPeriod.value === 'day') {
    invoicesToProcess = filteredInvoices.value.filter(invoice => {
      const date = new Date(invoice.issueDate)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      return monthKey === selectedMonth.value
    })
  }
  
  // Processar faturas
  invoicesToProcess.forEach(invoice => {
    const date = new Date(invoice.issueDate)
    let periodKey: string
    
    if (invoicesPeriod.value === 'day') {
      periodKey = date.toISOString().split('T')[0]
    } else if (invoicesPeriod.value === 'week') {
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      periodKey = startOfWeek.toISOString().split('T')[0]
    } else {
      periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }
    
    const amountInBRL = convertToBRL(invoice.amount, invoice.currency)
    periodData[periodKey] = (periodData[periodKey] || 0) + amountInBRL
  })
  
  // Gerar períodos
  const now = new Date()
  const periods = []
  
  if (invoicesPeriod.value === 'day') {
    if (selectedMonth.value) {
      const [year, month] = selectedMonth.value.split('-').map(Number)
      const daysInMonth = new Date(year, month, 0).getDate()
      
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month - 1, d)
        const periodKey = date.toISOString().split('T')[0]
        const periodLabel = new Intl.DateTimeFormat('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }).format(date)
        
        periods.push({
          label: periodLabel,
          value: periodData[periodKey] || 0,
          date: periodKey
        })
      }
    } else {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(now.getDate() - i)
        const periodKey = date.toISOString().split('T')[0]
        const periodLabel = new Intl.DateTimeFormat('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }).format(date)
        
        periods.push({
          label: periodLabel,
          value: periodData[periodKey] || 0,
          date: periodKey
        })
      }
    }
  } else if (invoicesPeriod.value === 'week') {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(now.getDate() - (i * 7))
      
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      const periodKey = startOfWeek.toISOString().split('T')[0]
      
      const weekOfMonth = Math.ceil((startOfWeek.getDate() + startOfWeek.getDay()) / 7)
      const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(startOfWeek)
      const year = startOfWeek.getFullYear().toString().slice(-2)
      
      periods.push({
        label: `${monthName}/${year}-S${weekOfMonth}`,
        value: periodData[periodKey] || 0,
        date: periodKey
      })
    }
  } else {
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const periodLabel = new Intl.DateTimeFormat('pt-BR', { 
        month: 'short', 
        year: '2-digit' 
      }).format(date)
      
      periods.push({
        label: periodLabel,
        value: periodData[periodKey] || 0,
        date: periodKey
      })
    }
  }
  
  return periods
})

// Funções de exportação
export const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n')
  
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

export const exportPayments = () => {
  const csvData = filteredPayments.value.map(payment => ({
    'Data': payment.date,
    'Descrição': payment.description,
    'Valor': payment.amount,
    'Moeda': payment.currency.code,
    'Valor em BRL': convertToBRL(payment.amount, payment.currency).toFixed(2),
    'Empresa': payment.company
  }))
  
  downloadCSV(csvData, 'pagamentos.csv')
}

export const exportWorkers = () => {
  const csvData = filteredWorkers.value.map(worker => ({
    'Nome': worker.name,
    'Cargo': worker.role,
    'Horas Trabalhadas': worker.hoursWorked,
    'Valor por Hora': worker.hourlyRate,
    'Moeda': worker.currency.code,
    'Salário Mensal': (worker.hoursWorked * worker.hourlyRate).toFixed(2),
    'Salário em BRL': convertToBRL(worker.hoursWorked * worker.hourlyRate, worker.currency).toFixed(2),
    'Empresa': worker.company
  }))
  
  downloadCSV(csvData, 'profissionais.csv')
}

export const exportProfits = () => {
  const csvData = profitsByCompany.value.map(company => ({
    'Empresa': company.company,
    'Receita': company.revenue.toFixed(2),
    'Custos': company.costs.toFixed(2),
    'Lucro': company.profit.toFixed(2),
    'Margem de Lucro (%)': company.profitMargin.toFixed(2),
    'Moeda': 'BRL'
  }))
  
  downloadCSV(csvData, 'lucros.csv')
}

export const exportInvoices = () => {
  const csvData = filteredInvoices.value.map(invoice => ({
    'ID': invoice.id,
    'Número da Fatura': invoice.invoiceNumber,
    'Data de Emissão': invoice.issueDate,
    'Data de Vencimento': invoice.dueDate,
    'Cliente': invoice.client || 'N/A',
    'Valor': invoice.amount,
    'Moeda': invoice.currency.code,
    'Valor em BRL': convertToBRL(invoice.amount, invoice.currency).toFixed(2),
    'Status': invoice.status,
    'Empresa': invoice.company,
    'Descrição': invoice.description || 'N/A'
  }))
  
  downloadCSV(csvData, 'faturas.csv')
}

export const exportInvoicesChart = () => {
  const csvData = invoicesChartData.value.map(item => ({
    'Período': item.label,
    'Data': item.date,
    'Valor Total (BRL)': item.value.toFixed(2),
    'Período de Agrupamento': invoicesPeriod.value === 'day' ? 'Diário' : 
                             invoicesPeriod.value === 'week' ? 'Semanal' : 'Mensal'
  }))
  
  const filename = `faturas_${invoicesPeriod.value === 'day' ? 'diario' : 
                              invoicesPeriod.value === 'week' ? 'semanal' : 'mensal'}.csv`
  downloadCSV(csvData, filename)
}

// Funções de exportação adicionais migradas do PaymentDashboard
export const exportAnalytics = () => {
  const csvData = statsByCurrency.value.map(stat => ({
    'Moeda': stat.currency.code,
    'Quantidade de Pagamentos': stat.count,
    'Total na Moeda': stat.total.toFixed(2),
    'Total em BRL': stat.totalBRL.toFixed(2),
    'Taxa de Câmbio': stat.currency.value
  }))
  
  downloadCSV(csvData, 'analytics_por_moeda.csv')
}

export const exportFullReport = () => {
  const csvData = profitsByCompany.value.map(company => {
    const companyWorkers = filteredWorkers.value.filter(w => w.company === company.company)
    const companyPayments = filteredPayments.value.filter(p => p.company === company.company)
    
    return {
      'Empresa': company.company,
      'Total de Receitas (BRL)': company.revenue.toFixed(2),
      'Total de Custos (BRL)': company.costs.toFixed(2),
      'Lucro (BRL)': company.profit.toFixed(2),
      'Margem de Lucro (%)': company.profitMargin.toFixed(2),
      'Número de Funcionários': companyWorkers.length,
      'Número de Pagamentos': companyPayments.length
    }
  })
  
  downloadCSV(csvData, 'relatorio_completo.csv')
}
