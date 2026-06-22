<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <div class="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
      <p class="text-white">Signing you in...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGuestStore } from '@/stores/guest'

const router = useRouter()
const route = useRoute()
const guestStore = useGuestStore()

onMounted(() => {
  const guestId = route.query.guest_id
  const name = route.query.name
  const email = route.query.email
  const image = route.query.image

  if (guestId && name && email) {
    const guest = {
      id: parseInt(guestId),
      name: decodeURIComponent(name),
      email: decodeURIComponent(email),
      image: image ? decodeURIComponent(image) : null,
    }
    guestStore.setGuest(guest)

    // Check if there's a pending booking roomId
    const pendingRoomId = sessionStorage.getItem('pendingBookingRoomId')
    if (pendingRoomId) {
      sessionStorage.removeItem('pendingBookingRoomId')
      router.push({ path: '/booking', query: { roomId: pendingRoomId } })
    } else {
      router.push('/')
    }
  } else {
    router.push('/login?error=google_auth_failed')
  }
})
</script>
