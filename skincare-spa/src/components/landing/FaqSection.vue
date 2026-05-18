<script setup>
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const faqs = [
  {
    question: 'Est-ce que SkinGlow remplace un dermatologue ?',
    answer: 'Non, et on ne prétend pas le contraire. SkinGlow vous aide à mieux comprendre votre peau pour poser les bons gestes au quotidien. Si vous avez un problème sérieux ou persistant, consultez toujours un dermatologue.'
  },
  {
    question: 'Comment fonctionne l’analyse ?',
    answer: 'Vos photos sont analysées par un système expert entraîné à identifier les affections cutanées courantes. Le résultat combine un regard dermatologique, des recommandations cosmétologiques et des conseils de routine adaptés à ce qu’on observe.'
  },
  {
    question: 'Mes photos sont-elles stockées quelque part ?',
    answer: 'Non. Vos photos sont transmises pour analyse puis immédiatement supprimées. Elles ne sont jamais stockées sur nos serveurs ni utilisées à d’autres fins.'
  },
  {
    question: 'Ça marche pour tous les types de peau ?',
    answer: 'Oui. SkinGlow est conçu pour fonctionner sur tous les phototypes et types de peau — peaux claires, métissées, foncées, grasses, sèches, mixtes.'
  },
  {
    question: 'Que se passe-t-il si la photo n’est pas assez nette ?',
    answer: 'Si l’analyse n’est pas possible avec les photos fournies, on vous pose quelques questions complémentaires pour affiner le diagnostic sans photo supplémentaire.'
  },
  {
    question: 'Puis-je annuler mon abonnement à tout moment ?',
    answer: 'Oui, sans engagement, sans frais de résiliation, sans prise de tête.'
  }
]

const openIndex = ref(null)

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="py-20 bg-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">
          On répond à vos questions.
        </h2>
        <p class="mt-4 text-lg text-gray-600">
          Tout ce que vous voulez savoir avant de commencer.
        </p>
      </div>

      <div class="space-y-3">
        <div
          v-for="(faq, i) in faqs"
          :key="i"
          class="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200"
          :class="openIndex === i ? 'shadow-md' : ''"
        >
          <button
            @click="toggle(i)"
            class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span class="text-sm font-medium text-gray-900 pr-4">{{ faq.question }}</span>
            <ChevronDown
              class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200"
              :class="openIndex === i ? 'rotate-180' : ''"
            />
          </button>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-96"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 max-h-96"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="openIndex === i" class="px-6 pb-4">
              <p class="text-sm text-gray-600 leading-relaxed">{{ faq.answer }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>
