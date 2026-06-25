<template>
  <div class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
    <div class="text-sm font-semibold">Guest Login</div>
    <p class="mt-2 text-sm text-white/65">Enter your email and password to view bookings and continue faster.</p>

    <form class="mt-6 grid gap-4" @submit.prevent="submit">
      <label class="grid gap-1">
        <span class="text-xs text-white/60">Email</span>
        <input
          v-model.trim="email"
          type="email"
          class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25"
        />
      </label>

      <label class="grid gap-1">
        <span class="text-xs text-white/60">Password</span>
        <input
          v-model.trim="password"
          type="password"
          class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25"
        />
      </label>

      <button
        type="submit"
        :disabled="loading"
        class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>

      <div class="relative my-2">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-white/10"></div>
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="bg-[color:rgba(17,33,23,0.6)] px-2 text-white/50">or continue with</span>
        </div>
      </div>

      <button
        type="button"
        @click="handleGoogleLogin"
        class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <RouterLink to="/signup" class="text-center text-sm text-white/70 underline hover:text-white">
        Don't have an account? Create one
      </RouterLink>
    </form>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

import apiClient from '@/util/client'
import { useGuestStore } from '@/stores/guest'

const router = useRouter()
const toast = getCurrentInstance()?.appContext.config.globalProperties.$toast
const guestStore = useGuestStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const submit = async () => {
  if (!email.value || !password.value) {
    toast?.warning('Please enter your email and password.')
    return
  }

  loading.value = true
  try {
    const res = await apiClient.post('/public/guests/login', { email: email.value, password: password.value })
    const guest = res?.guest
    if (!guest?.id) {
      toast?.error('Login failed.')
      return
    }
    guestStore.setGuest(guest)
    toast?.success('Signed in successfully.')

    const pendingRoomId = sessionStorage.getItem('pendingBookingRoomId')
    const pendingBooking = sessionStorage.getItem('pendingBooking')
    const pendingBookingQueryStr = sessionStorage.getItem('pendingBookingQuery')

    if (pendingRoomId) {
      sessionStorage.removeItem('pendingBookingRoomId')
      router.push({ path: '/booking', query: { roomId: pendingRoomId } })
    } else if (pendingBooking) {
      sessionStorage.removeItem('pendingBooking')
      let query = {}
      if (pendingBookingQueryStr) {
        try {
          query = JSON.parse(pendingBookingQueryStr)
        } catch (e) {}
        sessionStorage.removeItem('pendingBookingQuery')
      }
      router.push({ path: '/booking', query })
    } else {
      router.push('/')
    }
  } catch (e) {
    const msg = e?.response?.data?.message || 'Login failed.'
    toast?.error(msg)
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = () => {
  window.location.href = import.meta.env.VITE_GOOGLE
}
</script>
