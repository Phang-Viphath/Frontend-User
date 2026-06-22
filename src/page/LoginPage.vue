<template>
  <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold tracking-tight">Login</h1>
      <p class="text-sm text-white/65">Sign in as a guest to manage bookings.</p>
    </div>

    <div class="mt-8">
      <LoginGuest />
    </div>
  </div>
</template>

<script setup>
import LoginGuest from '@/components/LoginGuest.vue'
</script>
