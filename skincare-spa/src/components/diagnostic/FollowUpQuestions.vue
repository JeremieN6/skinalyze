<script setup>
import { ref } from 'vue'
import { MessageCircle, Send } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

const props = defineProps({
  questions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['submit'])

const answers = ref(props.questions.map(() => ''))

function submitAnswers() {
  const formattedAnswers = props.questions
    .map((q, i) => `Q: ${q}\nR: ${answers.value[i]}`)
    .join('\n\n')
  emit('submit', formattedAnswers)
}

const allAnswered = () => answers.value.every((a) => a.trim().length > 0)
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-primary-50 rounded-2xl p-6 sm:p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <MessageCircle class="w-5 h-5 text-primary-500" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900">Questions complémentaires</h3>
          <p class="text-sm text-gray-600">Pour affiner votre diagnostic, quelques questions complémentaires.</p>
        </div>
      </div>

      <div class="space-y-5">
        <div
          v-for="(question, i) in questions"
          :key="i"
          class="bg-white rounded-xl p-4"
        >
          <label :for="`question-${i}`" class="block text-sm font-medium text-gray-800 mb-2">
            {{ i + 1 }}. {{ question }}
          </label>
          <textarea
            :id="`question-${i}`"
            v-model="answers[i]"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-colors"
            placeholder="Votre réponse..."
          ></textarea>
        </div>
      </div>

      <Button
        size="lg"
        class="w-full mt-6 gap-2"
        :disabled="!allAnswered()"
        @click="submitAnswers"
      >
        <Send class="w-4 h-4" />
        Obtenir mon diagnostic complet
      </Button>
    </div>
  </div>
</template>
