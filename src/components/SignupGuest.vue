<template>
  <div class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
    <div class="text-sm font-semibold">Create Guest Account</div>
    <p class="mt-2 text-sm text-white/65">Create an account with your email. No password is required in this demo
      backend.</p>

    <form class="mt-6 grid gap-4" @submit.prevent="submit">
      <label class="grid gap-1">
        <span class="text-xs text-white/60">Full name</span>
        <input v-model.trim="form.name"
          class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
      </label>

      <label class="grid gap-1">
        <span class="text-xs text-white/60">Email</span>
        <input v-model.trim="form.email" type="email"
          class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
      </label>

      <label class="grid gap-1">
        <span class="text-xs text-white/60">Phone (optional)</span>
        <input v-model.trim="form.phone"
          class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
      </label>

      <label class="grid gap-2">
        <span class="text-xs text-white/60">Profile image (optional)</span>
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-12 md:w-13 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
            <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="h-full w-full object-cover" />
            <span v-else class="material-symbols-outlined text-white/50">person</span>
          </div>
          <input type="file" accept="image/*"
            class="block w-full text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/15"
            @change="onFileChange" />
        </div>
      </label>

      <button type="submit" :disabled="loading"
        class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)] disabled:cursor-not-allowed disabled:opacity-70">
        {{ loading ? 'Creating...' : 'Create Account' }}
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

      <RouterLink to="/login" class="text-center text-sm text-white/70 underline hover:text-white">
        Already have an account? Sign in
      </RouterLink>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

import apiClient from '@/util/client'
import { useGuestStore } from '@/stores/guest'

const router = useRouter()
const toast = getCurrentInstance()?.appContext.config.globalProperties.$toast
const guestStore = useGuestStore()

const loading = ref(false)
const imageFile = ref(null)
const previewUrl = ref('')
const form = reactive({
  name: '',
  email: '',
  phone: '',
})

const onFileChange = e => {
  const file = e?.target?.files?.[0] || null
  imageFile.value = file
  previewUrl.value = file ? URL.createObjectURL(file) : ''
}

const submit = async () => {
  if (!form.name || !form.email) {
    toast?.warning('Please enter your name and email.')
    return
  }

  loading.value = true
  try {
    const data = new FormData()
    data.append('name', form.name)
    data.append('email', form.email)
    if (form.phone) data.append('phone', form.phone)
    if (imageFile.value) data.append('image', imageFile.value)

    const res = await apiClient.post('/public/guests', data)

    const guest = res?.guest
    if (!guest?.id) {
      toast?.error('Sign up failed.')
      return
    }

    guestStore.setGuest(guest)
    toast?.success('Account created and signed in.')

    // Check if there's a pending booking roomId
    const pendingRoomId = sessionStorage.getItem('pendingBookingRoomId')
    if (pendingRoomId) {
      sessionStorage.removeItem('pendingBookingRoomId')
      router.push({ path: '/booking', query: { roomId: pendingRoomId } })
    } else {
      router.push('/')
    }
  } catch (e) {
    const msg = e?.response?.data?.message || 'Sign up failed.'
    toast?.error(msg)
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = () => {
  window.location.href = import.meta.env.VITE_GOOGLE
}
</script>