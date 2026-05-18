<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu, X, Sparkles } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

const isMenuOpen = ref(false)
const route = useRoute()

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'Analyser ma peau', path: '/diagnostic' },
  { name: 'Tarifs', path: '/#tarifs' },
  { name: 'Blog', path: '/blog' }
]

function isActive(link) {
  if (link.path.includes('#')) return false
  return route.path === link.path
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <div class="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
            <Sparkles class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold text-gray-900">Skin<span class="text-primary-500">Glow</span></span>
        </RouterLink>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors"
            :class="{ 'text-primary-500': isActive(link) }"
          >
            {{ link.name }}
          </RouterLink>
        </div>

        <!-- CTA -->
        <div class="hidden md:flex items-center gap-3">
          <RouterLink to="/diagnostic">
            <Button size="sm">Analyser ma peau</Button>
          </RouterLink>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          :aria-label="isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        >
          <X v-if="isMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Mobile Nav -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isMenuOpen" class="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
          <div class="flex flex-col gap-2">
            <RouterLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary-500 transition-colors"
              :class="{ 'bg-primary-50 text-primary-500': isActive(link) }"
              @click="isMenuOpen = false"
            >
              {{ link.name }}
            </RouterLink>
            <RouterLink to="/diagnostic" @click="isMenuOpen = false">
              <Button class="w-full mt-2" size="sm">Analyser ma peau</Button>
            </RouterLink>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>
