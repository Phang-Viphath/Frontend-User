<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold tracking-tight">Booking</h1>
      <p class="text-sm text-white/65">Check availability, pick a room, confirm guest details, and pay securely.</p>
    </div>

    <div class="mt-9 grid gap-8 lg:grid-cols-12">
      <div class="lg:col-span-7">
        <div class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
          <div class="flex items-center justify-between gap-3">
            <div class="text-sm font-semibold">1) Availability</div>
            <div class="text-xs text-white/60">Step {{ step }} / 3</div>
          </div>

          <form class="mt-5 grid gap-4" @submit.prevent="checkAvailability">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="grid gap-1">
                <span class="text-xs text-white/60">Check-in Date Time 12:00 PM</span>
                <input v-model="availability.checkIn" type="date"
                  class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
              </label>
              <label class="grid gap-1">
                <span class="text-xs text-white/60">Check-out Date Time 12:00 PM</span>
                <input v-model="availability.checkOut" type="date"
                  class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
              </label>
            </div>

            <label class="grid gap-1">
              <span class="text-xs text-white/60">Guests</span>
              <select v-model.number="availability.guests"
                class="h-11 rounded-xl border border-white/10 bg-[#112117] px-3 text-sm text-white outline-none transition focus:border-white/25">
                <option :value="1">1 Guest</option>
                <option :value="2">2 Guests</option>
                <option :value="3">3 Guests</option>
                <option :value="4">4 Guests</option>
              </select>
            </label>

            <button type="submit"
              class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]">
              Check Availability
            </button>
          </form>
        </div>

        <div
          id="room-selection"
          class="mt-6 rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
          <div class="text-sm font-semibold">2) Select room</div>
          <div class="mt-1 text-sm text-white/65">Choose a room type. Availability is validated when you confirm.</div>

          <div v-if="roomsLoading" class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
            Loading rooms...
          </div>

          <div v-else-if="roomsError"
            class="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-white/80">
            {{ roomsError }}
          </div>

          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <button v-for="room in visibleRoomOptions" :key="room.id" type="button"
              class="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10" :class="[
                selectedRoom?.id === room.id ? 'ring-2 ring-[color:rgba(54,226,123,0.35)]' : ''
              ]" @click="selectRoom(room)">
              <div class="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <img :src="room.image" :alt="room.name" class="h-28 w-full object-cover" loading="lazy" />
              </div>
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <div class="truncate text-sm font-semibold">{{ room.name }}</div>
                    <div v-if="selectedRoom?.id === room.id" class="flex items-center gap-1 rounded-full border border-[color:rgba(54,226,123,0.3)] bg-[color:rgba(54,226,123,0.1)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--color-primary)]">
                      <span class="material-symbols-outlined text-[12px]">check</span>
                      Selected
                    </div>
                  </div>
                  <div class="mt-1 text-xs text-white/60">{{ room.summary }}</div>
                </div>
                <div class="shrink-0 text-right">
                  <div class="text-xs text-white/60">From</div>
                  <div class="text-sm font-bold text-[color:var(--color-primary)]">${{ room.price }}</div>
                </div>
              </div>

              <div class="mt-3 flex flex-wrap gap-2">
                <span v-for="t in room.tags" :key="t"
                  class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">{{ t }}</span>
              </div>

              <div v-if="room.bookedDates && room.bookedDates.length" class="mt-4 border-t border-white/10 pt-3 text-left">
                <div class="text-[11px] font-medium uppercase tracking-wider text-white/50 mb-2">Booked Dates</div>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="d in room.bookedDates" :key="d" class="rounded bg-red-500/15 border border-red-500/20 px-2 py-1 text-[10px] text-red-200">
                    {{ d }}
                  </span>
                </div>
              </div>
            </button>
          </div>

          <div v-if="!roomsLoading && !roomsError && roomOptions.length" class="mt-6 flex justify-center">
            <button v-if="canLoadMoreRooms" type="button"
              class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
              @click="loadMoreRooms">
              More Rooms
            </button>
          </div>
        </div>

        <div
          class="mt-6 rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
          <div class="flex items-center justify-between gap-3">
            <div class="text-sm font-semibold">3) Guest information</div>
            <div v-if="guestStore.isLoggedIn" class="flex items-center gap-2 rounded-full border border-[color:rgba(54,226,123,0.3)] bg-[color:rgba(54,226,123,0.1)] px-3 py-1 text-xs font-medium text-[color:var(--color-primary)]">
              <span class="material-symbols-outlined text-[14px]">check_circle</span>
              Logged in as {{ guestStore.name }}
            </div>
          </div>

          <form class="mt-5 grid gap-4" @submit.prevent="confirm">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="grid gap-1">
                <span class="text-xs text-white/60">Full name</span>
                <input v-model.trim="guest.name"
                  class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
              </label>
              <label class="grid gap-1">
                <span class="text-xs text-white/60">Phone / WhatsApp</span>
                <input v-model.trim="guest.phone"
                  class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
              </label>
            </div>

            <label class="grid gap-1">
              <span class="text-xs text-white/60">Email</span>
              <input v-model.trim="guest.email" type="email"
                :readonly="guestStore.isLoggedIn"
                :class="guestStore.isLoggedIn ? 'cursor-not-allowed opacity-70' : ''"
                class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
            </label>

            <label v-if="!guestStore.isLoggedIn" class="grid gap-1">
              <span class="text-xs text-white/60">Password</span>
              <input v-model.trim="guest.password" type="password"
                placeholder="Required to create or access account"
                class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
            </label>

            <label class="grid gap-1">
              <span class="text-xs text-white/60">Notes (optional)</span>
              <textarea v-model.trim="guest.notes" rows="4"
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-white/25" />
            </label>

            <button type="submit" :disabled="confirmingBooking"
              class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)] disabled:cursor-not-allowed disabled:opacity-70">
              <span v-if="confirmingBooking" class="inline-flex items-center gap-2">
                <span class="material-symbols-outlined animate-spin text-sm">refresh</span>
                Confirming...
              </span>
              <span v-else>Confirm Booking</span>
            </button>
          </form>
        </div>
      </div>

      <aside class="lg:col-span-5">
        <div
          class="sticky top-24 rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
          <div class="text-sm font-semibold">Summary</div>

          <div class="mt-4 grid gap-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-white/60">Check-in Date Time 12:00 PM</span>
              <span class="font-medium">{{ availability.checkIn || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-white/60">Check-out Date Time 12:00 PM</span>
              <span class="font-medium">{{ availability.checkOut || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-white/60">Guests</span>
              <span class="font-medium">{{ availability.guests }}</span>
            </div>
            <div class="h-px bg-white/10" />
            <div class="flex items-center justify-between">
              <span class="text-white/60">Room</span>
              <span class="font-medium">{{ selectedRoom?.name || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-white/60">Price</span>
              <span class="font-semibold text-[color:var(--color-primary)]">${{ selectedRoom?.price ?? '—' }}/night</span>
            </div>
            <div v-if="totalDays > 0" class="flex items-center justify-between">
              <span class="text-white/60">Duration</span>
              <span class="font-medium">{{ totalDays }} night{{ totalDays > 1 ? 's' : '' }}</span>
            </div>
            <div v-if="totalDays > 0" class="flex items-center justify-between">
              <span class="text-white/60">Total</span>
              <span class="font-semibold text-[color:var(--color-primary)]">${{ totalPrice }}</span>
            </div>
          </div>

          <div v-if="confirmed" class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-[24px] text-white">qr_code_scanner</span>
              <div>
                <div class="text-sm font-bold tracking-wide uppercase">KHQR PAY</div>
                <div class="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-white/60">Bakong Instant Settlement</div>
              </div>
            </div>

            <div class="mt-6 flex justify-center">
              <div class="inline-block border-2 border-[#E12424] bg-white p-2">
                <div v-if="paymentLoading" class="flex h-[200px] w-[200px] items-center justify-center bg-black/10 text-center text-xs text-black/60">
                  Generating payment QR...
                </div>
                <div v-else-if="paymentVerifyLoading" class="flex h-[200px] w-[200px] items-center justify-center bg-black/10 text-center text-xs text-black/60">
                  Verifying payment...
                </div>
                <div v-else-if="paymentConfirmLoading" class="flex h-[200px] w-[200px] items-center justify-center bg-black/10 text-center text-xs text-black/60">
                  Confirming reservation...
                </div>
                <div v-else-if="paymentError" class="flex h-[200px] w-[200px] items-center justify-center bg-red-500/10 p-4 text-center text-xs text-red-600">
                  {{ paymentError }}
                </div>
                <img v-else-if="paymentQrUrl" :src="paymentQrUrl" alt="Payment QR" class="h-[200px] w-[200px] object-contain" />
                <div v-else class="flex h-[200px] w-[200px] items-center justify-center bg-black/10 text-center text-xs text-black/60">
                  Payment QR unavailable.
                </div>
              </div>
            </div>

            <div class="mt-6 grid gap-2 border-b border-white/10 pb-4 text-sm">
              <div class="flex justify-between items-center text-white/80">
                <span>Merchant</span>
                <span class="font-bold text-[#ECAE35]">HOTEL BOOKING</span>
              </div>
              <div class="flex justify-between items-center text-white/80">
                <span>Bakong Account ID:</span>
                <span class="font-mono text-[#ECAE35]">booking@bkrt</span>
              </div>
              <div class="flex justify-between items-center text-white/80">
                <span>Order Ref. ID:</span>
                <span class="font-mono text-[#ECAE35]">ORD-{{ reservation?.id || 'PENDING' }}</span>
              </div>
              <div class="flex justify-between items-center text-white/80">
                <span>Duration:</span>
                <span class="font-mono text-[#ECAE35]">{{ totalDays }} night{{ totalDays > 1 ? 's' : '' }}</span>
              </div>
              <div class="mt-2 flex justify-between items-center text-base">
                <span class="font-bold text-[#ECAE35]">Total</span>
                <span class="font-bold text-[#E12424]">${{ totalPrice }} USD</span>
              </div>
            </div>

            <div v-if="!paymentConfirmed && !paymentCancelled" class="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/70">
              <span class="material-symbols-outlined text-[14px]">schedule</span>
              QR expires in: <span class="font-bold text-[#E12424]">{{ paymentTimeLeftLabel }}</span>
            </div>

            <div class="mt-4 grid gap-3">
              <button v-if="paymentQrUrl" type="button"
                class="mt-3 inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/85 transition hover:bg-white/10"
                :disabled="!paymentQrUrl"
                @click="downloadQr">
                Download QR
              </button>
              <button type="button"
                class="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-transparent px-5 text-sm font-semibold text-white/85 transition hover:bg-white/5"
                :disabled="paymentVerifyLoading || paymentConfirmLoading || paymentCancelLoading || paymentConfirmed || paymentCancelled || !reservation?.id || !paymentMd5"
                @click="cancelReservation">
                {{ paymentCancelLoading ? 'Cancelling...' : 'Cancel Reservation' }}
              </button>

              <div v-if="paymentConfirmError"
                class="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-white/80">
                {{ paymentConfirmError }}
              </div>

              <div v-if="paymentVerifyError"
                class="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-white/80">
                {{ paymentVerifyError }}
              </div>

              <div v-if="paymentCancelError"
                class="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-white/80">
                {{ paymentCancelError }}
              </div>

              <div v-if="paymentCancelled"
                class="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-white/85">
                Payment failed or timeout. Your reservation has been cancelled.
              </div>
            </div>
          </div>
          <div v-else class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-center text-xs text-white/60">
            Complete the steps on the left to see payment details.
          </div>
        </div>
      </aside>
    </div>
  </div>

  <PaymentConfirmed v-model:open="paymentSuccessModalOpen" />
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, reactive, ref, getCurrentInstance, watch } from 'vue'
import { useRoute } from 'vue-router'

import QRCode from 'qrcode'
import apiClient from '@/util/client'
import { resolveImageUrl } from '@/util/image'
import PaymentConfirmed from '@/components/PaymentConfirmed.vue'
import { useGuestStore } from '@/stores/guest'

const route = useRoute()
const guestStore = useGuestStore()

const availability = reactive({
  checkIn: typeof route.query.checkIn === 'string' ? route.query.checkIn : '',
  checkOut: typeof route.query.checkOut === 'string' ? route.query.checkOut : '',
  guests: Number(typeof route.query.guests === 'string' ? route.query.guests : 2) || 2,
})

const roomOptions = ref([])
const roomsLoading = ref(true)
const roomsError = ref('')

const visibleRoomsCount = ref(2)
const visibleRoomOptions = computed(() => {
  if (selectedRoom.value) {
    const otherRooms = roomOptions.value.filter(r => r.id !== selectedRoom.value.id)
    return [selectedRoom.value, ...otherRooms].slice(0, visibleRoomsCount.value)
  }
  return roomOptions.value.slice(0, visibleRoomsCount.value)
})
const canLoadMoreRooms = computed(() => roomOptions.value.length > visibleRoomsCount.value)

const totalDays = computed(() => {
  if (!availability.checkIn || !availability.checkOut) return 0
  const checkInDate = new Date(availability.checkIn)
  const checkOutDate = new Date(availability.checkOut)
  const diffTime = checkOutDate - checkInDate
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 1
})

const totalPrice = computed(() => {
  const price = selectedRoom.value?.price ?? 0
  return (price * totalDays.value).toFixed(2)
})

const loadMoreRooms = () => {
  visibleRoomsCount.value += 2
}

const selectedRoom = ref(null)
const confirmed = ref(false)
const reservation = ref(null)
const paymentQrUrl = ref('')
const paymentKhqr = ref('')
const paymentMd5 = ref('')
const paymentLoading = ref(false)
const paymentError = ref('')
const paymentVerifyLoading = ref(false)
const paymentVerifyError = ref('')
const paymentConfirmLoading = ref(false)
const paymentConfirmError = ref('')
const paymentConfirmed = ref(false)
const paymentCancelLoading = ref(false)
const paymentCancelError = ref('')
const paymentCancelled = ref(false)
const paymentSecondsLeft = ref(0)
const paymentSuccessModalOpen = ref(false)
const confirmingBooking = ref(false)

let paymentTimerId = null
let paymentVerifyPollId = null
let paymentVerifyInFlight = false

const paymentTimeLeftLabel = computed(() => {
  const total = Math.max(0, Number(paymentSecondsLeft.value) || 0)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

watch(paymentConfirmed, (value) => {
  if (value) paymentSuccessModalOpen.value = true
})

const guest = reactive({
  name: '',
  phone: '',
  email: '',
  password: '',
  notes: '',
})

const loadGuestInfo = () => {
  if (guestStore.isLoggedIn && guestStore.guest) {
    guest.name = guestStore.guest.name || ''
    guest.email = guestStore.guest.email || ''
    guest.phone = guestStore.guest.phone || ''
  }
}

watch(() => guestStore.isLoggedIn, () => {
  loadGuestInfo()
})

watch(() => route.query.roomId, (newRoomId) => {
  if (newRoomId && roomOptions.value.length > 0) {
    const preSelectedRoom = roomOptions.value.find(r => r.id === Number(newRoomId))
    if (preSelectedRoom) {
      selectedRoom.value = preSelectedRoom
      toast?.info(`Room pre-selected: ${preSelectedRoom.name}`)
      visibleRoomsCount.value = 2
      setTimeout(() => {
        const roomSection = document.getElementById('room-selection')
        if (roomSection) {
          roomSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)
    }
  }
})

const step = computed(() => {
  if (!availability.checkIn || !availability.checkOut) return 1
  if (!selectedRoom.value) return 2
  return 2
})

const toast = getCurrentInstance()?.appContext.config.globalProperties.$toast

const checkAvailability = () => {
  confirmed.value = false
  toast?.success('Availability noted. Choose a room and confirm to validate dates.')
}

const selectRoom = (room) => {
  confirmed.value = false
  selectedRoom.value = room
  toast?.info(`Selected: ${room.name}`)
}

const ensureGuestId = async () => {
  if (guestStore.isLoggedIn && guestStore.guest?.id) {
    return guestStore.guest.id
  }

  const email = (guest.email || '').trim()
  const name = (guest.name || '').trim()
  const phone = (guest.phone || '').trim()
  const password = (guest.password || '').trim()

  if (!email) {
    throw new Error('Please enter your email.')
  }
  if (!name) {
    throw new Error('Please enter your full name.')
  }
  if (!password) {
    throw new Error('Please enter a password.')
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }

  try {
    const res = await apiClient.post('/public/guests/login', { email, password })
    const id = res?.guest?.id
    if (!id) throw new Error('Guest login failed.')
    if (res.token) guestStore.setToken(res.token)
    guestStore.setGuest(res.guest)
    return id
  } catch (e) {
    const status = e?.response?.status
    if (status !== 404) {
      const msg = e?.response?.data?.message || 'Failed to login guest.'
      throw new Error(msg)
    }
  }

  const created = await apiClient.post('/public/guests', { name, email, phone: phone || null, password })
  const id = created?.guest?.id
  if (!id) throw new Error('Failed to create guest.')
  guestStore.setGuest(created.guest)
  return id
}

const confirm = async () => {
  if (!availability.checkIn || !availability.checkOut) {
    toast?.warning('Please select check-in and check-out dates.')
    return
  }
  if (!selectedRoom.value) {
    toast?.warning('Please select a room type.')
    return
  }

  if (!guest.phone) {
    toast?.warning('Please enter your phone/WhatsApp.')
    return
  }

  confirmingBooking.value = true
  confirmed.value = false
  reservation.value = null
  paymentQrUrl.value = ''
  paymentKhqr.value = ''
  paymentMd5.value = ''
  paymentLoading.value = false
  paymentError.value = ''
  paymentVerifyLoading.value = false
  paymentVerifyError.value = ''
  paymentConfirmLoading.value = false
  paymentConfirmError.value = ''
  paymentConfirmed.value = false
  paymentCancelLoading.value = false
  paymentCancelError.value = ''
  paymentCancelled.value = false
  paymentSecondsLeft.value = 0
  clearPaymentTimer()

  try {
    const guestId = await ensureGuestId()
    const res = await apiClient.post('/public/reservations', {
      guest_id: guestId,
      room_id: selectedRoom.value.id,
      check_in: availability.checkIn,
      check_out: availability.checkOut,
    })

    reservation.value = res
    confirmed.value = true

    startPaymentTimer(300)

    paymentLoading.value = true
    try {
      const amount = Number(reservation.value?.total ?? totalPrice.value) || 0
      const khqrRes = await apiClient.post('/public/bakong/khqr', {
        amount,
      })
      paymentKhqr.value = String(khqrRes?.khqr ?? '')
      paymentMd5.value = String(khqrRes?.md5 ?? '')
      if (!paymentKhqr.value) {
        throw new Error('Missing KHQR string from server.')
      }
      startVerifyPolling()
      paymentQrUrl.value = await QRCode.toDataURL(paymentKhqr.value, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 512,
      })
      toast?.success('Booking confirmed. Scan QR to pay.')
    } catch (e) {
      paymentError.value = e?.response?.data?.message || e?.message || 'Failed to generate payment QR.'
      toast?.error(paymentError.value)
    } finally {
      paymentLoading.value = false
    }
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || 'Booking failed.'
    toast?.error(msg)
  } finally {
    confirmingBooking.value = false
  }
}

const downloadQr = () => {
  if (!paymentQrUrl.value) return

  const id = reservation.value?.id ? String(reservation.value.id) : 'reservation'
  const link = document.createElement('a')
  link.href = paymentQrUrl.value
  link.download = `payment-qr-${id}.png`
  document.body.appendChild(link)
  link.click()
  link.remove()
}

const verifyTransaction = async () => {
  if (!reservation.value?.id) {
    paymentVerifyError.value = 'Missing reservation id.'
    return
  }
  if (!paymentMd5.value) {
    paymentVerifyError.value = 'Missing md5 for verification.'
    return
  }

  paymentVerifyLoading.value = true
  paymentVerifyError.value = ''
  paymentConfirmError.value = ''

  try {
    const verifyRes = await apiClient.post('/public/bakong/verify-transaction', {
      md5: paymentMd5.value,
    })

    const paid = Boolean(verifyRes?.paid)
    if (!paid) {
      paymentVerifyError.value = 'Transaction not found or not paid yet. Please try again.'
      toast?.warning(paymentVerifyError.value)
      return
    }

    await confirmPayment()
  } catch (e) {
    paymentVerifyError.value = e?.response?.data?.message || e?.message || 'Failed to verify transaction.'
    toast?.error(paymentVerifyError.value)
  } finally {
    paymentVerifyLoading.value = false
  }
}

const clearPaymentTimer = () => {
  if (paymentTimerId) {
    clearInterval(paymentTimerId)
    paymentTimerId = null
  }
}

const clearVerifyPolling = () => {
  if (paymentVerifyPollId) {
    clearInterval(paymentVerifyPollId)
    paymentVerifyPollId = null
  }
  paymentVerifyInFlight = false
}

const startVerifyPolling = () => {
  clearVerifyPolling()

  if (!reservation.value?.id || !paymentMd5.value) return
  if (paymentConfirmed.value || paymentCancelled.value) return

  paymentVerifyPollId = setInterval(async () => {
    if (!reservation.value?.id || !paymentMd5.value) {
      clearVerifyPolling()
      return
    }
    if (paymentConfirmed.value || paymentCancelled.value) {
      clearVerifyPolling()
      return
    }
    if (paymentSecondsLeft.value <= 0) {
      clearVerifyPolling()
      return
    }
    if (paymentVerifyInFlight) return

    paymentVerifyInFlight = true
    try {
      const verifyRes = await apiClient.post('/public/bakong/verify-transaction', {
        md5: paymentMd5.value,
      })

      const paid = Boolean(verifyRes?.paid)
      if (paid) {
        clearVerifyPolling()
        await confirmPayment()
      }
    } catch (e) {
    } finally {
      paymentVerifyInFlight = false
    }
  }, 5000)
}

const startPaymentTimer = (seconds) => {
  clearPaymentTimer()
  paymentSecondsLeft.value = Number(seconds) || 0

  if (paymentSecondsLeft.value <= 0) return

  paymentTimerId = setInterval(async () => {
    if (paymentConfirmed.value || paymentCancelled.value) {
      clearPaymentTimer()
      return
    }

    paymentSecondsLeft.value = Math.max(0, paymentSecondsLeft.value - 1)

    if (paymentSecondsLeft.value <= 0) {
      clearPaymentTimer()
      clearVerifyPolling()
      await cancelReservation(true)
    }
  }, 1000)
}

const confirmPayment = async () => {
  if (!reservation.value?.id) {
    paymentConfirmError.value = 'Missing reservation id.'
    return
  }

  paymentConfirmLoading.value = true
  paymentConfirmError.value = ''
  paymentConfirmed.value = false

  try {
    const updated = await apiClient.post(`/public/reservations/${reservation.value.id}/confirm-payment`, {
      status: 'Confirmed',
    })
    reservation.value = updated
    paymentConfirmed.value = true
    paymentSecondsLeft.value = 0
    clearPaymentTimer()
    clearVerifyPolling()
    toast?.success('Payment confirmed. Reservation updated.')
  } catch (e) {
    paymentConfirmError.value = e?.response?.data?.message || e?.message || 'Failed to confirm payment.'
    toast?.error(paymentConfirmError.value)
  } finally {
    paymentConfirmLoading.value = false
  }
}

const cancelReservation = async (fromTimer = false) => {
  if (!reservation.value?.id) {
    paymentCancelError.value = 'Missing reservation id.'
    return
  }
  if (paymentConfirmed.value || paymentCancelled.value) {
    return
  }

  clearVerifyPolling()

  paymentCancelLoading.value = true
  paymentCancelError.value = ''

  try {
    await apiClient.post(`/public/reservations/${reservation.value.id}/cancel`)
    paymentCancelled.value = true
    paymentSecondsLeft.value = 0
    clearPaymentTimer()
    clearVerifyPolling()
    if (fromTimer) {
      toast?.error('Payment timeout. Reservation cancelled.')
    } else {
      toast?.error('Reservation cancelled.')
    }
  } catch (e) {
    paymentCancelError.value = e?.response?.data?.message || e?.message || 'Failed to cancel reservation.'
    toast?.error(paymentCancelError.value)
  } finally {
    paymentCancelLoading.value = false
  }
}

const fallbackImage = 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=80'

const mapRoomOption = (r) => {
  const image = resolveImageUrl(r?.image) || fallbackImage
  const capacity = Number(r?.capacity ?? 2)
  const status = String(r?.status ?? 'available')
  const isAvailable = status === 'available'
  
  const bookedDates = (r.reservations || []).map(res => {
    const ci = new Date(res.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const co = new Date(res.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    return `${ci} - ${co}`
  })

  return {
    id: r.id,
    name: r?.type ? String(r.type) : `Room ${r?.number ?? ''}`.trim(),
    price: r?.price ?? 0,
    summary: `Floor ${r?.floor ?? '-'} • Capacity ${capacity}`,
    tags: ['Wi‑Fi', capacity >= 3 ? 'Family' : 'Couples', 'Modern'],
    status,
    isAvailable,
    bookedDates,
    image,
  }
}

onMounted(async () => {
  loadGuestInfo()

  roomsLoading.value = true
  roomsError.value = ''
  try {
    const res = await apiClient.get('/public/rooms')
    roomOptions.value = Array.isArray(res)
      ? res
        .filter(r => String(r?.status ?? '').toLowerCase() !== 'maintenance')
        .map(mapRoomOption)
      : []
    visibleRoomsCount.value = 2

    const queryRoomId = route.query.roomId
    if (queryRoomId) {
      const preSelectedRoom = roomOptions.value.find(r => r.id === Number(queryRoomId))
      if (preSelectedRoom) {
        selectedRoom.value = preSelectedRoom
        toast?.info(`Room pre-selected: ${preSelectedRoom.name}`)
        visibleRoomsCount.value = 2
        setTimeout(() => {
          const roomSection = document.getElementById('room-selection')
          if (roomSection) {
            roomSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 300)
      }
    }
  } catch (e) {
    roomsError.value = e?.response?.data?.message || 'Failed to load rooms from API.'
  } finally {
    roomsLoading.value = false
  }
})

onBeforeUnmount(() => {
  clearPaymentTimer()
  clearVerifyPolling()
})
</script>
