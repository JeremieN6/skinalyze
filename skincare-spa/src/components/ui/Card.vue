<script setup>
import { cn } from '@/lib/utils'

defineProps({
  class: String
})
</script>

<template>
  <div :class="cn('rounded-xl border bg-white shadow-sm', $props.class)">
    <slot />
  </div>
</template>
