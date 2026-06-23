<template>
  <div class="min-h-[calc(100vh-80px)] relative overflow-hidden bg-gray-50 dark:bg-[#0b0b0f] text-gray-900 dark:text-gray-100 font-display transition-colors duration-300">
    <!-- Ambient Background Glows -->
    <div class="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

    <div class="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      
      <!-- Header Area -->
      <div class="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 mb-4 ring-1 ring-green-500/20">
            <span class="material-symbols-outlined text-[14px]">history</span>
            Your Activity
          </div>
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Booking <span class="bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">History</span>
          </h1>
          <p class="mt-4 text-base text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
            Manage your past and upcoming stays. Download invoices, check statuses, and review your room details all in one place.
          </p>
        </div>
      </div>

      <!-- State: Not Logged In -->
      <div v-if="!isLoggedIn" class="relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-10 text-center shadow-xl">
        <span class="material-symbols-outlined text-[48px] text-gray-400 mb-4">lock</span>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Authentication Required</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Please securely log in to access your personal reservation history and invoices.</p>
        <RouterLink
          to="/login"
          class="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-8 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:scale-105 hover:shadow-green-500/40"
        >
          <span class="material-symbols-outlined text-[18px]">login</span>
          Sign In to Continue
        </RouterLink>
      </div>

      <div v-else class="relative z-10">
        
        <!-- State: Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
           <span class="material-symbols-outlined animate-spin text-4xl text-green-500">progress_activity</span>
           <p class="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">Loading your beautiful stays...</p>
        </div>

        <!-- State: Error -->
        <div v-else-if="error" class="rounded-[2rem] border border-red-500/20 bg-red-50 dark:bg-red-500/10 p-8 text-center backdrop-blur-md">
          <span class="material-symbols-outlined text-[40px] text-red-500 mb-3">error</span>
          <h3 class="text-lg font-semibold text-red-700 dark:text-red-400">Oops, something went wrong</h3>
          <p class="mt-2 text-sm text-red-600 dark:text-red-300">{{ error }}</p>
        </div>

        <!-- State: Empty -->
        <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-16 text-center shadow-lg">
          <div class="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
            <span class="material-symbols-outlined text-[40px] text-gray-400">luggage</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">No Reservations Yet</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Looks like you haven't booked any stays with us yet. When you do, they will appear right here.</p>
          <RouterLink
            to="/rooms"
            class="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gray-900 dark:bg-white px-8 text-sm font-semibold text-white dark:text-gray-900 shadow-md transition-all hover:scale-105 hover:shadow-lg"
          >
            Explore Rooms
          </RouterLink>
        </div>

        <!-- State: Loaded -->
        <div v-else class="grid gap-6">
          <div
            v-for="r in items"
            :key="r.id"
            class="group relative overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#1e293b]/60 p-6 sm:p-8 backdrop-blur-xl shadow-sm hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1"
          >
            <!-- Decorative accent line on hover -->
            <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-400 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

            <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              
              <!-- Left: Room & Dates -->
              <div class="flex-1 min-w-0 flex gap-5">
                <div class="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/50">
                  <span class="material-symbols-outlined text-[32px]">bed</span>
                </div>
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white truncate">{{ r.room?.name || 'Room' }}</h2>
                    <span 
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase"
                      :class="[
                        r.status?.toLowerCase() === 'confirmed' || r.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 ring-1 ring-green-600/20' : 
                        r.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 ring-1 ring-red-600/20' : 
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 ring-1 ring-yellow-600/20'
                      ]"
                    >
                      {{ r.status || 'Pending' }}
                    </span>
                  </div>
                  
                  <div class="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-gray-500 dark:text-gray-400 mt-3">
                    <div class="flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[18px]">calendar_month</span>
                      <span>{{ formatDate(r.check_in) }} <span class="mx-1">&rarr;</span> {{ formatDate(r.check_out) }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[18px]">receipt</span>
                      <span>Reservation #{{ r.id }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right: Price & Actions -->
              <div class="flex flex-col items-start lg:items-end gap-4 shrink-0 border-t border-gray-100 dark:border-gray-800 lg:border-t-0 pt-5 lg:pt-0">
                <div class="text-left lg:text-right">
                  <p class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                  <div class="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                    ${{ Number(r.total || 0).toFixed(2) }}
                  </div>
                </div>
                <button
                  type="button"
                  class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-transparent px-6 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-all hover:bg-white dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-sm active:scale-95"
                  @click="printInvoice(r)"
                >
                  <span class="material-symbols-outlined text-[18px]">print</span>
                  Print Invoice
                </button>
              </div>
            </div>

            <!-- Details Footer -->
            <div class="mt-6 flex flex-wrap items-center gap-5 rounded-xl bg-gray-50/50 dark:bg-black/20 p-4 text-sm border border-gray-100 dark:border-white/5">
              <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span class="material-symbols-outlined text-[18px]">category</span>
                <span>Room Type: <strong class="text-gray-900 dark:text-white font-medium">{{ r.room?.type || 'N/A' }}</strong></span>
              </div>
              <div class="hidden sm:block h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
              <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span class="material-symbols-outlined text-[18px]">payments</span>
                <span>Rate per night: <strong class="text-gray-900 dark:text-white font-medium">${{ Number(r.room?.price || 0).toFixed(2) }}</strong></span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import apiClient from '@/util/client'
import { formatDate } from '@/util/helpers'
import { useGuestStore } from '@/stores/guest'

const toast = getCurrentInstance()?.appContext.config.globalProperties.$toast
const guestStore = useGuestStore()

const loading = ref(false)
const error = ref('')
const items = ref([])

const isLoggedIn = computed(() => guestStore.isLoggedIn)

const printInvoice = (r) => {
  if (!r?.id) return

  const roomName = r.room?.name || 'Room'
  const roomType = r.room?.type || ''
  const priceNight = Number(r.room?.price || 0)
  const total = Number(r.total || 0)
  const checkIn = r.check_in ? formatDate(r.check_in) : ''
  const checkOut = r.check_out ? formatDate(r.check_out) : ''
  const status = r.status || 'Pending'
  const guestName = guestStore.guest?.name || 'Valued Guest'
  const guestEmail = guestStore.guest?.email || ''
  const todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Invoice #${r.id}</title>
      <style>
        :root {
          --primary-color: #111827;
          --secondary-color: #4b5563;
          --border-color: #e5e7eb;
          --accent-color: #059669; /* Elegant green accent */
        }
        * { box-sizing: border-box; }
        body { 
          font-family: 'Helvetica Neue', 'Inter', Helvetica, Arial, sans-serif; 
          margin: 0; 
          padding: 40px; 
          color: var(--primary-color);
          background-color: #fff;
          -webkit-font-smoothing: antialiased;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 2px solid var(--primary-color);
          padding-bottom: 24px;
          margin-bottom: 32px;
        }
        .header h1 {
          margin: 0;
          font-size: 36px;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .hotel-info {
          text-align: right;
          color: var(--secondary-color);
          font-size: 14px;
          line-height: 1.5;
        }
        .hotel-info h2 {
          margin: 0 0 4px 0;
          color: var(--primary-color);
          font-size: 18px;
          font-weight: 600;
        }
        .meta-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .meta-section h3 {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--secondary-color);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .meta-section p {
          margin: 4px 0;
          font-size: 15px;
          line-height: 1.6;
        }
        .status-badge {
          display: inline-block;
          margin-top: 8px;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          background-color: #f3f4f6;
          color: var(--secondary-color);
        }
        .status-badge.paid, .status-badge.confirmed { background-color: #def7ec; color: var(--accent-color); }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
        }
        th {
          background-color: #f9fafb;
          text-align: left;
          padding: 14px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--secondary-color);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }
        td {
          padding: 16px 14px;
          border-bottom: 1px solid var(--border-color);
          font-size: 15px;
        }
        .text-right { text-align: right; }
        .summary-section {
          display: flex;
          justify-content: flex-end;
        }
        .totals-box {
          width: 300px;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 15px;
          color: var(--secondary-color);
        }
        .totals-row.grand-total {
          color: var(--primary-color);
          font-size: 20px;
          font-weight: bold;
          border-top: 2px solid var(--primary-color);
          padding-top: 14px;
          margin-top: 4px;
        }
        .footer {
          margin-top: 60px;
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
          color: var(--secondary-color);
          font-size: 13px;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <header class="header">
          <h1>Invoice</h1>
          <div class="hotel-info">
            <h2>Battambang Hotel</h2>
            <p>03 Battambang, Cambodia</p>
          </div>
        </header>

        <div class="meta-details">
          <div class="meta-section">
            <h3>Billed To</h3>
            <p><strong>${guestName}</strong></p>
            ${guestEmail ? `<p>${guestEmail}</p>` : ''}
          </div>
          <div class="meta-section">
            <h3>Reservation Details</h3>
            <p><strong>Invoice No:</strong> #${r.id}</p>
            <p><strong>Date Issued:</strong> ${todayDate}</p>
            <p><strong>Check-in:</strong> ${checkIn}</p>
            <p><strong>Check-out:</strong> ${checkOut}</p>
            <div class="status-badge ${status.toLowerCase()}">${status}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Rate / Night</th>
              <th class="text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${roomName}</strong>
                ${roomType ? `<br><span style="color: #6b7280; font-size: 13px;">Room Type: ${roomType}</span>` : ''}
              </td>
              <td class="text-right">$${priceNight.toFixed(2)}</td>
              <td class="text-right">$${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="summary-section">
          <div class="totals-box">
            <div class="totals-row">
              <span>Subtotal</span>
              <span>$${total.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>Taxes & Fees</span>
              <span>Included</span>
            </div>
            <div class="totals-row grand-total">
              <span>Total Balance</span>
              <span>$${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <footer class="footer">
          <p>Thank you for choosing battambang hotel. We hope you enjoyed your visit!</p>
          <p style="margin-top: 8px; font-size: 12px; color: #9ca3af;">If you have any questions about this invoice, please contact +855 963612863</p>
        </footer>
      </div>
    </body>
  </html>`

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.setAttribute('aria-hidden', 'true')
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc || !iframe.contentWindow) {
    iframe.remove()
    toast?.error('Failed to open print preview.')
    return
  }

  doc.open()
  doc.write(html)
  doc.close()

  const cleanup = () => {
    try {
      iframe.remove()
    } catch {
      // ignore
    }
  }

  iframe.onload = () => {
    try {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
    } finally {
      setTimeout(cleanup, 500)
    }
  }
}

const load = async () => {
  if (!guestStore.guest?.id) {
    items.value = []
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await apiClient.get('/public/reservations/history', { guest_id: guestStore.guest.id })
    items.value = Array.isArray(res) ? res : []
  } catch (e) {
    const msg = e?.response?.data?.message || 'Failed to load booking history.'
    error.value = msg
    toast?.error(msg)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  guestStore.hydrate()
  if (guestStore.isLoggedIn) load()
})

watch(
  () => guestStore.guest?.id,
  () => {
    if (guestStore.isLoggedIn) load()
  }
)
</script>