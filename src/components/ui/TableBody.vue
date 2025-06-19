<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const bodyClass = computed(() => 
  cn("[&_tr:last-child]:border-0", props.class)
)
</script>

<template>
  <tbody :class="bodyClass" data-slot="table-body">
    <slot />
  </tbody>
</template>
