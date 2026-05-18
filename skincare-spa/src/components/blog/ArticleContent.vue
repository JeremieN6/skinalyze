<script setup>
import { Calendar, ArrowLeft } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

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
  <article class="max-w-3xl mx-auto">
    <!-- Back link -->
    <RouterLink to="/blog" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-500 transition-colors mb-8">
      <ArrowLeft class="w-4 h-4" />
      Retour au blog
    </RouterLink>

    <!-- Header -->
    <div class="mb-10">
      <div class="h-56 sm:h-72 bg-gradient-to-br from-primary-50 to-skinbeige-50 rounded-2xl flex items-center justify-center mb-8">
        <span class="text-8xl">{{ article.image }}</span>
      </div>

      <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Calendar class="w-4 h-4" />
        {{ formatDate(article.date) }}
      </div>

      <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
        {{ article.titre }}
      </h1>

      <p class="text-lg text-gray-600 leading-relaxed">
        {{ article.intro }}
      </p>
    </div>

    <!-- Content sections -->
    <div class="space-y-10">
      <section
        v-for="(section, i) in article.sections"
        :key="i"
      >
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          {{ section.sous_titre }}
        </h2>
        <p class="text-gray-700 leading-relaxed whitespace-pre-line">
          {{ section.contenu }}
        </p>
      </section>
    </div>

    <!-- CTA -->
    <div class="mt-12 bg-primary-50 rounded-2xl p-8 text-center">
      <h3 class="text-xl font-bold text-gray-900 mb-2">Envie de connaître l'état de votre peau ?</h3>
      <p class="text-gray-600 mb-6">Essayez notre diagnostic gratuit et obtenez des conseils personnalisés.</p>
      <RouterLink
        to="/diagnostic"
        class="inline-flex items-center gap-2 bg-primary-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
      >
        🔬 Analyser ma peau
      </RouterLink>
    </div>
  </article>
</template>
