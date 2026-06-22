import { defineStore } from 'pinia'

import { resolveImageUrl } from '@/util/image'

const STORAGE_KEY = 'guest'

export const useGuestStore = defineStore('guest', {
  state: () => ({
    guest: null,
  }),
  getters: {
    isLoggedIn: state => Boolean(state.guest?.id),
    name: state => state.guest?.name || 'Guest',
    email: state => state.guest?.email || 'Not signed in',
    imageUrl: state => {
      return resolveImageUrl(state.guest?.image)
    },
  },
  actions: {
    hydrate() {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        this.guest = raw ? JSON.parse(raw) : null
      } catch {
        this.guest = null
      }
    },
    setGuest(guest) {
      this.guest = guest || null
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.guest))
    },
    clear() {
      this.guest = null
      sessionStorage.removeItem(STORAGE_KEY)
    },
  },
})
