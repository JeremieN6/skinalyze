<script setup>
import { X, Crown, Check, Sparkles } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

const emit = defineEmits(['close'])

const features = [
  'Diagnostics illimités',
  'Historique de vos analyses',
  'Suivi de l’évolution de votre peau',
  'Questions de suivi approfondies',
  'Accès prioritaire aux nouvelles fonctionnalités'
]
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')"></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in">
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Fermer"
        >
          <X class="w-5 h-5 text-gray-400" />
        </button>

        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown class="w-8 h-8 text-primary-500" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Passez à l’Essentiel</h3>
          <p class="text-gray-600 mt-2">
            Vous avez utilisé vos 3 diagnostics gratuits ce mois-ci.
            Passez à l’Essentiel pour un accès illimité.
          </p>
        </div>

        <div class="bg-primary-50 rounded-xl p-6 mb-6">
          <div class="text-center mb-4">
            <span class="text-3xl font-extrabold text-gray-900">9,90€</span>
            <span class="text-gray-500 text-sm">/mois</span>
          </div>

          <ul class="space-y-3">
            <li
              v-for="(feature, i) in features"
              :key="i"
              class="flex items-center gap-3"
            >
              <div class="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Check class="w-3 h-3 text-primary-700" />
              </div>
              <span class="text-sm text-gray-700">{{ feature }}</span>
            </li>
          </ul>
        </div>

        <Button size="lg" class="w-full gap-2">
          <Sparkles class="w-4 h-4" />
          Passer à l’Essentiel
        </Button>

        <p class="text-xs text-gray-400 text-center mt-3">
          Sans engagement • Annulable à tout moment
        </p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.animate-in {
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
