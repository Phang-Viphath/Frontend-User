<template>
  <transition name="modal-fade">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" @click="close"></div>
      
      <!-- Modal Panel -->
      <div class="relative w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl p-8 text-left align-middle shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all ring-1 ring-white/20 dark:ring-white/10">
        
        <!-- Decorative Glows -->
        <div class="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-green-500/20 blur-[40px] pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-[40px] pointer-events-none"></div>

        <div class="relative flex flex-col items-center text-center">
          <!-- Animated Success Icon -->
          <div class="relative mb-6 mt-2">
            <!-- Ripple Effect -->
            <div class="absolute inset-0 animate-ping rounded-full bg-green-500/30"></div>
            <!-- Icon Circle -->
            <div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
              <span class="material-symbols-outlined text-[48px] text-white">verified</span>
            </div>
          </div>

          <!-- Text content -->
          <h3 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <p class="mb-8 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">
            {{ description }}
          </p>

          <!-- Buttons -->
          <div class="w-full space-y-3">
            <button
              type="button"
              class="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/40 active:scale-[0.98]"
              @click="goHistory"
            >
              <div class="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <span class="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110">receipt_long</span>
              Booking History
            </button>

            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 backdrop-blur-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white active:scale-[0.98]"
              @click="close"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
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

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .relative.transform,
.modal-fade-leave-active .relative.transform {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-fade-enter-from .relative.transform,
.modal-fade-leave-to .relative.transform {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
