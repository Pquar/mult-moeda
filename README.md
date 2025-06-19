# Sistema Multi-Moeda 💰

Um dashboard completo para gerenciamento de pagamentos, faturas e empregados em múltiplas moedas, construído com Vue.js 3, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

### 💳 Sistema Multi-Moeda
- **3 Moedas Suportadas**: USD, EUR, BRL
- **Moeda Base**: Real Brasileiro (BRL)
- **Conversão Automática**: Todos os valores convertidos para BRL para comparação
- **Filtros por Moeda**: Visualize pagamentos por moeda específica

### 🏢 Empresas Globais
**Empresas USD:**
- Apple, Microsoft, Amazon, Coca-Cola, Google

**Empresas EUR:**
- Samsung, Toyota, Mercedes-Benz, Nike, BMW

**Empresas BRL:**
- Nubank, Itaú, Ambev, Natura

### 📊 Dados Completos
- **10 Pagamentos** com diferentes status (pending, processing, success, failed)
- **10 Faturas** vinculadas aos empregados
- **20 Empregados** com diferentes cargos:
  - Programador Full Stack
  - Desenvolvedor Backend
  - Desenvolvedor Frontend
  - Desenvolvedor Mobile
  - Product Manager (PM)
  - Analista de Qualidade (Q&A)

### 🎯 Dashboard Interativo
- **Filtros Dinâmicos**: Por moeda e empresa
- **Estatísticas em Tempo Real**: Totais por moeda e conversões
- **Tabelas Responsivas**: Visualização completa dos dados
- **Cores Contextuais**: Status e moedas com códigos de cores

## 🛠️ Tecnologias

- **Vue.js 3** com Composition API
- **TypeScript** para tipagem forte
- **Tailwind CSS** para estilização
- **Vite** como bundler
- **shadcn/ui** (adaptado para Vue) para componentes

## 📂 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/
│   │   └── Button.vue          # Componente Button adaptado do shadcn/ui
│   └── PaymentDashboard.vue    # Dashboard principal
├── lib/
│   ├── payments.ts             # Dados e tipos do sistema
│   └── utils.ts                # Utilitários (cn function)
└── App.vue                     # Aplicação principal
```

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📈 Funcionalidades do Dashboard

### 1. **Filtros Inteligentes**
   - Filtrar por moeda (USD, EUR, BRL)
   - Filtrar por empresa
   - Combinação de filtros

### 2. **Estatísticas por Moeda**
   - Total em moeda local
   - Conversão para USD
   - Número de pagamentos

### 3. **Total Geral**
   - Soma de todos os pagamentos convertidos para BRL
   - Estatísticas consolidadas

### 4. **Tabela de Pagamentos**
   - Informações completas de cada pagamento
   - Status coloridos
   - Valores em moeda local e BRL
   - Dados da empresa e subsidiária

### 5. **Gestão de Empregados**
   - Lista organizada por empresa
   - Cargos e informações de contato
   - Vinculação com faturas

## 💡 Características Técnicas

### Tipos TypeScript
- `Payment`: Estrutura de pagamentos
- `Invoice`: Estrutura de faturas
- `Worker`: Estrutura de empregados
- `Currency`: Definição de moedas
- `PaymentStatus`: Status dos pagamentos
- `SubsidiaryCompany`: Empresas subsidiárias

### Conversão de Moedas
- Sistema baseado em taxas fixas com BRL como moeda base
- Conversão automática para BRL
- Formatação localizada de valores

### Componentes Responsivos
- Layout adaptável para desktop e mobile
- Tabelas com scroll horizontal
- Grid responsivo para estatísticas

## 🎨 Design System

- **Cores por Status:**
  - Success: Verde
  - Pending: Amarelo
  - Processing: Azul
  - Failed: Vermelho

- **Cores por Moeda:**
  - USD: Verde
  - EUR: Azul
  - BRL: Amarelo

## 📝 Próximos Passos

1. **Integração com API Real**: Conectar com backend
2. **Gráficos e Charts**: Adicionar visualizações
3. **Exportação**: PDF e Excel
4. **Notificações**: Sistema de alertas
5. **Múltiplas Moedas**: Expandir para mais moedas

## 🔧 Solução shadcn/ui para Vue

Este projeto resolve o problema comum de baixar componentes React do shadcn/ui em projetos Vue.js:

- **Componentes Convertidos**: Button já adaptado para Vue
- **Dependências Corretas**: lucide-vue-next ao invés de lucide-react
- **Configuração Adequada**: components.json configurado para Vue

---

**Sistema Multi-Moeda** - Dashboard completo para gestão financeira global 🌍
