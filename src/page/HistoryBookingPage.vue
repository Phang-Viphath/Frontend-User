<template>
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 text-white">
    
    <!-- Header Area -->
    <div class="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-[color:rgba(54,226,123,0.1)] px-3 py-1 text-xs font-medium text-[color:var(--color-primary)] mb-4 ring-1 ring-[color:rgba(54,226,123,0.2)]">
          <span class="material-symbols-outlined text-[14px]">history</span>
          Your Activity
        </div>
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Booking <span class="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">History</span>
        </h1>
        <p class="mt-4 text-base text-white/65 max-w-xl leading-relaxed">
          Manage your past and upcoming stays. Download invoices, check statuses, and review your room details all in one place.
        </p>
      </div>
    </div>

    <!-- State: Not Logged In -->
    <div v-if="!isLoggedIn" class="relative overflow-hidden rounded-[2rem] bg-[color:rgba(17,33,23,0.6)] border border-[color:var(--color-surface-border)] backdrop-blur-xl p-10 text-center shadow-xl">
      <span class="material-symbols-outlined text-[48px] text-white/40 mb-4">lock</span>
      <h3 class="text-xl font-semibold text-white">Authentication Required</h3>
      <p class="mt-2 text-sm text-white/65 max-w-sm mx-auto">Please securely log in to access your personal reservation history and invoices.</p>
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
         <span class="material-symbols-outlined animate-spin text-4xl text-[color:var(--color-primary)]">progress_activity</span>
         <p class="mt-4 text-sm font-medium text-white/65 animate-pulse">Loading your beautiful stays...</p>
      </div>

      <!-- State: Error -->
      <div v-else-if="error" class="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-8 text-center backdrop-blur-md">
        <span class="material-symbols-outlined text-[40px] text-red-500 mb-3">error</span>
        <h3 class="text-lg font-semibold text-red-400">Oops, something went wrong</h3>
        <p class="mt-2 text-sm text-red-300">{{ error }}</p>
      </div>

      <!-- State: Empty -->
      <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center rounded-[2rem] border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] backdrop-blur-xl p-16 text-center shadow-lg">
        <div class="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-[40px] text-white/40">luggage</span>
        </div>
        <h3 class="text-xl font-semibold text-white">No Reservations Yet</h3>
        <p class="mt-2 text-sm text-white/65 max-w-sm mx-auto">Looks like you haven't booked any stays with us yet. When you do, they will appear right here.</p>
        <RouterLink
          to="/rooms"
          class="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-sm font-semibold text-gray-900 shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          Explore Rooms
        </RouterLink>
      </div>

      <!-- State: Loaded -->
      <div v-else class="grid gap-6">
        <div
          v-for="r in items"
          :key="r.id"
          class="group relative overflow-hidden rounded-[2rem] border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6 sm:p-8 backdrop-blur-xl shadow-sm hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Decorative accent line on hover -->
          <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-400 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            
            <!-- Left: Room & Dates -->
            <div class="flex-1 min-w-0 flex gap-5">
              <div class="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[color:rgba(54,226,123,0.1)] text-[color:var(--color-primary)] border border-[color:rgba(54,226,123,0.2)]">
                <span class="material-symbols-outlined text-[32px]">bed</span>
              </div>
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <h2 class="text-xl font-bold text-white truncate">{{ r.room?.name || 'Room' }}</h2>
                  <span 
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase"
                    :class="[
                      r.status?.toLowerCase() === 'confirmed' || r.status?.toLowerCase() === 'paid' ? 'bg-[color:rgba(54,226,123,0.15)] text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.3)]' : 
                      r.status?.toLowerCase() === 'cancelled' ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30' : 
                      'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30'
                    ]"
                  >
                    {{ r.status || 'Pending' }}
                  </span>
                </div>
                
                <div class="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-white/65 mt-3">
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
            <div class="flex flex-col items-start lg:items-end gap-4 shrink-0 border-t border-white/10 lg:border-t-0 pt-5 lg:pt-0">
              <div class="text-left lg:text-right">
                <p class="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Total Amount</p>
                <div class="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  ${{ Number(r.total || 0).toFixed(2) }}
                </div>
              </div>
              <button
                type="button"
                class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white/90 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-sm active:scale-95"
                @click="printInvoice(r)"
              >
                <span class="material-symbols-outlined text-[18px]">print</span>
                Print Invoice
              </button>
            </div>
          </div>

          <!-- Details Footer -->
          <div class="mt-6 flex flex-wrap items-center gap-5 rounded-xl bg-black/20 p-4 text-sm border border-white/5">
            <div class="flex items-center gap-2 text-white/65">
              <span class="material-symbols-outlined text-[18px]">category</span>
              <span>Room Type: <strong class="text-white font-medium">{{ r.room?.type || 'N/A' }}</strong></span>
            </div>
            <div class="hidden sm:block h-4 w-px bg-white/10"></div>
            <div class="flex items-center gap-2 text-white/65">
              <span class="material-symbols-outlined text-[18px]">payments</span>
              <span>Rate per night: <strong class="text-white font-medium">${{ Number(r.room?.price || 0).toFixed(2) }}</strong></span>
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

import hotelIcon from '@/assets/Hotel_icon.png'
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

  const contentHtml = `
    <div class="invoice-wrapper">
      <header class="header">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${hotelIcon}" alt="Battambang Hotel Logo" style="height: 50px; width: auto; object-fit: contain;" />
          <h1 style="margin: 0; line-height: 1;">Invoice</h1>
        </div>
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
  `

  let printContainer = document.getElementById('invoice-print-container')
  if (!printContainer) {
    printContainer = document.createElement('div')
    printContainer.id = 'invoice-print-container'
    document.body.appendChild(printContainer)
  }

  let printStyle = document.getElementById('invoice-print-style')
  if (!printStyle) {
    printStyle = document.createElement('style')
    printStyle.id = 'invoice-print-style'
    printStyle.innerHTML = `
      @media screen {
        #invoice-print-container {
          display: none !important;
        }
      }
      @media print {
        body > *:not(#invoice-print-container) {
          display: none !important;
        }
        body {
          background-color: white !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        #invoice-print-container {
          display: block !important;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background: white;
        }
        #invoice-print-container * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .invoice-wrapper {
          --primary-color: #111827;
          --secondary-color: #4b5563;
          --border-color: #e5e7eb;
          --accent-color: #059669;
          font-family: 'Helvetica Neue', 'Inter', Helvetica, Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          color: var(--primary-color);
          background-color: #fff;
        }
        .invoice-wrapper .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 2px solid var(--primary-color);
          padding-bottom: 24px;
          margin-bottom: 32px;
        }
        .invoice-wrapper .header h1 {
          margin: 0;
          font-size: 36px;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .invoice-wrapper .hotel-info {
          text-align: right;
          color: var(--secondary-color);
          font-size: 14px;
          line-height: 1.5;
        }
        .invoice-wrapper .hotel-info h2 {
          margin: 0 0 4px 0;
          color: var(--primary-color);
          font-size: 18px;
          font-weight: 600;
        }
        .invoice-wrapper .meta-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .invoice-wrapper .meta-section h3 {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--secondary-color);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .invoice-wrapper .meta-section p {
          margin: 4px 0;
          font-size: 15px;
          line-height: 1.6;
        }
        .invoice-wrapper .status-badge {
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
        .invoice-wrapper .status-badge.paid, 
        .invoice-wrapper .status-badge.confirmed { 
          background-color: #def7ec; 
          color: var(--accent-color); 
        }
        .invoice-wrapper table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
        }
        .invoice-wrapper th {
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
        .invoice-wrapper td {
          padding: 16px 14px;
          border-bottom: 1px solid var(--border-color);
          font-size: 15px;
        }
        .invoice-wrapper .text-right { text-align: right; }
        .invoice-wrapper .summary-section {
          display: flex;
          justify-content: flex-end;
        }
        .invoice-wrapper .totals-box {
          width: 300px;
        }
        .invoice-wrapper .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 15px;
          color: var(--secondary-color);
        }
        .invoice-wrapper .totals-row.grand-total {
          color: var(--primary-color);
          font-size: 20px;
          font-weight: bold;
          border-top: 2px solid var(--primary-color);
          padding-top: 14px;
          margin-top: 4px;
        }
        .invoice-wrapper .footer {
          margin-top: 60px;
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
          color: var(--secondary-color);
          font-size: 13px;
        }
      }
    `
    document.head.appendChild(printStyle)
  }

  printContainer.innerHTML = contentHtml

  setTimeout(() => {
    window.print()
    setTimeout(() => {
      printContainer.innerHTML = ''
    }, 1000)
  }, 150)
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