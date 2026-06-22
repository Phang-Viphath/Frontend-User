<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div class="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0b0b0f] p-6 text-white shadow-2xl">
      <div class="flex items-start gap-3">
        <span class="material-symbols-outlined text-[22px] text-[color:var(--color-primary)]">verified</span>
        <div>
          <div class="text-base font-semibold">{{ title }}</div>
          <div class="mt-1 text-xs text-white/60">{{ description }}</div>
        </div>
      </div>

      <div class="mt-5 grid gap-3">
        <button
          type="button"
          class="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/85 transition hover:bg-white/10"
          @click="goHistory"
        >
          Booking History
        </button>

        <button
          type="button"
          class="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/85 transition hover:bg-white/10"
          @click="close"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Payment Success' },
  description: { type: String, default: 'Your reservation has been confirmed.' },
})

const emit = defineEmits(['update:open', 'close'])

const router = useRouter()

const close = () => {
  emit('update:open', false)
  emit('close')
}

const goHistory = async () => {
  emit('update:open', false)
  emit('close')
  await router.push('/history-booking')
}
</script>
