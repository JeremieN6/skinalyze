<script setup>
import { RouterLink } from 'vue-router'
import { Calendar, ArrowRight } from 'lucide-vue-next'

defineProps({
  article: {
    type: Object,
    required: true
  }
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <RouterLink
    :to="`/blog/${article.slug}`"
    class="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
  >
    <!-- Image placeholder -->
    <div class="h-48 bg-gradient-to-br from-primary-50 to-skinbeige-50 flex items-center justify-center">
      <span class="text-6xl">{{ article.image }}</span>
    </div>

    <div class="p-6">
      <!-- Date -->
      <div class="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
        <Calendar class="w-3.5 h-3.5" />
        {{ formatDate(article.date) }}
      </div>

      <!-- Title -->
      <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-500 transition-colors leading-snug mb-3">
        {{ article.titre }}
      </h3>

      <!-- Intro -->
      <p class="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
        {{ article.intro }}
      </p>

      <!-- CTA -->
      <span class="inline-flex items-center gap-1 text-sm font-medium text-primary-500 group-hover:gap-2 transition-all">
        Lire l'article
        <ArrowRight class="w-4 h-4" />
      </span>
    </div>
  </RouterLink>
</template>
