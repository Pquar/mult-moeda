<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const descriptionClass = computed(() => 
  cn("text-muted-foreground text-sm", props.class)
)
</script>

<template>
  <div :class="descriptionClass" data-slot="card-description">
    <slot />
  </div>
</template>
