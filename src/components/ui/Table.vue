<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const tableClass = computed(() => 
  cn("w-full caption-bottom text-sm", props.class)
)
</script>

<template>
  <div data-slot="table-container" class="relative w-full overflow-x-auto">
    <table :class="tableClass" data-slot="table">
      <slot />
    </table>
  </div>
</template>
