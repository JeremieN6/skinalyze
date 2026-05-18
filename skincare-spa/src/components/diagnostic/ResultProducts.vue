<script setup>
import { ShoppingBag, Sun, Moon, Clock } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'

defineProps({
  produits: {
    type: Array,
    required: true
  }
})

const momentConfig = {
  'matin': { icon: Sun, label: 'Matin', color: 'bg-yellow-100 text-yellow-600' },
  'soir': { icon: Moon, label: 'Soir', color: 'bg-indigo-100 text-indigo-600' },
  'matin et soir': { icon: Clock, label: 'Matin & Soir', color: 'bg-blue-100 text-blue-600' },
  '2x par semaine': { icon: Clock, label: '2x/semaine', color: 'bg-purple-100 text-purple-600' }
}

function getMoment(moment) {
  return momentConfig[moment] || momentConfig['matin et soir']
}
</script>

<template>
  <div class="bg-orange-50 rounded-2xl p-6 sm:p-8 border border-orange-100">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
        <ShoppingBag class="w-5 h-5 text-orange-600" />
      </div>
      <h3 class="text-xl font-bold text-gray-900">Les produits qu’il vous faut</h3>
    </div>

    <div class="grid sm:grid-cols-2 gap-4">
      <div
        v-for="(produit, i) in produits"
        :key="i"
        class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between gap-2 mb-3">
          <h4 class="text-base font-semibold text-gray-900">{{ produit.type }}</h4>
          <div :class="['flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', getMoment(produit.moment).color]">
            <component :is="getMoment(produit.moment).icon" class="w-3 h-3" />
            {{ getMoment(produit.moment).label }}
          </div>
        </div>

        <div class="mb-3">
          <Badge variant="warning" class="text-xs">
            {{ produit.ingredient_cle }}
          </Badge>
        </div>

        <p class="text-sm text-gray-600 leading-relaxed">{{ produit.pourquoi }}</p>
      </div>
    </div>
  </div>
</template>
