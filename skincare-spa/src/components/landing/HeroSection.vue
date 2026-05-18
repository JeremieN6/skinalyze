<script setup>
import { RouterLink } from 'vue-router'
import { Sparkles, ArrowRight, Shield } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-skinbeige-50">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-30 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-skinbeige-100 rounded-full opacity-40 blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-12">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Text content -->
        <div class="text-center lg:text-left">
          <div class="inline-flex items-center gap-2 bg-primary-50 text-primary-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Sparkles class="w-4 h-4" />
            <span>Diagnostic gratuit • Sans inscription</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight text-balance">
            Enfin comprendre
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">votre peau.</span>
            Vraiment.
          </h1>

          <p class="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Uploadez une photo, obtenez un diagnostic personnalisé, une routine sur-mesure
            et les produits qu'il vous faut vraiment. En moins d'une minute.
          </p>

          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <RouterLink to="/diagnostic">
              <Button size="lg" class="w-full sm:w-auto text-base gap-2">
                Analyser ma peau gratuitement
                <ArrowRight class="w-5 h-5" />
              </Button>
            </RouterLink>
            <a href="#comment-ca-marche">
              <Button variant="outline" size="lg" class="w-full sm:w-auto text-base">
                Comment ça marche ?
              </Button>
            </a>
          </div>

          <div class="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-500">
            <div class="flex items-center gap-1.5">
              <Shield class="w-4 h-4 text-green-500" />
              <span>100% confidentiel</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Sparkles class="w-4 h-4 text-primary-500" />
              <span>3 analyses gratuites</span>
            </div>
          </div>
        </div>

        <!-- Visual -->
        <div class="relative flex justify-center lg:justify-end">
          <div class="relative w-72 h-72 sm:w-96 sm:h-96">
            <!-- Glowing background -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl rotate-6 opacity-20 blur-xl"></div>

            <!-- Main card -->
            <div class="relative bg-white rounded-3xl shadow-2xl p-8 h-full flex flex-col items-center justify-center">
              <div class="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles class="w-10 h-10 text-primary-500" />
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Votre diagnostic</h3>
              <p class="text-sm text-gray-500 text-center">Diagnostic, routine et produits. En moins d'une minute.</p>

              <!-- Floating badges -->
              <div class="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Gratuit
              </div>
              <div class="absolute -bottom-3 -left-3 bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Disponible maintenant
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
