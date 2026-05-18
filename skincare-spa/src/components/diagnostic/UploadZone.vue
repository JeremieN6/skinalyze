<script setup>
import { ref, computed } from 'vue'
import { Upload, X, ImagePlus, AlertCircle } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

const emit = defineEmits(['analyze'])

const files = ref([])
const isDragging = ref(false)
const error = ref('')

const MAX_FILES = 3
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const previews = computed(() =>
  files.value.map((file) => ({
    file,
    url: URL.createObjectURL(file),
    name: file.name,
    size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
  }))
)

const canAnalyze = computed(() => files.value.length > 0 && files.value.length <= MAX_FILES)

function validateFile(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    error.value = `Format non supporté : ${file.name}. Utilisez JPG, PNG ou WEBP.`
    return false
  }
  if (file.size > 20 * 1024 * 1024) {
    error.value = `Fichier trop volumineux : ${file.name}. Taille max : 20 MB.`
    return false
  }
  return true
}

function addFiles(newFiles) {
  error.value = ''
  const remaining = MAX_FILES - files.value.length

  for (let i = 0; i < Math.min(newFiles.length, remaining); i++) {
    if (validateFile(newFiles[i])) {
      files.value.push(newFiles[i])
    }
  }

  if (files.value.length >= MAX_FILES && newFiles.length > remaining) {
    error.value = `Maximum ${MAX_FILES} photos autorisées.`
  }
}

function onDrop(e) {
  isDragging.value = false
  const droppedFiles = Array.from(e.dataTransfer.files)
  addFiles(droppedFiles)
}

function onFileInput(e) {
  const selectedFiles = Array.from(e.target.files)
  addFiles(selectedFiles)
  e.target.value = ''
}

function removeFile(index) {
  URL.revokeObjectURL(previews.value[index].url)
  files.value.splice(index, 1)
  error.value = ''
}

function startAnalysis() {
  if (canAnalyze.value) {
    emit('analyze', [...files.value])
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Dropzone -->
    <div
      @drop.prevent="onDrop"
      @dragover.prevent="isDragging = true"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      :class="[
        'relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer',
        isDragging
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
      ]"
      @click="$refs.fileInput.click()"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        class="hidden"
        @change="onFileInput"
      />

      <div class="flex flex-col items-center gap-4">
        <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center transition-colors', isDragging ? 'bg-primary-100' : 'bg-gray-100']">
          <Upload :class="['w-8 h-8', isDragging ? 'text-primary-500' : 'text-gray-400']" />
        </div>

        <div>
          <p class="text-base font-medium text-gray-700">
            <span v-if="isDragging">Déposez vos photos ici</span>
            <span v-else>Glissez vos photos ici ou cliquez pour parcourir</span>
          </p>
          <p class="text-sm text-gray-500 mt-1">JPG, PNG ou WEBP • 1 à 3 photos • Max 20 MB chacune</p>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
      <AlertCircle class="w-5 h-5 flex-shrink-0" />
      <p class="text-sm">{{ error }}</p>
    </div>

    <!-- Previews -->
    <div v-if="previews.length > 0" class="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div
        v-for="(preview, i) in previews"
        :key="i"
        class="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm"
      >
        <img
          :src="preview.url"
          :alt="`Photo ${i + 1} pour analyse`"
          class="w-full h-32 sm:h-40 object-cover"
        />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            @click.stop="removeFile(i)"
            class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
            :aria-label="`Supprimer la photo ${i + 1}`"
          >
            <X class="w-4 h-4 text-red-500" />
          </button>
        </div>
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <p class="text-xs text-white truncate">{{ preview.name }}</p>
          <p class="text-xs text-gray-300">{{ preview.size }}</p>
        </div>
      </div>

      <!-- Add more button -->
      <div
        v-if="files.length < MAX_FILES"
        @click="$refs.fileInput.click()"
        class="border-2 border-dashed border-gray-300 rounded-xl h-32 sm:h-40 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-gray-50 transition-all"
      >
        <ImagePlus class="w-6 h-6 text-gray-400 mb-1" />
        <p class="text-xs text-gray-500">Ajouter</p>
      </div>
    </div>

    <!-- Analyze button -->
    <div class="mt-8 flex flex-col items-center gap-3">
      <Button
        size="lg"
        :disabled="!canAnalyze"
        class="w-full sm:w-auto px-12"
        @click="startAnalysis"
      >
        🔬 Analyser ma peau
      </Button>
      <p class="text-xs text-gray-500">
        {{ files.length }}/{{ MAX_FILES }} photo{{ files.length > 1 ? 's' : '' }} sélectionnée{{ files.length > 1 ? 's' : '' }}
      </p>
    </div>
  </div>
</template>
