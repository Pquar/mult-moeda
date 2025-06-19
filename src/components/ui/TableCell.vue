<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const cellClass = computed(() => 
  cn(
    "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
    props.class
  )
)
</script>

<template>
  <td :class="cellClass" data-slot="table-cell">
    <slot />
  </td>
</template>
