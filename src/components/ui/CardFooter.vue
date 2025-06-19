<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const footerClass = computed(() => 
  cn("flex items-center px-6 [.border-t]:pt-6", props.class)
)
</script>

<template>
  <div :class="footerClass" data-slot="card-footer">
    <slot />
  </div>
</template>
