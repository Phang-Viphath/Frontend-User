<template>
  <div>
    <section class="relative overflow-hidden">
      <div class="absolute inset-0">
        <div
          class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=80')] bg-cover bg-center" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[var(--color-background-dark)]" />
      </div>

      <div class="relative mx-auto max-w-7xl px-4 pb-13 pt-14 sm:px-6 lg:px-8">
        <div class="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div class="lg:col-span-7">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span class="material-symbols-outlined text-[16px]">hotel</span>
              Premium stays in the heart of Battambang
            </div>

            <h1 class="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Battambang Hotel
            </h1>
            <p class="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              A calm, modern resort vibe designed for tourists, business travelers, couples, and families.
              Wake up to warm light, refined comfort, and service that feels effortless.
            </p>

            <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button @click="handleBookNow"
                class="inline-flex items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] px-5 py-3 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)] cursor-pointer">
                Book Now
              </button>
              <RouterLink to="/rooms"
                class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10">
                View Rooms
              </RouterLink>
            </div>

            <div class="mt-10 grid gap-4 sm:grid-cols-3">
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="text-xs text-white/60">Location</div>
                <div class="mt-1 text-sm font-semibold">Near Riverside & City Center</div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="text-xs text-white/60">Experience</div>
                <div class="mt-1 text-sm font-semibold">Luxury rooms, calm ambience</div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="text-xs text-white/60">Service</div>
                <div class="mt-1 text-sm font-semibold">Fast check-in, modern amenities</div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold">Quick Room Search</div>
                <div class="text-xs text-white/60">Best rates on direct booking</div>
              </div>

              <form class="grid mt-2 gap-4" @submit.prevent="goBooking">
                <div class="grid gap-4 sm:grid-cols-2">
                  <label class="grid gap-1">
                    <span class="text-xs text-white/60">Check-in</span>
                    <input v-model="form.checkIn" type="date"
                      class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
                  </label>
                  <label class="grid gap-1">
                    <span class="text-xs text-white/60">Check-out</span>
                    <input v-model="form.checkOut" type="date"
                      class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
                  </label>
                </div>

                <label class="grid gap-1">
                  <span class="text-xs text-white/60">Guests</span>
                  <select v-model.number="form.guests"
                    class="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25">
                    <option :value="1">1 Guest</option>
                    <option :value="2">2 Guests</option>
                    <option :value="3">3 Guests</option>
                    <option :value="4">4 Guests</option>
                  </select>
                </label>

                <button type="submit"
                  class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]">
                  Search Availability
                </button>
              </form>

              <div class="mt-6 grid gap-3">
                <div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span class="material-symbols-outlined text-[20px] text-[color:var(--color-primary)]">spa</span>
                  <div>
                    <div class="text-sm font-semibold">Spa & wellness</div>
                    <div class="text-xs text-white/60">Unwind with calm, warm treatments</div>
                  </div>
                </div>
                <div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span
                    class="material-symbols-outlined text-[20px] text-[color:var(--color-primary)]">restaurant</span>
                  <div>
                    <div class="text-sm font-semibold">Signature dining</div>
                    <div class="text-xs text-white/60">Local flavors with a modern touch</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl mb-10 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-2">
        <h2 class="text-2xl font-bold tracking-tight">Highlights</h2>
        <p class="text-sm text-white/65">Everything you need for a smooth, premium stay.</p>
      </div>

      <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in highlights" :key="item.title"
          class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-5">
          <div class="flex items-center gap-3">
            <div
              class="grid h-11 w-11 place-items-center rounded-2xl bg-[color:rgba(54,226,123,0.12)] ring-1 ring-[color:rgba(54,226,123,0.25)]">
              <span class="material-symbols-outlined text-[20px] text-[color:var(--color-primary)]">{{ item.icon
                }}</span>
            </div>
            <div class="text-sm font-semibold">{{ item.title }}</div>
          </div>
          <div class="mt-3 text-sm text-white/65">{{ item.desc }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useGuestStore } from '@/stores/guest'

const router = useRouter()
const guestStore = useGuestStore()

const handleBookNow = () => {
  if (!guestStore.isLoggedIn) {
    sessionStorage.setItem('pendingBooking', 'true')
    window.location.href = import.meta.env.VITE_GOOGLE
  } else {
    router.push('/booking')
  }
}

const form = reactive({
  checkIn: '',
  checkOut: '',
  guests: 2,
})

const goBooking = () => {
  if (!guestStore.isLoggedIn) {
    sessionStorage.setItem('pendingBooking', 'true')
    sessionStorage.setItem('pendingBookingQuery', JSON.stringify({
      checkIn: form.checkIn || undefined,
      checkOut: form.checkOut || undefined,
      guests: String(form.guests || 2),
    }))
    window.location.href = import.meta.env.VITE_GOOGLE
    return
  }

  router.push({
    path: '/booking',
    query: {
      checkIn: form.checkIn || undefined,
      checkOut: form.checkOut || undefined,
      guests: String(form.guests || 2),
    },
  })
}

const highlights = [
  { icon: 'location_on', title: 'Prime location', desc: 'Easy access to sights, markets, and riverside walks.' },
  { icon: 'king_bed', title: 'Luxury rooms', desc: 'Premium bedding, quiet comfort, and warm lighting.' },
  { icon: 'wifi', title: 'Fast Wi‑Fi', desc: 'Reliable internet for work, calls, and streaming.' },
  { icon: 'pool', title: 'Resort amenities', desc: 'Pool, gym, spa, and dining crafted for calm stays.' },
]
</script>
