<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'].includes(v)
  }
})

const variantClasses = {
  default: 'bg-primary-100 text-primary-700',
  secondary: 'bg-gray-100 text-gray-700',
  destructive: 'bg-red-100 text-red-700',
  outline: 'border border-gray-300 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-orange-100 text-orange-700'
}
</script>

<template>
  <span :class="cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variantClasses[variant])">
    <slot />
  </span>
</template>
