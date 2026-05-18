<script setup>
import { Heart, Utensils, Scissors, Droplets, Moon, Brain } from 'lucide-vue-next'

defineProps({
  conseils: {
    type: Array,
    required: true
  }
})

const categoryIcons = {
  'Rasage': Scissors,
  'Alimentation': Utensils,
  'Routine': Droplets,
  'Hygiène': Droplets,
  'Stress': Brain,
  'Sommeil': Moon
}

function getCategoryIcon(categorie) {
  return categoryIcons[categorie] || Heart
}

const categoryColors = {
  'Rasage': 'bg-orange-100 text-orange-600',
  'Alimentation': 'bg-yellow-100 text-yellow-600',
  'Routine': 'bg-blue-100 text-blue-600',
  'Hygiène': 'bg-cyan-100 text-cyan-600',
  'Stress': 'bg-purple-100 text-purple-600',
  'Sommeil': 'bg-indigo-100 text-indigo-600'
}

function getCategoryColor(categorie) {
  return categoryColors[categorie] || 'bg-green-100 text-green-600'
}
</script>

<template>
  <div class="bg-green-50 rounded-2xl p-6 sm:p-8 border border-green-100">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
        <Heart class="w-5 h-5 text-green-600" />
      </div>
      <h3 class="text-xl font-bold text-gray-900">Votre routine personnalisée</h3>
    </div>

    <div class="space-y-3">
      <div
        v-for="(conseil, i) in conseils"
        :key="i"
        class="bg-white rounded-xl p-4 shadow-sm flex gap-4"
      >
        <div :class="['w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', getCategoryColor(conseil.categorie)]">
          <component :is="getCategoryIcon(conseil.categorie)" class="w-5 h-5" />
        </div>
        <div>
          <span class="text-xs font-semibold uppercase tracking-wide text-gray-400">{{ conseil.categorie }}</span>
          <p class="text-sm text-gray-700 leading-relaxed mt-1">{{ conseil.conseil }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
