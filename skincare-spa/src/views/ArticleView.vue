<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import articles from '@/assets/data/articles.json'
import ArticleContent from '@/components/blog/ArticleContent.vue'

const route = useRoute()

const article = computed(() =>
  articles.find((a) => a.slug === route.params.slug)
)
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <ArticleContent v-if="article" :article="article" />

      <div v-else class="text-center py-20">
        <p class="text-6xl mb-4">😕</p>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Article introuvable</h2>
        <p class="text-gray-600 mb-6">L'article que vous cherchez n'existe pas ou a été déplacé.</p>
        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 text-primary-500 font-medium hover:text-primary-600 transition-colors"
        >
          ← Retour au blog
        </RouterLink>
      </div>
    </div>
  </div>
</template>
