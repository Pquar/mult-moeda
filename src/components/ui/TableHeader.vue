<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const headerClass = computed(() => 
  cn("[&_tr]:border-b", props.class)
)
</script>

<template>
  <thead :class="headerClass" data-slot="table-header">
    <slot />
  </thead>
</template>
