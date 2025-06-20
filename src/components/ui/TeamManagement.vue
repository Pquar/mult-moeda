<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Faturas Recentes</CardTitle>
            <CardDescription>{{ filteredInvoices.length }} faturas filtradas</CardDescription>
          </div>
          <Button variant="outline" size="sm" @click="$emit('exportInvoices')">
            <i class="fas fa-file-export mr-2"></i>
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-if="filteredInvoices.length === 0" class="text-center py-4 text-muted-foreground">
            Nenhuma fatura encontrada com os filtros selecionados
          </div>
          <div
v-for="invoice in filteredInvoices.slice(0, 5)" :key="invoice.id" 
               class="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p class="font-medium">{{ invoice.company }}</p>
              <p class="text-sm text-muted-foreground">{{ invoice.invoiceNumber }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium">{{ formatCurrency(invoice.amount, invoice.currency) }}</p>
              <span
class="text-xs px-2 py-1 rounded-full"
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
          <i class="fas fa-eye mr-2"></i>
          Ver Todas as Faturas ({{ filteredInvoices.length }})
        </Button>
      </CardFooter>
    </Card>

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
          <div
v-for="company in uniqueCompanies.slice(0, 6)" :key="company" 
               class="flex items-center justify-between">
            <span class="font-medium">{{ company }}</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-muted-foreground">
                {{ filteredWorkers.filter(w => w.company === company).length }} funcionários
              </span>
              <div class="flex -space-x-1">
                <div
v-for="worker in filteredWorkers.filter(w => w.company === company).slice(0, 3)" 
                     :key="worker.id"
                     class="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium">
                  {{ worker.name.charAt(0) }}
                </div>
                <div
v-if="filteredWorkers.filter(w => w.company === company).length > 3"
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
          <i class="fas fa-users mr-2"></i>
          Gerenciar Equipes ({{ uniqueCompanies.length }} empresas)
        </Button>
      </CardFooter>
    </Card>
  </div>

  <Card class="mt-6">
    <CardHeader>
      <CardTitle>Análise por Cargo</CardTitle>
      <CardDescription>Distribuição de empregados filtrados por função</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="uniqueRoles.length === 0" class="text-center py-8 text-muted-foreground">
        Nenhum cargo encontrado com os filtros selecionados
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
v-for="role in uniqueRoles" :key="role" 
             class="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div class="text-2xl font-bold text-blue-600">
            {{ filteredWorkers.filter(w => w.role === role).length }}
          </div>
          <div class="text-sm text-muted-foreground mt-1">{{ role }}</div>
        </div>
      </div>
    </CardContent>
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

interface Props {
  filteredInvoices: any[]
  filteredWorkers: any[]
  uniqueCompanies: string[]
  uniqueRoles: string[]
  formatCurrency: (amount: number, currency: any) => string
}

defineProps<Props>()

defineEmits<{
  exportInvoices: []
}>()
</script>
