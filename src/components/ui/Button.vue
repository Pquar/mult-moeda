<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus:ring-2 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800",
                destructive:
                    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
                outline:
                    "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100",
                secondary:
                    "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 focus:ring-gray-500 active:bg-gray-300",
                ghost:
                    "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 active:bg-gray-200",
                link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-800",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md gap-1.5 px-3",
                lg: "h-10 rounded-md px-6",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

interface Props {
    variant?: VariantProps<typeof buttonVariants>['variant']
    size?: VariantProps<typeof buttonVariants>['size']
    class?: string
    asChild?: boolean
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    size: 'default',
    asChild: false,
})

const buttonClass = computed(() =>
    cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)
)
</script>

<template>
    <component 
        :is="asChild ? 'div' : 'button'" 
        :class="buttonClass" 
        :disabled="disabled"
        data-slot="button" 
        v-bind="$attrs"
    >
        <slot />
    </component>
</template>
