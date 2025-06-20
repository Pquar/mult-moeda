<template>
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
        <Button variant="outline" @click="$emit('exportProfits')">
          <i class="fas fa-download mr-2"></i>
          Exportar Análise Financeira
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardFooter from '@/components/ui/CardFooter.vue'
import Button from '@/components/ui/Button.vue'
import Table from '@/components/ui/Table.vue'
import TableHeader from '@/components/ui/TableHeader.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableRow from '@/components/ui/TableRow.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableCell from '@/components/ui/TableCell.vue'

// Props
interface Props {
  profitsByCompany: any[]
  filteredWorkers: any[]
  filteredPayments: any[]
  hasActiveFilters: boolean
  formatCurrency: (amount: number, currency: any) => string
}

defineProps<Props>()

// Emits
defineEmits<{
  exportProfits: []
}>()
</script>
