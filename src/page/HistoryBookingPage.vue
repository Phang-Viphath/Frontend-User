<template>
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold tracking-tight">Booking History</h1>
      <p class="text-sm text-white/65">View your reservations and stay details.</p>
    </div>

    <div v-if="!isLoggedIn" class="mt-8 rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
      <div class="text-sm font-semibold">You are not signed in</div>
      <p class="mt-2 text-sm text-white/65">Please login to view your booking history.</p>
      <RouterLink
        to="/login"
        class="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] px-5 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]"
      >
        Go to Login
      </RouterLink>
    </div>

    <div v-else class="mt-8">
      <div v-if="loading" class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6 text-sm text-white/70">
        Loading your bookings...
      </div>

      <div v-else-if="error" class="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
        {{ error }}
      </div>

      <div v-else-if="items.length === 0" class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6 text-sm text-white/70">
        No reservations found.
      </div>

      <div v-else class="grid gap-4">
        <div
          v-for="r in items"
          :key="r.id"
          class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <div class="text-sm font-semibold">{{ r.room?.name || 'Room' }}</div>
              <div class="mt-1 text-sm text-white/70">
                {{ formatDate(r.check_in) }} - {{ formatDate(r.check_out) }}
              </div>
              <div class="mt-1 text-xs text-white/60">Reservation #{{ r.id }}</div>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">{{ r.status || 'Pending' }}</span>
              <span class="text-sm font-semibold text-[color:var(--color-primary)]">${{ Number(r.total || 0).toFixed(2) }}</span>
              <button
                type="button"
                class="inline-flex h-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-white/85 transition hover:bg-white/10"
                @click="printInvoice(r)"
              >
                Print Invoice
              </button>
            </div>
          </div>

          <div v-if="r.room" class="mt-4 grid gap-2 text-sm text-white/70 sm:grid-cols-2">
            <div>Type: <span class="text-white/90">{{ r.room.type || 'N/A' }}</span></div>
            <div>Price/night: <span class="text-white/90">${{ Number(r.room.price || 0).toFixed(2) }}</span></div>
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