<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold tracking-tight">Gallery</h1>
      <p class="text-sm text-white/65">High-quality moments: rooms, lobby, dining, and views.</p>
    </div>

    <div class="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <figure
        v-for="(img, idx) in images"
        :key="img.src"
        class="group overflow-hidden rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)]"
      >
        <div class="relative">
          <img :src="img.src" :alt="img.alt" class="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-90" />
          <div class="absolute bottom-4 left-4 right-4">
            <div class="text-sm font-semibold">{{ img.title }}</div>
            <div class="text-xs text-white/70">{{ img.alt }}</div>
          </div>
        </div>
      </figure>
    </div>

    <div class="mt-12 rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-7">
      <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div class="text-sm font-semibold">Want a tailored stay?</div>
          <div class="mt-1 text-sm text-white/65">Book direct for the best rates and fast confirmation.</div>
        </div>
        <RouterLink
          to="/booking"
          class="mt-4 inline-flex items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] px-5 py-3 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)] md:mt-0"
        >
          Book Now
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import image1 from '../assets/gallery1.jpg'
import image2 from '../assets/gallery2.jpg'
import image3 from '../assets/gallery3.jpg'
import image4 from '../assets/gallery4.jpg'
import image5 from '../assets/gallery5.jpg'
import image6 from '../assets/gallery6.jpg'

const images = [
  {
    title: 'Luxury Room',
    alt: 'Warm lighting and premium bedding',
    src: image1,
  },
  {
    title: 'Lobby',
    alt: 'Clean and modern reception',
    src: image2,
  },
  {
    title: 'Dining',
    alt: 'Signature restaurant mood',
    src: image3,
  },
  {
    title: 'Pool',
    alt: 'Resort pool relaxation',
    src: image4,
  },
  {
    title: 'Suite',
    alt: 'Extra space and comfort',
    src: image5,
  },
  {
    title: 'Views',
    alt: 'City and riverside scenery',
    src: image6,
  },
]
</script>
