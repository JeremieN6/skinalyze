<script setup>
import { Check, Sparkles } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { RouterLink } from 'vue-router'

const plans = [
  {
    name: 'Découverte',
    price: 'Gratuit',
    period: '',
    description: 'Pour tester et voir par vous-même.',
    features: [
      '3 diagnostics par mois',
      'Diagnostic complet (problèmes + routine + produits)',
      'Accès au blog & guides'
    ],
    cta: 'Essayer gratuitement',
    popular: false,
    route: '/diagnostic'
  },
  {
    name: 'Essentiel',
    price: '9,90€',
    period: '/mois',
    description: 'Pour ceux qui prennent vraiment soin de leur peau.',
    features: [
      'Diagnostics illimités',
      'Historique de vos analyses',
      'Suivi de l’évolution de votre peau',
      'Questions de suivi approfondies',
      'Accès prioritaire aux nouvelles fonctionnalités'
    ],
    cta: 'Passer à l’Essentiel',
    popular: true,
    route: '/diagnostic'
  }
]
</script>

<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="tarifs">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">
          Commencez gratuitement.
        </h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Pas besoin de carte bancaire pour découvrir ce que SkinGlow a à vous dire sur votre peau.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div
          v-for="(plan, i) in plans"
          :key="i"
          :class="[
            'relative rounded-2xl p-8 transition-all duration-300',
            plan.popular
              ? 'bg-white shadow-xl ring-2 ring-primary-500 scale-[1.02]'
              : 'bg-white shadow-md hover:shadow-lg'
          ]"
        >
          <!-- Popular badge -->
          <div
            v-if="plan.popular"
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1"
          >
            <Sparkles class="w-3 h-3" />
            Le plus populaire
          </div>

          <h3 class="text-xl font-bold text-gray-900">{{ plan.name }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ plan.description }}</p>

          <div class="mt-6 mb-8">
            <span class="text-4xl font-extrabold text-gray-900">{{ plan.price }}</span>
            <span v-if="plan.period" class="text-gray-500 text-sm">{{ plan.period }}</span>
          </div>

          <ul class="space-y-3 mb-8">
            <li
              v-for="(feature, fi) in plan.features"
              :key="fi"
              class="flex items-center gap-3"
            >
              <div :class="['w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0', plan.popular ? 'bg-primary-100 text-primary-500' : 'bg-green-100 text-green-500']">
                <Check class="w-3 h-3" />
              </div>
              <span class="text-sm text-gray-700">{{ feature }}</span>
            </li>
          </ul>

          <RouterLink :to="plan.route">
            <Button
              :variant="plan.popular ? 'default' : 'outline'"
              class="w-full"
              size="lg"
            >
              {{ plan.cta }}
            </Button>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
