<script setup>
import { Microscope, Heart, ShoppingBag, Zap } from 'lucide-vue-next'

const benefits = [
  {
    icon: Microscope,
    title: 'Un diagnostic honnête',
    description: 'Identifiez enfin ce qui se passe vraiment sur votre peau : acné, poils incarnés, hyperpigmentation, excès de sébum... Chaque problème expliqué clairement, sans jargon.',
    color: 'bg-blue-50 text-blue-500'
  },
  {
    icon: Heart,
    title: 'Une routine qui vous ressemble',
    description: 'Des gestes concrets, adaptés à votre peau, votre mode de vie et vos habitudes. Pas un copier-coller d’article de blog.',
    color: 'bg-green-50 text-green-500'
  },
  {
    icon: ShoppingBag,
    title: 'Les bons ingrédients, pas les plus chers',
    description: 'On vous dit exactement quels actifs rechercher et pourquoi — sans vous pousser vers une marque en particulier.',
    color: 'bg-orange-50 text-orange-500'
  },
  {
    icon: Zap,
    title: 'Moins d’une minute, top chrono',
    description: 'Une photo suffit. Votre analyse complète est prête avant que vous ayez fini votre café.',
    color: 'bg-purple-50 text-purple-500'
  }
]
</script>

<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">
          Tout ce dont votre peau a <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">besoin</span>, au <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">même endroit</span>.
        </h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Diagnostic, routine personnalisée, ingrédients adaptés. Structuré et actionnable.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(benefit, i) in benefits"
          :key="i"
          class="group text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5', benefit.color]">
            <component :is="benefit.icon" class="w-7 h-7" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ benefit.title }}</h3>
          <p class="text-sm text-gray-600 leading-relaxed">{{ benefit.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
