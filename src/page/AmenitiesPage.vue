<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold tracking-tight">Amenities & Services</h1>
      <p class="text-sm text-white/65">Luxury essentials for wellness, work, and family comfort.</p>
    </div>

    <div class="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="a in amenities" :key="a.title"
        class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
        <div class="flex items-start gap-4">
          <div
            class="grid h-12 w-12 place-items-center rounded-2xl bg-[color:rgba(54,226,123,0.12)] ring-1 ring-[color:rgba(54,226,123,0.25)]">
            <span class="material-symbols-outlined text-[22px] text-[color:var(--color-primary)]">{{ a.icon }}</span>
          </div>
          <div>
            <div class="text-sm font-semibold">{{ a.title }}</div>
            <div class="mt-1 text-sm text-white/65">{{ a.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mt-8 overflow-hidden rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)]">
      <div class="grid gap-0 lg:grid-cols-2">
        <img class="h-64 w-full object-cover lg:h-90"
          src="@/assets/amenities.jpg"
          alt="Hotel amenities including spa and pool" loading="lazy" />
        <div class="p-7">
          <div class="text-sm font-semibold">Designed for calm and convenience</div>
          <p class="mt-3 text-sm leading-relaxed text-white/65">
            From morning workouts to sunset cocktails, every detail is curated to feel warm and premium.
            Our team focuses on smooth experiences — quick assistance, clean spaces, and a resort-like rhythm.
          </p>
          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <span class="material-symbols-outlined text-[18px] text-[color:var(--color-primary)]">schedule</span>
              <div>
                <div class="text-sm font-semibold">24/7 support</div>
                <div class="text-xs text-white/60">Always available for guests</div>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <span class="material-symbols-outlined text-[18px] text-[color:var(--color-primary)]">local_taxi</span>
              <div>
                <div class="text-sm font-semibold">Airport transfer</div>
                <div class="text-xs text-white/60">Easy pickup & drop-off</div>
              </div>
            </div>
          </div>
          <RouterLink to="/booking"
            class="mt-7 inline-flex items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] px-5 py-3 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]">
            Book Your Stay
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const amenities = [
  { icon: 'pool', title: 'Swimming pool', desc: 'A calm pool area for afternoon relaxation.' },
  { icon: 'spa', title: 'Spa', desc: 'Warm treatments and wellness rituals.' },
  { icon: 'fitness_center', title: 'Gym', desc: 'Modern equipment for a quick workout.' },
  { icon: 'restaurant', title: 'Restaurant', desc: 'Signature dishes with local inspiration.' },
  { icon: 'local_bar', title: 'Bar', desc: 'Cocktails and soft lighting in a premium lounge vibe.' },
  { icon: 'wifi', title: 'Wi‑Fi', desc: 'Fast and reliable internet throughout the hotel.' },
]
</script>
