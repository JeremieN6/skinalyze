import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isPremium: false,
    diagCount: parseInt(localStorage.getItem('skinglow_diag_count') || '0')
  }),
  getters: {
    canDiagnose: (state) => state.isPremium || state.diagCount < 3,
    remainingFree: (state) => Math.max(0, 3 - state.diagCount)
  },
  actions: {
    incrementDiagCount() {
      this.diagCount++
      localStorage.setItem('skinglow_diag_count', this.diagCount.toString())
    }
  }
})
