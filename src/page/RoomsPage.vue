<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold tracking-tight">Rooms & Suites</h1>
      <p class="text-sm text-white/65">Choose a room that matches your travel style — calm, modern, and premium.</p>
    </div>

    <div v-if="error" class="mt-9 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-white/80">
      {{ error }}
    </div>

    <div v-else class="mt-9">
      <div v-if="isLoading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="overflow-hidden rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)]">
          <div class="relative h-52 animate-pulse bg-gray-700/30" />
          <div class="p-5 space-y-4">
            <div class="h-6 w-3/5 rounded bg-gray-600/40 animate-pulse" />
            <div class="h-4 w-2/5 rounded bg-gray-600/30 animate-pulse" />
            <div class="h-5 w-1/4 rounded bg-gray-600/40 animate-pulse mt-2" />
            <div class="flex gap-2 pt-2">
              <div v-for="i in 3" :key="i" class="h-6 w-20 rounded-full bg-gray-600/30 animate-pulse" />
            </div>
            <div class="mt-5 h-12 rounded-xl bg-gray-600/20 animate-pulse" />
          </div>
        </div>
      </div>

      <div v-else-if="visibleRooms.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="room in visibleRooms" :key="room.id"
          class="overflow-hidden rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] transition-opacity duration-200">
          
          <div class="relative h-52">
            <img :src="room.image" :alt="room.name" class="h-full w-full object-cover" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
            
            <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div class="min-w-0">
                <div class="truncate text-lg font-semibold">{{ room.name }}</div>
                <div class="text-xs text-white/70">{{ room.tagline }}</div>
              </div>
              <div class="shrink-0 rounded-2xl bg-black/35 px-3 py-2 text-right backdrop-blur">
                <div class="text-xs text-white/70">From</div>
                <div class="text-sm font-bold text-[color:var(--color-primary)]">${{ room.price }}/night</div>
              </div>
            </div>

          </div>

          <div class="p-5">
            <dl class="grid gap-3 text-sm">
              <div class="flex items-center justify-between gap-3">
                <dt class="text-white/60">Floor</dt>
                <dd class="font-medium">{{ room.floor }}</dd>
              </div>
              <div class="flex items-center justify-between gap-3">
                <dt class="text-white/60">Beds</dt>
                <dd class="font-medium">{{ room.beds }}</dd>
              </div>
              <div class="flex flex-wrap gap-2 pt-2">
                <span v-for="f in room.facilities" :key="f"
                  class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                  {{ f }}
                </span>
              </div>
            </dl>

            <div v-if="room.bookedDates && room.bookedDates.length" class="mt-4 border-t border-white/10 pt-3">
              <div class="text-[11px] font-medium uppercase tracking-wider text-white/50 mb-2">Booked Dates</div>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="d in room.bookedDates" :key="d" class="rounded bg-red-500/15 border border-red-500/20 px-2 py-1 text-xs text-red-200">
                  {{ d }}
                </span>
              </div>
            </div>

            <div class="mt-5 flex items-center gap-3">
              <button type="button"
                class="inline-flex flex-1 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] px-4 py-3 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]"
                @click="handleBookNow(room.id)">
                Book Now
              </button>
              <button type="button"
                class="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
                @click="showDetails(room)" aria-label="Room details">
                <span class="material-symbols-outlined">info</span>
              </button>
            </div>
          </div>
        </article>
      </div>

      <div v-if="!isLoading && rooms.length > visibleCount" class="mt-8 flex justify-center">
        <button type="button" :disabled="isLoading"
          class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="loadMore">
          <span v-if="isLoading" class="inline-flex items-center gap-2">
            <span class="material-symbols-outlined animate-spin">refresh</span>
            Loading...
          </span>
          <span v-else>More Rooms</span>
        </button>
      </div>

      <div v-else-if="!isLoading && !rooms.length" class="mt-12 text-center text-white/60">
        <p class="text-lg">No rooms available at the moment.</p>
        <p class="mt-2 text-sm">Please check back later or contact us directly.</p>
      </div>
    </div>

    <transition name="fade">
      <div v-if="selected" class="fixed inset-0 z-50" @click.self="selected = null">
        <div class="absolute inset-0 bg-black/70" />
        <div class="absolute left-1/2 top-1/2 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2">
          <div class="overflow-hidden rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(13,24,17,0.92)] backdrop-blur">
            <div class="flex items-center justify-between border-b border-[color:var(--color-surface-border)] px-5 py-4">
              <div class="min-w-0">
                <div class="truncate text-lg font-semibold">{{ selected.name }}</div>
                <div class="text-xs text-white/60">${{ selected.price }}/night • {{ selected.size }} • {{ selected.beds }}</div>
              </div>
              <button type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
                aria-label="Close" @click="selected = null">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="grid gap-6 p-5 md:grid-cols-2">
              <img :src="selected.image" :alt="selected.name" class="h-52 w-full rounded-2xl object-cover" />
              <div>
                <div class="text-sm font-semibold">Room details</div>
                <p class="mt-2 text-sm text-white/65">{{ selected.details }}</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="f in selected.facilities" :key="f"
                    class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                    {{ f }}
                  </span>
                </div>
                <button type="button"
                  class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] px-4 py-3 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]"
                  @click="handleBookNow(selected.id); selected = null">
                  Continue to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import apiClient from '@/util/client'
import { resolveImageUrl } from '@/util/image'
import { useGuestStore } from '@/stores/guest'

const router = useRouter()
const guestStore = useGuestStore()

const rooms = ref([])
const isLoading = ref(true)
const error = ref('')

const visibleCount = ref(6)
const visibleRooms = computed(() => rooms.value.slice(0, visibleCount.value))

const canLoadMore = computed(() => rooms.value.length > visibleCount.value)

const loadMore = () => {
  visibleCount.value += 6
}

const selected = ref(null)

const showDetails = (room) => {
  selected.value = room
}

const handleBookNow = (roomId) => {
  if (guestStore.isLoggedIn) {
    router.push({ path: '/booking', query: { roomId } })
  } else {
    sessionStorage.setItem('pendingBookingRoomId', roomId)
    window.location.href = import.meta.env.VITE_GOOGLE
  } 
}

const fallbackImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80'

const mapRoom = (r) => {
  const image = resolveImageUrl(r?.image) || fallbackImage
  const capacity = Number(r?.capacity ?? 2)
  const status = String(r?.status ?? 'available')
  const isAvailable = status === 'available'
  const facilities = ['Wi‑Fi', 'Air conditioning', 'Smart TV']
  if (capacity >= 3) facilities.push('Family-friendly')
  if (String(r?.type || '').toLowerCase().includes('suite')) facilities.push('Living area')

  const bookedDates = (r.reservations || []).map(res => {
    const ci = new Date(res.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const co = new Date(res.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    return `${ci} - ${co}`
  })

  return {
    id: r.id,
    apiRoomId: r.id,
    status,
    isAvailable,
    bookedDates,
    name: r?.type ? String(r.type) : `Room ${r?.number ?? ''}`.trim(),
    tagline: `Floor ${r?.floor ?? '-'} • Capacity ${capacity}`,
    price: r?.price ?? 0,
    floor: r?.floor ?? '—',
    beds: capacity >= 3 ? 'Family setup' : 'Standard bedding',
    facilities,
    details: `Room No. ${r?.number ?? '-'} with modern comfort and calm service.`,
    image,
  }
}

onMounted(async () => {
  isLoading.value = true
  error.value = ''
  try {
    const res = await apiClient.get('/public/rooms')
    rooms.value = Array.isArray(res)
      ? res
          .filter(r => String(r?.status ?? '').toLowerCase() !== 'maintenance')
          .map(mapRoom)
      : []
    visibleCount.value = 6
  } catch (e) {
    error.value = e?.response?.data?.message || 'Failed to load rooms. Please try again later.'
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>