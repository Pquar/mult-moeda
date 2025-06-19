type Payment = {
  id: string
  amount: number
  status: PaymentStatus
  email: string
  company: string
  currency: Currency
  date: string
  subsidiaryCompany: SubsidiaryCompany
}

type PaymentStatus = "pending" | "processing" | "success" | "failed"
type SubsidiaryCompany = "COMPANY_USD" | "COMPANY_EUR" | "COMPANY_BRL"

type Invoice = {
    id: string
    amount: number
    status: PaymentStatus
    email: string
    company: string
    subsidiaryCompany: SubsidiaryCompany
    dueDate: string
    invoiceNumber: string
    workers: Worker[]
    currency: Currency
    issueDate: string
}

type Worker = {
  id: string
  name: string
  email: string
  role: string
  hourlyRate: number
  hoursWorked: number
  currency: Currency
  company: string
}

type Currency = {
  code: string
  symbol: "BRL" | "USD" | "EUR" | "GBP"
  name: string
  value: number
}

// Definição das moedas (BRL como base)
export const currencies: Currency[] = [
  {
    code: "USD",
    symbol: "USD",
    name: "US Dollar",
    value: 0.20  // 1 BRL = 0.20 USD (1 USD = 5 BRL aproximadamente)
  },
  {
    code: "EUR", 
    symbol: "EUR",
    name: "Euro",
    value: 0.18  // 1 BRL = 0.18 EUR (1 EUR = 5.5 BRL aproximadamente)
  },
  {
    code: "BRL",
    symbol: "BRL",
    name: "Brazilian Real",
    value: 1.0   // Moeda base
  }
]

// Helper function para obter moeda
const getCurrency = (symbol: "USD" | "EUR" | "BRL"): Currency => {
  return currencies.find(c => c.symbol === symbol)!
}

// 10 Pagamentos de diferentes empresas
export const payments: Payment[] = [
    {
        id: "pay_001",
        amount: 25000,
        status: "success",
        email: "finance@apple.com",
        company: "Apple",
        currency: getCurrency("USD"),
        date: "2025-06-15",
        subsidiaryCompany: "COMPANY_USD"
    },
    {
        id: "pay_002", 
        amount: 18000,
        status: "processing",
        email: "accounting@microsoft.com",
        company: "Microsoft",
        currency: getCurrency("USD"),
        date: "2025-06-16",
        subsidiaryCompany: "COMPANY_USD"
    },
    {
        id: "pay_003",
        amount: 32000,
        status: "pending",
        email: "payments@amazon.com", 
        company: "Amazon",
        currency: getCurrency("USD"),
        date: "2025-06-17",
        subsidiaryCompany: "COMPANY_USD"
    },
    {
        id: "pay_004",
        amount: 22000,
        status: "success",
        email: "finance@coca-cola.com",
        company: "Coca-Cola",
        currency: getCurrency("USD"),
        date: "2025-06-18",
        subsidiaryCompany: "COMPANY_USD"
    },
    {
        id: "pay_005",
        amount: 28000,
        status: "failed",
        email: "billing@google.com",
        company: "Google",
        currency: getCurrency("USD"),
        date: "2025-06-19",
        subsidiaryCompany: "COMPANY_USD"
    },
    {
        id: "pay_006",
        amount: 15000,
        status: "processing",
        email: "finance@samsung.com",
        company: "Samsung",
        currency: getCurrency("EUR"),
        date: "2025-06-14",
        subsidiaryCompany: "COMPANY_EUR"
    },
    {
        id: "pay_007",
        amount: 35000,
        status: "success",
        email: "payments@toyota.com",
        company: "Toyota", 
        currency: getCurrency("EUR"),
        date: "2025-06-13",
        subsidiaryCompany: "COMPANY_EUR"
    },
    {
        id: "pay_008",
        amount: 45000,
        status: "pending",
        email: "finance@mercedes-benz.com",
        company: "Mercedes-Benz",
        currency: getCurrency("EUR"),
        date: "2025-06-12",
        subsidiaryCompany: "COMPANY_EUR"
    },
    {
        id: "pay_009",
        amount: 12000,
        status: "success",
        email: "accounting@nike.com",
        company: "Nike",
        currency: getCurrency("EUR"),
        date: "2025-06-11",
        subsidiaryCompany: "COMPANY_EUR"
    },
    {
        id: "pay_010",
        amount: 38000,
        status: "processing",
        email: "finance@bmw.com",
        company: "BMW",
        currency: getCurrency("EUR"),
        date: "2025-06-10",
        subsidiaryCompany: "COMPANY_EUR"
    },
    {
        id: "pay_011",
        amount: 50000,
        status: "success",
        email: "finance@nubank.com",
        company: "Nubank",
        currency: getCurrency("BRL"),
        date: "2025-06-20",
        subsidiaryCompany: "COMPANY_BRL"
    },
    {
        id: "pay_012",
        amount: 75000,
        status: "pending",
        email: "pagamentos@itau.com.br",
        company: "Itaú",
        currency: getCurrency("BRL"),
        date: "2025-06-21",
        subsidiaryCompany: "COMPANY_BRL"
    },
    {
        id: "pay_013",
        amount: 62000,
        status: "processing",
        email: "contas@ambev.com.br",
        company: "Ambev",
        currency: getCurrency("BRL"),
        date: "2025-06-22",
        subsidiaryCompany: "COMPANY_BRL"
    },
    {
        id: "pay_014",
        amount: 48000,
        status: "success",
        email: "financeiro@natura.net",
        company: "Natura",
        currency: getCurrency("BRL"),
        date: "2025-06-23",
        subsidiaryCompany: "COMPANY_BRL"
    }
]

// 20 Empregadores com diferentes cargos
export const workers: Worker[] = [
  {
    id: "emp_001",
    name: "João Silva",
    email: "joao.silva@apple.com",
    role: "Programador Full Stack",
    hourlyRate: 85,
    hoursWorked: 160,
    currency: getCurrency("USD"),
    company: "Apple"
  },
  {
    id: "emp_002", 
    name: "Maria Santos",
    email: "maria.santos@microsoft.com",
    role: "Desenvolvedor Backend",
    hourlyRate: 75,
    hoursWorked: 168,
    currency: getCurrency("USD"),
    company: "Microsoft"
  },
  {
    id: "emp_003",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@amazon.com",
    role: "Desenvolvedor Frontend",
    hourlyRate: 70,
    hoursWorked: 155,
    currency: getCurrency("USD"),
    company: "Amazon"
  },
  {
    id: "emp_004",
    name: "Ana Costa",
    email: "ana.costa@coca-cola.com", 
    role: "Desenvolvedor Mobile",
    hourlyRate: 80,
    hoursWorked: 150,
    currency: getCurrency("USD"),
    company: "Coca-Cola"
  },
  {
    id: "emp_005",
    name: "Carlos Ferreira",
    email: "carlos.ferreira@google.com",
    role: "Product Manager",
    hourlyRate: 95,
    hoursWorked: 160,
    currency: getCurrency("USD"),
    company: "Google"
  },
  {
    id: "emp_006",
    name: "Lucia Rodriguez",
    email: "lucia.rodriguez@samsung.com",
    role: "Analista de Qualidade",
    hourlyRate: 60,
    hoursWorked: 165,
    currency: getCurrency("EUR"),
    company: "Samsung"
  },
  {
    id: "emp_007",
    name: "Roberto Takashi",
    email: "roberto.takashi@toyota.com",
    role: "Programador Full Stack",
    hourlyRate: 78,
    hoursWorked: 170,
    currency: getCurrency("EUR"),
    company: "Toyota"
  },
  {
    id: "emp_008",
    name: "Sophie Mueller",
    email: "sophie.mueller@mercedes-benz.com",
    role: "Desenvolvedor Backend",
    hourlyRate: 82,
    hoursWorked: 158,
    currency: getCurrency("EUR"),
    company: "Mercedes-Benz"
  },
  {
    id: "emp_009",
    name: "Mike Johnson",
    email: "mike.johnson@nike.com",
    role: "Desenvolvedor Frontend", 
    hourlyRate: 68,
    hoursWorked: 162,
    currency: getCurrency("EUR"),
    company: "Nike"
  },
  {
    id: "emp_010",
    name: "Hans Schmidt",
    email: "hans.schmidt@bmw.com",
    role: "Desenvolvedor Mobile",
    hourlyRate: 85,
    hoursWorked: 155,
    currency: getCurrency("EUR"),
    company: "BMW"
  },
  {
    id: "emp_011",
    name: "Isabella Martinez",
    email: "isabella.martinez@nubank.com",
    role: "Product Manager",
    hourlyRate: 65,
    hoursWorked: 160,
    currency: getCurrency("BRL"),
    company: "Nubank"
  },
  {
    id: "emp_012",
    name: "Gabriel Souza",
    email: "gabriel.souza@itau.com",
    role: "Analista de Qualidade",
    hourlyRate: 45,
    hoursWorked: 168,
    currency: getCurrency("BRL"),
    company: "Itaú"
  },
  {
    id: "emp_013",
    name: "Fernanda Lima",
    email: "fernanda.lima@ambev.com",
    role: "Programador Full Stack",
    hourlyRate: 55,
    hoursWorked: 165,
    currency: getCurrency("BRL"),
    company: "Ambev"
  },
  {
    id: "emp_014",
    name: "Ricardo Pereira",
    email: "ricardo.pereira@natura.com",
    role: "Desenvolvedor Backend",
    hourlyRate: 50,
    hoursWorked: 160,
    currency: getCurrency("BRL"),
    company: "Natura"
  },
  {
    id: "emp_015",
    name: "Emma Thompson",
    email: "emma.thompson@apple.com",
    role: "Desenvolvedor Frontend",
    hourlyRate: 72,
    hoursWorked: 158,
    currency: getCurrency("USD"),
    company: "Apple"
  },
  {
    id: "emp_016",
    name: "David Chen",
    email: "david.chen@microsoft.com",
    role: "Desenvolvedor Mobile",
    hourlyRate: 78,
    hoursWorked: 162,
    currency: getCurrency("USD"),
    company: "Microsoft"
  },
  {
    id: "emp_017",
    name: "Sarah Wilson",
    email: "sarah.wilson@amazon.com",
    role: "Product Manager",
    hourlyRate: 90,
    hoursWorked: 155,
    currency: getCurrency("USD"),
    company: "Amazon"
  },
  {
    id: "emp_018",
    name: "Marco Rossi",
    email: "marco.rossi@samsung.com",
    role: "Analista de Qualidade",
    hourlyRate: 58,
    hoursWorked: 170,
    currency: getCurrency("EUR"),
    company: "Samsung"
  },
  {
    id: "emp_019",
    name: "François Dubois",
    email: "francois.dubois@toyota.com",
    role: "Programador Full Stack",
    hourlyRate: 80,
    hoursWorked: 160,
    currency: getCurrency("EUR"),
    company: "Toyota"
  },
  {
    id: "emp_020",
    name: "Camila Vargas",
    email: "camila.vargas@nubank.com",
    role: "Desenvolvedor Backend",
    hourlyRate: 52,
    hoursWorked: 165,
    currency: getCurrency("BRL"),
    company: "Nubank"
  }
]

// 10 Invoices (Faturas)
export const invoices: Invoice[] = [
    {
        id: "inv_001",
        amount: 13600,
        status: "success",
        email: "finance@apple.com",
        company: "Apple",
        subsidiaryCompany: "COMPANY_USD",
        dueDate: "2025-07-15",
        invoiceNumber: "AP-2025-001",
        workers: [workers[0], workers[14]],
        currency: getCurrency("USD"),
        issueDate: "2025-06-15"
    },
    {
        id: "inv_002",
        amount: 12580,
        status: "pending",
        email: "accounting@microsoft.com", 
        company: "Microsoft",
        subsidiaryCompany: "COMPANY_EUR",
        dueDate: "2025-07-16",
        invoiceNumber: "MS-2025-002",
        workers: [workers[1], workers[15]],
        currency: getCurrency("USD"),
        issueDate: "2025-06-16"
    },
    {
        id: "inv_003",
        amount: 24800,
        status: "processing",
        email: "payments@amazon.com",
        company: "Amazon",
        subsidiaryCompany: "COMPANY_BRL", 
        dueDate: "2025-07-17",
        invoiceNumber: "AMZ-2025-003",
        workers: [workers[2], workers[16]],
        currency: getCurrency("USD"),
        issueDate: "2025-06-17"
    },
    {
        id: "inv_004",
        amount: 12000,
        status: "success",
        email: "finance@coca-cola.com",
        company: "Coca-Cola",
        subsidiaryCompany: "COMPANY_USD",
        dueDate: "2025-07-18", 
        invoiceNumber: "CC-2025-004",
        workers: [workers[3]],
        currency: getCurrency("USD"),
        issueDate: "2025-06-18"
    },
    {
        id: "inv_005",
        amount: 15200,
        status: "failed",
        email: "billing@google.com",
        company: "Google",
        subsidiaryCompany: "COMPANY_EUR",
        dueDate: "2025-07-19",
        invoiceNumber: "GG-2025-005",
        workers: [workers[4]],
        currency: getCurrency("USD"),
        issueDate: "2025-06-19"
    },
    {
        id: "inv_006",
        amount: 9900,
        status: "processing",
        email: "finance@samsung.com",
        company: "Samsung",
        subsidiaryCompany: "COMPANY_BRL",
        dueDate: "2025-07-14",
        invoiceNumber: "SM-2025-006", 
        workers: [workers[5], workers[17]],
        currency: getCurrency("EUR"),
        issueDate: "2025-06-14"
    },
    {
        id: "inv_007",
        amount: 13260,
        status: "success",
        email: "payments@toyota.com",
        company: "Toyota",
        subsidiaryCompany: "COMPANY_USD",
        dueDate: "2025-07-13",
        invoiceNumber: "TY-2025-007",
        workers: [workers[6], workers[18]],
        currency: getCurrency("EUR"),
        issueDate: "2025-06-13"
    },
    {
        id: "inv_008",
        amount: 12956,
        status: "pending",
        email: "finance@mercedes-benz.com",
        company: "Mercedes-Benz",
        subsidiaryCompany: "COMPANY_EUR",
        dueDate: "2025-07-12",
        invoiceNumber: "MB-2025-008",
        workers: [workers[7]],
        currency: getCurrency("EUR"),
        issueDate: "2025-06-12"
    },
    {
        id: "inv_009",
        amount: 11016,
        status: "success",
        email: "accounting@nike.com",
        company: "Nike",
        subsidiaryCompany: "COMPANY_BRL",
        dueDate: "2025-07-11",
        invoiceNumber: "NK-2025-009",
        workers: [workers[8]],
        currency: getCurrency("EUR"),
        issueDate: "2025-06-11"
    },
    {
        id: "inv_010",
        amount: 13175,
        status: "processing",
        email: "finance@bmw.com",
        company: "BMW",
        subsidiaryCompany: "COMPANY_USD",
        dueDate: "2025-07-10",
        invoiceNumber: "BM-2025-010",
        workers: [workers[9]],
        currency: getCurrency("EUR"),
        issueDate: "2025-06-10"
    },
    {
        id: "inv_011",
        amount: 18980,
        status: "success",
        email: "finance@nubank.com",
        company: "Nubank",
        subsidiaryCompany: "COMPANY_USD",
        dueDate: "2025-07-20",
        invoiceNumber: "NU-2025-011",
        workers: [workers[10], workers[19]],
        currency: getCurrency("BRL"),
        issueDate: "2025-06-20"
    },
    {
        id: "inv_012",
        amount: 7560,
        status: "pending",
        email: "pagamentos@itau.com.br",
        company: "Itaú",
        subsidiaryCompany: "COMPANY_EUR",
        dueDate: "2025-07-21",
        invoiceNumber: "IT-2025-012",
        workers: [workers[11]],
        currency: getCurrency("BRL"),
        issueDate: "2025-06-21"
    },
    {
        id: "inv_013",
        amount: 9075,
        status: "processing",
        email: "contas@ambev.com.br",
        company: "Ambev",
        subsidiaryCompany: "COMPANY_BRL",
        dueDate: "2025-07-22",
        invoiceNumber: "AM-2025-013",
        workers: [workers[12]],
        currency: getCurrency("BRL"),
        issueDate: "2025-06-22"
    },
    {
        id: "inv_014",
        amount: 8000,
        status: "success",
        email: "financeiro@natura.net",
        company: "Natura",
        subsidiaryCompany: "COMPANY_USD",
        dueDate: "2025-07-23",
        invoiceNumber: "NA-2025-014",
        workers: [workers[13]],
        currency: getCurrency("BRL"),
        issueDate: "2025-06-23"
    }
]