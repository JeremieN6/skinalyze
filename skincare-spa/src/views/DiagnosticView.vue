<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { analyzeSkin } from '@/services/skinApi'
import { RouterLink } from 'vue-router'
import { RefreshCw, AlertTriangle, Shield } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import UploadZone from '@/components/diagnostic/UploadZone.vue'
import LoadingAnalysis from '@/components/diagnostic/LoadingAnalysis.vue'
import FollowUpQuestions from '@/components/diagnostic/FollowUpQuestions.vue'
import ResultDiagnostic from '@/components/diagnostic/ResultDiagnostic.vue'
import ResultLifestyle from '@/components/diagnostic/ResultLifestyle.vue'
import ResultProducts from '@/components/diagnostic/ResultProducts.vue'
import PremiumModal from '@/components/diagnostic/PremiumModal.vue'

const authStore = useAuthStore()

// State
const step = ref('upload') // upload | loading | followup | results
const result = ref(null)
const error = ref('')
const imageFiles = ref([])
const showPremiumModal = ref(false)

const showDisclaimer = computed(() => step.value === 'upload' || step.value === 'results')

async function handleAnalyze(files) {
  // Check freemium limit
  if (!authStore.canDiagnose) {
    showPremiumModal.value = true
    return
  }

  imageFiles.value = files
  error.value = ''
  step.value = 'loading'

  try {
    const response = await analyzeSkin(files)

    if (response.needs_more_info) {
      result.value = response
      step.value = 'followup'
    } else {
      result.value = response
      step.value = 'results'
      authStore.incrementDiagCount()
    }
  } catch (err) {
    console.error('Erreur analyse:', err)
    error.value = err.message || 'Une erreur est survenue lors de l\'analyse. Veuillez réessayer.'
    step.value = 'upload'
  }
}

async function handleFollowUp(answers) {
  step.value = 'loading'
  error.value = ''

  try {
    const response = await analyzeSkin(imageFiles.value, answers)
    result.value = response
    step.value = 'results'
    authStore.incrementDiagCount()
  } catch (err) {
    console.error('Erreur follow-up:', err)
    error.value = err.message || 'Une erreur est survenue. Veuillez réessayer.'
    step.value = 'upload'
  }
}

function resetDiagnostic() {
  step.value = 'upload'
  result.value = null
  error.value = ''
  imageFiles.value = []
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">
          Analyser <span class="text-primary-500">ma peau</span>
        </h1>
        <p class="mt-3 text-gray-600 max-w-xl mx-auto">
          Une photo suffit. Vous repartez avec un diagnostic, 
          une routine et les produits qu'il vous faut, ce dont vous avez vraiment besoin.
        </p>

        <!-- Free diagnostics counter -->
        <div v-if="!authStore.isPremium" class="mt-4 inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-medium px-4 py-2 rounded-full">
          <Shield class="w-4 h-4" />
          {{ authStore.remainingFree }} diagnostic{{ authStore.remainingFree > 1 ? 's' : '' }} gratuit{{ authStore.remainingFree > 1 ? 's' : '' }} restant{{ authStore.remainingFree > 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
        <AlertTriangle class="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-medium">Erreur</p>
          <p class="text-sm mt-1">{{ error }}</p>
          <Button variant="outline" size="sm" class="mt-3" @click="error = ''">
            Fermer
          </Button>
        </div>
      </div>

      <!-- Step: Upload -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <UploadZone v-if="step === 'upload'" @analyze="handleAnalyze" />
      </Transition>

      <!-- Step: Loading -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
      >
        <LoadingAnalysis v-if="step === 'loading'" />
      </Transition>

      <!-- Step: Follow-up -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <FollowUpQuestions
          v-if="step === 'followup' && result"
          :questions="result.follow_up_questions"
          @submit="handleFollowUp"
        />
      </Transition>

      <!-- Step: Results -->
      <Transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="step === 'results' && result" class="space-y-6">
          <ResultDiagnostic :diagnostic="result.diagnostic" />
          <ResultLifestyle :conseils="result.conseils_vie" />
          <ResultProducts :produits="result.produits" />

          <!-- Disclaimer in results -->
          <div class="bg-gray-100 rounded-xl p-4 flex items-start gap-3">
            <Shield class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p class="text-xs text-gray-500 leading-relaxed">
              {{ result.disclaimer }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button @click="resetDiagnostic" class="gap-2">
              <RefreshCw class="w-4 h-4" />
              Faire une nouvelle analyse
            </Button>
            <RouterLink v-if="!authStore.user" to="/">
              <Button variant="outline">Créer un compte pour sauvegarder</Button>
            </RouterLink>
          </div>
        </div>
      </Transition>

      <!-- Disclaimer -->
      <div v-if="showDisclaimer" class="mt-12 text-center">
        <div class="inline-flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 max-w-2xl text-left">
          <AlertTriangle class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p class="text-xs text-amber-700 leading-relaxed">
              <strong>Note importante :</strong> SkinGlow est un outil d’aide à la compréhension de votre peau.
              Ces résultats sont fournis à titre informatif et ne constituent pas un avis médical.
              En cas de problème dermatologique persistant ou sévère, consultez un professionnel de santé.
          </p>
        </div>
      </div>
    </div>

    <!-- Premium Modal -->
    <PremiumModal v-if="showPremiumModal" @close="showPremiumModal = false" />
  </div>
</template>
