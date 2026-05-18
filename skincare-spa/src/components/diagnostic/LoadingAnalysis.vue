<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Sparkles } from 'lucide-vue-next'

const messages = [
  'Observation de la texture et du grain de peau...',
  'Identification des zones sensibles...',
  'Analyse des imperfections visibles...',
  'Préparation de votre routine personnalisée...',
  'Sélection des ingrédients adaptés...',
  'Finalisation de votre diagnostic...'
]

const currentMessageIndex = ref(0)
const progress = ref(0)
let messageInterval = null
let progressInterval = null

onMounted(() => {
  messageInterval = setInterval(() => {
    currentMessageIndex.value = (currentMessageIndex.value + 1) % messages.length
  }, 3000)

  progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 8 + 2
    }
  }, 500)
})

onUnmounted(() => {
  clearInterval(messageInterval)
  clearInterval(progressInterval)
})
</script>

<template>
  <div class="max-w-md mx-auto text-center py-12">
    <!-- Animated icon -->
    <div class="relative w-24 h-24 mx-auto mb-8">
      <div class="absolute inset-0 bg-primary-200 rounded-full animate-ping opacity-20"></div>
      <div class="absolute inset-2 bg-primary-100 rounded-full animate-pulse"></div>
      <div class="relative w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-200">
        <Sparkles class="w-10 h-10 text-white animate-spin" style="animation-duration: 3s;" />
      </div>
    </div>

    <!-- Messages -->
    <Transition
      mode="out-in"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <p :key="currentMessageIndex" class="text-lg font-medium text-gray-700">
        {{ messages[currentMessageIndex] }}
      </p>
    </Transition>

    <!-- Progress bar -->
    <div class="mt-8 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        class="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500 ease-out"
        :style="{ width: Math.min(progress, 95) + '%' }"
      ></div>
    </div>

    <p class="mt-4 text-sm text-gray-500">
      Votre analyse arrive dans quelques secondes...
    </p>
  </div>
</template>
