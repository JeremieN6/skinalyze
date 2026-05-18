<script setup>
import articles from '@/assets/data/articles.json'
import ArticleCard from '@/components/blog/ArticleCard.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">
          Blog <span class="text-primary-500">SkinGlow</span>
        </h1>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Conseils, guides et astuces pour prendre soin de votre peau au quotidien.
        </p>
      </div>

      <!-- Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <ArticleCard
          v-for="article in articles"
          :key="article.slug"
          :article="article"
        />
      </div>
    </div>
  </div>
</template>
