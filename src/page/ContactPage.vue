<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold tracking-tight">Location & Contact</h1>
      <p class="text-sm text-white/65">Find us quickly, message us easily, and book with confidence.</p>
    </div>

    <div class="mt-6 grid gap-8 lg:grid-cols-12">
      <div class="lg:col-span-7">
        <div class="overflow-hidden rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)]">
          <div class="aspect-[20/10]">
            <iframe
              title="Google Map"
              class="h-96 w-full"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Battambang%20Cambodia&output=embed"
            />
          </div>
          <div class="p-6">
            <div class="text-sm font-semibold">Battambang Hotel</div>
            <div class="mt-2 grid gap-2 text-sm text-white/65">
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[18px] text-[color:var(--color-primary)]">location_on</span>
                <span>City Center, Battambang, Cambodia</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[18px] text-[color:var(--color-primary)]">call</span>
                <span>+855 96 361 2863</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[18px] text-[color:var(--color-primary)]">mail</span>
                <span>hello@battambanghotel.com</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[18px] text-[color:var(--color-primary)]">chat</span>
                <span>WhatsApp: +855 96 361 2863</span>
              </div>
            </div>

            <RouterLink
              to="/booking"
              class="mt-6 inline-flex items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] px-5 py-3 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]"
            >
              Book Now
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
          <div class="text-sm font-semibold">Contact form</div>
          <p class="mt-2 text-sm text-white/65">Send a message and we’ll reply as soon as possible.</p>

          <form class="mt-6 grid gap-4" @submit.prevent="submit">
            <label class="grid gap-1">
              <span class="text-xs text-white/60">Full name</span>
              <input v-model.trim="form.name" class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
            </label>

            <label class="grid gap-1">
              <span class="text-xs text-white/60">Email</span>
              <input v-model.trim="form.email" type="email" class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
            </label>

            <label class="grid gap-1">
              <span class="text-xs text-white/60">Message</span>
              <textarea v-model.trim="form.message" rows="5" class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-white/25" />
            </label>

            <button
              type="submit"
              class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { RouterLink } from 'vue-router'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const submit = () => {
  const toast = getCurrentInstance()?.appContext.config.globalProperties.$toast
  toast?.success('Message sent (demo). We will contact you soon!')
  form.name = ''
  form.email = ''
  form.message = ''
}
</script>
