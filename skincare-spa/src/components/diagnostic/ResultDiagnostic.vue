<script setup>
import { Microscope, AlertTriangle, ChevronRight } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'

defineProps({
  diagnostic: {
    type: Object,
    required: true
  }
})

const severityConfig = {
  'léger': { variant: 'success', label: 'Léger', icon: '🟢' },
  'modéré': { variant: 'warning', label: 'Modéré', icon: '🟡' },
  'sévère': { variant: 'destructive', label: 'Sévère', icon: '🔴' }
}

function getSeverity(sev) {
  return severityConfig[sev] || severityConfig['modéré']
}
</script>

<template>
  <div class="bg-blue-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
        <Microscope class="w-5 h-5 text-blue-600" />
      </div>
      <h3 class="text-xl font-bold text-gray-900">Ce qu’on observe sur votre peau</h3>
    </div>

    <!-- Résumé -->
    <div class="bg-white/70 rounded-xl p-4 mb-6">
      <p class="text-sm text-gray-700 leading-relaxed">{{ diagnostic.resume }}</p>
    </div>

    <!-- Problèmes -->
    <div class="space-y-4">
      <div
        v-for="(probleme, i) in diagnostic.problemes"
        :key="i"
        class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-center gap-2">
            <ChevronRight class="w-4 h-4 text-blue-500 flex-shrink-0" />
            <h4 class="text-base font-semibold text-gray-900">{{ probleme.nom }}</h4>
          </div>
          <Badge :variant="getSeverity(probleme.severite).variant">
            {{ getSeverity(probleme.severite).icon }} {{ getSeverity(probleme.severite).label }}
          </Badge>
        </div>

        <div class="ml-6">
          <p class="text-xs text-gray-500 mb-2">
            <span class="font-medium">Zones :</span> {{ probleme.zones }}
          </p>
          <p class="text-sm text-gray-600 leading-relaxed">{{ probleme.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
