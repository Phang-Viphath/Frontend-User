<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="grid gap-10 lg:grid-cols-12 lg:items-start">
      <div class="lg:col-span-6">
        <h1 class="text-3xl font-bold tracking-tight">About the Hotel</h1>
        <p class="mt-4 text-sm leading-relaxed text-white/65">
          Battambang Hotel is built on a simple promise: warm hospitality, calm luxury, and a modern experience that
          feels effortless.
          Whether you’re visiting for business or a family getaway, every space is designed to help you slow down and
          feel at home.
        </p>

        <div class="mt-9 grid gap-4">
          <div class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
            <div class="flex items-center gap-4">
              <div
                class="grid h-12 w-12 place-items-center rounded-2xl bg-[color:rgba(54,226,123,0.12)] ring-1 ring-[color:rgba(54,226,123,0.25)]">
                <span class="material-symbols-outlined text-[22px] text-[color:var(--color-primary)]">star</span>
              </div>
              <div class="text-sm font-semibold">Our mission</div>
            </div>
            <div class="mt-2 text-sm text-white/65">Deliver premium comfort with calm service and modern
              convenience.</div>
          </div>
          <div
            class="mt-6 rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
            <div class="flex items-center gap-4">
              <div
                class="grid h-12 w-12 place-items-center rounded-2xl bg-[color:rgba(54,226,123,0.12)] ring-1 ring-[color:rgba(54,226,123,0.25)]">
                <span class="material-symbols-outlined text-[22px] text-[color:var(--color-primary)]">favorite</span>
              </div>
              <div class="text-sm font-semibold">Hospitality values</div>
            </div>
            <div class="mt-2 text-sm text-white/65">Respect, cleanliness, safety, and thoughtful attention to
            </div>
          </div>
        </div>

        <div
          class="mt-9 rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
          <div class="flex items-center gap-4">
            <div
              class="grid h-12 w-12 place-items-center rounded-2xl bg-[color:rgba(54,226,123,0.12)] ring-1 ring-[color:rgba(54,226,123,0.25)]">
              <span class="material-symbols-outlined text-[22px] text-[color:var(--color-primary)]">verified</span>
            </div>
            <div class="text-sm font-semibold">Awards & certifications</div>
          </div>
          <div class="mt-3 text-sm text-white/65">Add your awards here (e.g., TripAdvisor Traveler’s Choice, safety
            certifications).</div>
        </div>
      </div>

      <div class="lg:col-span-6">
        <div
          class="overflow-hidden rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)]">
          <img src="@/assets/About.jpg"
            alt="Hotel atmosphere" class="h-64 w-full object-cover sm:h-80" loading="lazy" />
          <div class="p-7">
            <div class="text-sm font-semibold">A calm, luxury mood</div>
            <p class="mt-2 text-sm leading-relaxed text-white/65">
              Dark, warm materials. Soft borders. A clean layout. We combine a resort vibe with business-ready service.
              Expect smooth check-in, clear information, and a comfortable environment for every guest type.
            </p>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span class="material-symbols-outlined text-[18px] text-[color:var(--color-primary)]">groups</span>
                <div>
                  <div class="text-sm font-semibold">Family-friendly</div>
                  <div class="text-xs text-white/60">Suites, comfort, space</div>
                </div>
              </div>
              <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span
                  class="material-symbols-outlined text-[18px] text-[color:var(--color-primary)]">business_center</span>
                <div>
                  <div class="text-sm font-semibold">Business-ready</div>
                  <div class="text-xs text-white/60">Wi‑Fi, desk, quiet rooms</div>
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
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
