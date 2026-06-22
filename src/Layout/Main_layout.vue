<template>
  <div class="flex min-h-dvh flex-col bg-[var(--color-background-dark)] text-white">
  <header class="fixed w-full inset-x-0 top-[-5px] z-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        class="mt-3 flex items-center justify-between rounded-2xl border border-[color:var(--color-surface-border)] bg-[color:rgba(13,24,17,0.72)] px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-[color:rgba(13,24,17,0.55)]">
        <RouterLink to="/" class="flex min-w-0 items-center gap-3">
          <div class="grid h-8 w-8 place-items-center">
            <img src="@/assets/Hotel_icon.png" alt="Hotel" class="h-8 w-8" />
          </div>
          <div class="min-w-0">
            <div class="truncate text-base font-bold tracking-wide text-white">Battambang Hotel</div>
            <div class="truncate text-xs text-white/60 sm:block">Resort calm. Business ready.</div>
          </div>
        </RouterLink>

        <div class="flex items-center gap-3">
          <nav class="hidden items-center gap-1 md:flex">
            <NavLink to="/" label="Home" />
            <NavLink to="/rooms" label="Rooms" />

            <div class="relative">
              <button type="button"
                class="inline-flex h-10 w-20 cursor-pointer items-center justify-center rounded-xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.55)] text-white/80 transition hover:text-[color:var(--color-primary)]"
                :class="menuOpen ? 'bg-white/5 text-white' : ''" @click="toggleMenu">
                Menu
              </button>
              <div v-if="menuOpen"
                class="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl border border-[color:var(--color-surface-border)] bg-[#0D1811] shadow-xl shadow-black/30">
                <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to"
                  class="flex items-center justify-between px-4 py-3 text-sm text-white/80 transition hover:text-[var(--color-primary)]"
                  @click="menuOpen = false">
                  <span>{{ item.label }}</span>
                </RouterLink>
              </div>
            </div>
          </nav>

          <RouterLink to="/booking"
            class="hidden rounded-xl bg-[color:rgba(54,226,123,0.16)] px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)] md:inline-flex">
            Book Now
          </RouterLink>

          <!-- Notification Bell (only when logged in) -->
          <div v-if="isLoggedIn" class="relative" ref="notifTriggerRef">
            <button
              type="button"
              @click="toggleNotifPanel"
              class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.55)] text-white/80 transition hover:text-white"
              aria-label="Notifications"
            >
              <span class="material-symbols-outlined text-xl">notifications</span>
              <span
                v-if="unreadNotifCount > 0"
                class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#36E27B] text-[9px] font-bold text-black leading-none"
              >{{ unreadNotifCount > 9 ? '9+' : unreadNotifCount }}</span>
            </button>

            <!-- Mobile backdrop -->
            <transition name="fade">
              <div
                v-if="notifPanelOpen"
                class="fixed inset-0 z-40 bg-black/50 md:hidden"
                @click="notifPanelOpen = false"
              ></div>
            </transition>

            <transition name="notif-drop">
              <div
                v-if="notifPanelOpen"
                ref="notifDropdownRef"
                class="
                  fixed left-0 right-0 z-50 rounded-t-3xl
                  md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2 md:w-96 md:rounded-2xl
                  overflow-hidden border border-white/10
                  bg-gradient-to-b from-[#1A1F2C]/98 to-[#0F172A]/98
                  shadow-2xl shadow-black/40 backdrop-blur-xl
                "
              >
                <!-- Mobile drag handle -->
                <div class="flex justify-center pt-3 pb-1 md:hidden">
                  <div class="h-1 w-10 rounded-full bg-white/20"></div>
                </div>

                <!-- Header -->
                <div class="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-[#36E27B]/5">
                  <h3 class="flex items-center gap-2 text-sm font-semibold text-white">
                    <span class="material-symbols-outlined text-[16px] text-[#36E27B]">notifications_active</span>
                    Reservation Updates
                    <span v-if="unreadNotifCount > 0" class="rounded-full bg-[#36E27B] px-1.5 py-0.5 text-[9px] font-bold text-black">{{ unreadNotifCount }}</span>
                  </h3>
                  <div class="flex items-center gap-2">
                    <button v-if="unreadNotifCount > 0" @click="markAllNotifRead" class="text-xs text-[#36E27B] hover:underline">Mark all read</button>
                    <button @click="fetchNotifications" :disabled="notifLoading" class="text-white/50 hover:text-white transition">
                      <span class="material-symbols-outlined text-[16px]" :class="{ 'animate-spin': notifLoading }">refresh</span>
                    </button>
                    <button @click="notifPanelOpen = false" class="text-white/40 hover:text-white transition md:hidden">
                      <span class="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>

                <!-- List -->
                <div class="max-h-[60vh] md:max-h-80 overflow-y-auto">
                  <div v-if="notifLoading" class="flex flex-col items-center gap-2 p-8 text-center text-sm text-white/50">
                    <span class="material-symbols-outlined animate-spin text-2xl text-[#36E27B]">progress_activity</span>
                    Loading updates...
                  </div>
                  <div v-else-if="guestNotifications.length === 0" class="flex flex-col items-center gap-3 p-8 text-center">
                    <span class="material-symbols-outlined text-4xl text-white/20">mark_email_read</span>
                    <p class="text-sm font-medium text-white/60">No updates yet</p>
                    <p class="text-xs text-white/40">You'll see reservation status changes here.</p>
                  </div>
                  <ul v-else class="divide-y divide-white/5">
                    <li
                      v-for="notif in guestNotifications"
                      :key="notif.id"
                      @click="openChat(notif)"
                      class="flex gap-3 px-4 py-3.5 transition-colors hover:bg-white/5 cursor-pointer"
                      :class="{ 'bg-[#36E27B]/5': !notif._read }"
                    >
                      <!-- Icon -->
                      <div class="mt-0.5 flex-shrink-0">
                        <div v-if="notif.type === 'reservation'" class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#36E27B]/10">
                          <span class="material-symbols-outlined text-[16px] text-[#36E27B]">calendar_add_on</span>
                        </div>
                        <div v-else-if="notif.type === 'status_update'" class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                          <span class="material-symbols-outlined text-[16px] text-blue-400">update</span>
                        </div>
                        <div v-else class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                          <span class="material-symbols-outlined text-[16px] text-red-400">cancel</span>
                        </div>
                      </div>
                      <!-- Content -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2">
                          <p class="text-sm font-medium text-white leading-snug">{{ notif.title }}</p>
                          <span v-if="!notif._read" class="mt-1.5 flex-shrink-0 h-2 w-2 rounded-full bg-[#36E27B]"></span>
                        </div>
                        <p class="mt-0.5 text-xs text-white/45">{{ relativeNotifTime(notif.created_at) }}</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <!-- Mobile safe-area padding -->
                <div class="h-safe-bottom md:hidden pb-2"></div>
              </div>
            </transition>
          </div>

          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.55)] text-white/80 transition hover:text-white md:hidden"
            aria-label="Open menu" @click="open = true">
            <span class="material-symbols-outlined">menu</span>
          </button>

          <!-- Account Profile -->
          <div class="relative cursor-pointer" @mouseenter="isAccountMenuHover = true" @mouseleave="isAccountMenuHover = false">
            <div class="relative" @click="toggleAccountMenu">
              <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#36E27B]/20 to-[#36E27B]/5 ring-1 ring-white/30">
                <img v-if="isLoggedIn && customerImageUrl" :src="customerImageUrl" alt="Customer" class="h-full w-full object-cover" />
                <span v-else class="material-symbols-outlined text-[#36E27B]">person</span>
              </div>
              <div class="absolute -bottom-0 -right-0 h-3 w-3 rounded-full border-2 border-[#1A1F2C] bg-[#36E27B]"></div>
            </div>

            <div
              v-if="isAccountMenuOpen || isAccountMenuHover"
              class="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1A1F2C]/95 to-[#0F172A]/95 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300"
              :class="isAccountMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
            >
              <div class="border-b border-white/10 p-5 bg-gradient-to-r from-[#36E27B]/5 via-transparent to-transparent">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <div class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#36E27B]/20 to-[#36E27B]/5 ring-1 ring-white/20">
                      <img v-if="isLoggedIn && customerImageUrl" :src="customerImageUrl" alt="Customer" class="h-full w-full object-cover" />
                      <span v-else class="material-symbols-outlined text-3xl text-[#36E27B]">person</span>
                    </div>
                    <div class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#1A1F2C] bg-[#36E27B]"></div>
                  </div>
                  <div class="flex-1 overflow-hidden">
                    <p class="truncate text-lg font-semibold text-white">{{ isLoggedIn ? customerName : 'Welcome Guest' }}</p>
                    <p class="truncate text-sm text-white/60">{{ isLoggedIn ? customerEmail : 'Sign in to manage bookings' }}</p>
                  </div>
                </div>
              </div>

              <div class="p-2 space-y-1">
                <RouterLink v-if="isLoggedIn" to="/history-booking"
                  class="group flex w-full items-center gap-3 rounded-xl p-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  @click="closeAccountMenu">
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#36E27B]/10">
                    <span class="material-symbols-outlined text-[#36E27B] text-lg">receipt_long</span>
                  </div>
                  <div class="flex-1"><span class="font-medium">History</span></div>
                </RouterLink>

                <RouterLink v-if="!isLoggedIn" to="/login"
                  class="group flex w-full items-center gap-3 rounded-xl p-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  @click="closeAccountMenu">
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#36E27B]/10">
                    <span class="material-symbols-outlined text-[#36E27B] text-lg">login</span>
                  </div>
                  <div class="flex-1"><span class="font-medium">Sign In</span></div>
                </RouterLink>

                <RouterLink v-if="!isLoggedIn" to="/signup"
                  class="group flex w-full items-center gap-3 rounded-xl p-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  @click="closeAccountMenu">
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#36E27B]/10">
                    <span class="material-symbols-outlined text-[#36E27B] text-lg">person_add</span>
                  </div>
                  <div class="flex-1"><span class="font-medium">Sign Up</span></div>
                </RouterLink>

                <button v-if="isLoggedIn"
                  class="group flex text-left w-full items-center gap-3 rounded-xl p-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  @click="logout">
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                    <span class="material-symbols-outlined text-red-500 text-lg">logout</span>
                  </div>
                  <div class="flex-1"><span class="font-medium">Sign Out</span></div>
                </button>
              </div>

              <div class="border-t border-white/10 bg-white/5 p-3">
                <div class="text-center">
                  <p class="text-xs text-white/50">Need help? <a href="https://t.me/PHANG_VIPHATH" class="text-[#36E27B] hover:underline">Contact Support</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/60" @click="open = false" />
        <div class="absolute right-0 top-0 h-full w-[50%] max-w-sm border-l border-[color:var(--color-surface-border)] bg-[color:rgba(13,24,17,0.92)] p-5 backdrop-blur">
          <div class="flex items-center justify-between">
            <div class="flex min-w-0 items-center gap-3">
              <img src="@/assets/Hotel_icon.png" alt="Hotel" class="h-9 w-9" />
              <div class="min-w-0">
                <div class="truncate text-sm font-semibold">Battambang Hotel</div>
                <div class="text-xs text-white/60">Luxury, calm, modern</div>
              </div>
            </div>
          </div>
          <RouterLink to="/booking"
            class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] px-4 py-3 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]"
            @click="open = false">
            Book Now
          </RouterLink>
          <div class="mt-6 grid gap-2">
            <RouterLink v-for="item in mobileItems" :key="item.to" :to="item.to"
              class="flex items-center justify-between rounded-xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.55)] px-4 py-3 text-sm text-white/85 transition hover:text-white"
              @click="open = false">
              <span>{{ item.label }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </transition>
  </header>

  <!-- ===== CHAT MODAL ===== -->
  <transition name="chat-modal">
    <div v-if="chatOpen" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4" @click.self="closeChat">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeChat"></div>

      <!-- Chat window -->
      <div class="relative w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-b from-[#1A1F2C] to-[#0D1811] shadow-2xl shadow-black/60 overflow-hidden flex flex-col" style="max-height: 80vh;">
        <!-- Chat header -->
        <div class="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#36E27B]/5 flex-shrink-0">
          <div class="relative flex-shrink-0">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#36E27B]/30 to-[#36E27B]/10 ring-1 ring-[#36E27B]/30">
              <img src="@/assets/Hotel_icon.png" alt="Hotel Bot" class="h-6 w-6" />
            </div>
            <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#36E27B] border-2 border-[#1A1F2C]"></span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white">Battambang Hotel Bot</p>
            <p class="text-xs text-[#36E27B]">● Online</p>
          </div>
          <button @click="closeChat" class="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Chat body -->
        <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <!-- Date divider -->
          <div class="flex items-center gap-2">
            <div class="flex-1 h-px bg-white/10"></div>
            <span class="text-[10px] text-white/30 px-2">{{ chatDate }}</span>
            <div class="flex-1 h-px bg-white/10"></div>
          </div>

          <!-- Bot message bubble -->
          <div class="flex gap-2 items-end">
            <div class="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#36E27B]/10 ring-1 ring-[#36E27B]/20">
              <img src="@/assets/Hotel_icon.png" alt="Bot" class="h-4 w-4" />
            </div>
            <div class="max-w-[85%]">
              <div class="rounded-2xl rounded-bl-sm bg-[#1e2d22] border border-[#36E27B]/10 px-4 py-3 shadow-lg">
                <pre class="text-sm text-white/90 whitespace-pre-wrap font-sans leading-relaxed">{{ chatMessage?.body }}</pre>
              </div>
              <p class="mt-1 text-[10px] text-white/30 pl-1">{{ chatTime }}</p>
            </div>
          </div>
        </div>

        <!-- Chat footer -->
        <div class="flex-shrink-0 border-t border-white/10 px-4 py-3 bg-[#0D1811]/60">
          <div class="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span class="material-symbols-outlined text-white/30 text-[18px]">lock</span>
            <span class="flex-1 text-xs text-white/30">This is an automated message from the hotel</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <!-- ===== END CHAT MODAL ===== -->

  <main class="flex-1 pt-20">
    <slot />
  </main>

  <footer class="mt-auto border-t border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.8)] backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-[color:rgba(54,226,123,0.1)] p-2">
            <img src="@/assets/Hotel_icon.png" alt="Hotel" class="h-5 w-5" />
          </div>
          <div>
            <div class="text-sm font-semibold">Battambang Hotel</div>
            <div class="text-xs text-white/60">Resort calm. Business ready.</div>
          </div>
        </div>
        <div class="text-center text-xs text-white/60 sm:text-right">
          © {{ new Date().getFullYear() }} Battambang Hotel. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'

const NavLink = {
  props: {
    to: { type: String, required: true },
    label: { type: String, required: true },
  },
  template: `
    <RouterLink
      :to="to"
      class="rounded-xl px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
      active-class="bg-white/5 text-white"
      exact-active-class="bg-white/5 text-white"
    >
      {{ label }}
    </RouterLink>
  `,
}
</script>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/util/request'
import { useGuestStore } from '@/stores/guest'

const open = ref(false)
const menuOpen = ref(false)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }

const menuItems = [
  { to: '/amenities', label: 'Amenities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const mobileItems = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Rooms & Suites' },
  ...menuItems,
]

const router = useRouter()
const route = useRoute()
const guestStore = useGuestStore()

const isLoggedIn = computed(() => guestStore.isLoggedIn)
const customerName = computed(() => guestStore.name)
const customerEmail = computed(() => guestStore.email)
const customerImageUrl = computed(() => guestStore.imageUrl)

const isAccountMenuOpen = ref(false)
const isAccountMenuHover = ref(false)

const toggleAccountMenu = () => { isAccountMenuOpen.value = !isAccountMenuOpen.value }
const closeAccountMenu = () => {
  isAccountMenuOpen.value = false
  isAccountMenuHover.value = false
}
const logout = () => {
  guestStore.clear()
  closeAccountMenu()
  router.push('/')
}

// ==================== NOTIFICATIONS ====================
const notifPanelOpen = ref(false)
const notifTriggerRef = ref(null)
const notifDropdownRef = ref(null)
const guestNotifications = ref([])
const notifLoading = ref(false)

const unreadNotifCount = computed(() => guestNotifications.value.filter(n => !n._read).length)

const relativeNotifTime = (dateStr) => {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(dateStr).toLocaleDateString()
}

const NOTIF_READ_KEY = 'notif_read_ids'
const getReadSet = () => {
  try {
    const raw = sessionStorage.getItem(NOTIF_READ_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch { return new Set() }
}
const saveReadSet = (set) => {
  try { sessionStorage.setItem(NOTIF_READ_KEY, JSON.stringify([...set])) } catch {}
}

const fetchNotifications = async () => {
  if (!guestStore.guest?.id) return
  notifLoading.value = true
  try {
    const history = await request('/public/reservations/history', 'GET', { guest_id: guestStore.guest.id })
    if (!Array.isArray(history) || history.length === 0) {
      guestNotifications.value = []
      return
    }
    const ids = history.map(r => r.id).join(',')
    const data = await request('/public/notifications', 'GET', { reservation_ids: ids })
    const readSet = getReadSet()
    guestNotifications.value = Array.isArray(data)
      ? data.map(n => ({ ...n, _read: readSet.has(String(n.id)) }))
      : []
  } catch (e) {
    console.warn('Failed to fetch notifications:', e)
  } finally {
    notifLoading.value = false
  }
}

const markAllNotifRead = () => {
  const set = getReadSet()
  guestNotifications.value.forEach(n => {
    n._read = true
    set.add(String(n.id))
  })
  saveReadSet(set)
}

const toggleNotifPanel = async () => {
  notifPanelOpen.value = !notifPanelOpen.value
  if (notifPanelOpen.value) {
    isAccountMenuOpen.value = false
    await fetchNotifications()
  }
}

const handleClickOutside = (e) => {
  if (
    notifPanelOpen.value &&
    notifDropdownRef.value &&
    !notifDropdownRef.value.contains(e.target) &&
    notifTriggerRef.value &&
    !notifTriggerRef.value.contains(e.target)
  ) {
    notifPanelOpen.value = false
  }
}

// ==================== CHAT MODAL ====================
const chatOpen = ref(false)
const chatMessage = ref(null)

const chatDate = computed(() => {
  if (!chatMessage.value?.created_at) return ''
  return new Date(chatMessage.value.created_at).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
})

const chatTime = computed(() => {
  if (!chatMessage.value?.created_at) return ''
  return new Date(chatMessage.value.created_at).toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit'
  })
})

const openChat = (notif) => {
  chatMessage.value = notif
  chatOpen.value = true
  notifPanelOpen.value = false
  // Mark as read
  if (!notif._read) {
    notif._read = true
    const set = getReadSet()
    set.add(String(notif.id))
    saveReadSet(set)
  }
}

const closeChat = () => {
  chatOpen.value = false
  chatMessage.value = null
}
// ==================== END CHAT MODAL ====================

let notifInterval = null
const startPolling = () => {
  if (notifInterval) return
  fetchNotifications()
  notifInterval = setInterval(fetchNotifications, 30000)
}
const stopPolling = () => {
  if (notifInterval) { clearInterval(notifInterval); notifInterval = null }
}
// ==================== END NOTIFICATIONS ====================

onMounted(() => {
  guestStore.hydrate()
  document.addEventListener('click', handleClickOutside)
  if (guestStore.isLoggedIn) startPolling()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  stopPolling()
})

watch(() => route.fullPath, () => {
  menuOpen.value = false
  closeAccountMenu()
})

watch(() => guestStore.isLoggedIn, (loggedIn) => {
  if (loggedIn) startPolling()
  else { stopPolling(); guestNotifications.value = [] }
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
.notif-drop-enter-active,
.notif-drop-leave-active {
  transition: opacity 250ms ease, transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
}
.notif-drop-enter-from,
.notif-drop-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
@media (min-width: 768px) {
  .notif-drop-enter-from,
  .notif-drop-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }
}

.chat-modal-enter-active,
.chat-modal-leave-active {
  transition: opacity 200ms ease;
}
.chat-modal-enter-active .relative,
.chat-modal-leave-active .relative {
  transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease;
}
.chat-modal-enter-from,
.chat-modal-leave-to {
  opacity: 0;
}
.chat-modal-enter-from .relative,
.chat-modal-leave-to .relative {
  opacity: 0;
  transform: translateY(32px) scale(0.95);
}
</style>
