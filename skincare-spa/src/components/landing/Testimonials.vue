<script setup>
import { Star } from 'lucide-vue-next'

const testimonials = [
  {
    name: 'Karim, 28 ans',
    role: 'Utilisateur depuis 3 mois',
    rating: 5,
    text: "J'avais essayé des dizaines de produits sans résultat. En deux minutes, SkinGlow m'a expliqué que j'avais des poils incarnés et pas de l'acné. Le diagnostic a tout changé.",
    avatar: 'K'
  },
  {
    name: 'Lucie, 34 ans',
    role: 'Utilisatrice Premium',
    rating: 5,
    text: "Le truc que j'ai adoré c'est qu'on m'a pas juste dit 'hydratez-vous'. J'ai eu des conseils précis sur les ingrédients à chercher selon MON type de peau. C'est ça la vraie valeur.",
    avatar: 'L'
  },
  {
    name: 'Thomas, 24 ans',
    role: 'Utilisateur depuis 1 mois',
    rating: 5,
    text: 'Honnêtenement je pensais que cétait du flan. Résultat : en 3 semaines avec les conseils SkinGlow, mes rougeurs ont clairement diminué. Je recommande.',
    avatar: 'T'
  },
  {
    name: 'Amina, 31 ans',
    role: 'Utilisatrice Premium',
    rating: 5,
    text: "Ce qui m'a convaincue c'est la section produits. Pas de marque sponsorisée, juste les ingrédients actifs et pourquoi ils aident. Enfin un outil transparent.",
    avatar: 'A'
  }
]
</script>

<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">
          Ils ont <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">enfin compris</span> leur peau.
        </h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Ce qu’ils ont trouvé, grâce à une seule analyse.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(testimonial, i) in testimonials"
          :key="i"
          class="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300"
        >
          <!-- Avatar & Info -->
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
              {{ testimonial.avatar }}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ testimonial.name }}</p>
              <p class="text-xs text-gray-500">{{ testimonial.role }}</p>
            </div>
          </div>

          <!-- Stars -->
          <div class="flex gap-0.5 mb-3">
            <Star
              v-for="s in 5"
              :key="s"
              class="w-4 h-4"
              :class="s <= testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
            />
          </div>

          <!-- Text -->
          <p class="text-sm text-gray-600 leading-relaxed">{{ testimonial.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
