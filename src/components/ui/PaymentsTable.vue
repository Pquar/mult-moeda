<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>Pagamentos ({{ filteredPayments.length }})</CardTitle>
          <CardDescription>Lista completa de todos os pagamentos registrados</CardDescription>
        </div>
        <Button variant="outline" size="sm" @click="$emit('exportPayments')">
          <i class="fas fa-file-export mr-2"></i>
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
              <span
class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': payment.currency.code === 'USD',
                      'bg-blue-100 text-blue-800': payment.currency.code === 'EUR',
                      'bg-yellow-100 text-yellow-800': payment.currency.code === 'BRL'
                    }">
                {{ payment.currency.code }}
              </span>
            </TableCell>
            <TableCell>
              <span
class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
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
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Table from '@/components/ui/Table.vue'
import TableHeader from '@/components/ui/TableHeader.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableRow from '@/components/ui/TableRow.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableCell from '@/components/ui/TableCell.vue'

interface Props {
  filteredPayments: any[]
  formatCurrency: (amount: number, currency: any) => string
  convertToBRL: (amount: number, currency: any) => number
}

defineProps<Props>()

defineEmits<{
  exportPayments: []
}>()
</script>
