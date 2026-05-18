<script setup>
import { RouterLink } from 'vue-router'
import { Sparkles, Heart } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo & Description -->
        <div class="md:col-span-2">
          <RouterLink to="/" class="flex items-center gap-2 mb-4">
            <div class="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <Sparkles class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-white">Skin<span class="text-primary-400">Glow</span></span>
          </RouterLink>
          <p class="text-sm text-gray-400 max-w-md leading-relaxed">
            SkinGlow — Prenez soin de votre peau avec intention.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h3>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/" class="text-sm text-gray-400 hover:text-white transition-colors">Accueil</RouterLink>
            </li>
            <li>
              <RouterLink to="/diagnostic" class="text-sm text-gray-400 hover:text-white transition-colors">Diagnostic</RouterLink>
            </li>
            <li>
              <RouterLink to="/blog" class="text-sm text-gray-400 hover:text-white transition-colors">Blog</RouterLink>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Informations</h3>
          <ul class="space-y-2">
            <li>
              <span class="text-sm text-gray-400">Confidentialité</span>
            </li>
            <li>
              <span class="text-sm text-gray-400">CGU</span>
            </li>
            <li>
              <span class="text-sm text-gray-400">Contact</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Disclaimer médical -->
      <div class="mt-8 pt-8 border-t border-gray-800">
        <div class="bg-gray-800/50 rounded-lg p-4 mb-6">
          <p class="text-xs text-gray-400 leading-relaxed">
            <strong class="text-gray-300">⚕️ Avertissement médical :</strong> SkinGlow ne fournit pas de conseils médicaux. Les diagnostics générés
            sont à titre informatif uniquement. Consultez un dermatologue pour tout problème de peau persistant.
          </p>
        </div>

        <!-- RGPD -->
        <div class="bg-gray-800/50 rounded-lg p-4 mb-6">
          <p class="text-xs text-gray-400 leading-relaxed">
            <strong class="text-gray-300">🔒 Protection des données :</strong> Conformément au RGPD, vos photos ne
            sont jamais stockées sur nos serveurs. Elles sont analysées en temps réel via une API sécurisée puis
            immédiatement supprimées. Aucune donnée personnelle n'est conservée sans votre consentement explicite.
          </p>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-gray-500">
          © {{ new Date().getFullYear() }} SkinGlow. Tous droits réservés.
        </p>
        <p class="text-xs text-gray-500 flex items-center gap-1">
          Fait avec <Heart class="w-3 h-3 text-red-400" /> et de la passion
        </p>
      </div>
    </div>
  </footer>
</template>
