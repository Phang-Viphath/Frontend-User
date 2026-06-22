import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../page/HomePage.vue'
import RoomsPage from '../page/RoomsPage.vue'
import AmenitiesPage from '../page/AmenitiesPage.vue'
import GalleryPage from '../page/GalleryPage.vue'
import AboutPage from '../page/AboutPage.vue'
import ContactPage from '../page/ContactPage.vue'
import BookingPage from '../page/BookingPage.vue'
import LoginPage from '../page/LoginPage.vue'
import SignupPage from '../page/SignupPage.vue'
import HistoryBookingPage from '../page/HistoryBookingPage.vue'
import GoogleCallback from '../page/GoogleCallback.vue'
import NotFound from '../Error/NotFound.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/rooms', name: 'rooms', component: RoomsPage },
  { path: '/amenities', name: 'amenities', component: AmenitiesPage },
  { path: '/gallery', name: 'gallery', component: GalleryPage },
  { path: '/about', name: 'about', component: AboutPage },
  { path: '/contact', name: 'contact', component: ContactPage },
  { path: '/booking', name: 'booking', component: BookingPage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/signup', name: 'signup', component: SignupPage },
  { path: '/history-booking', name: 'history-booking', component: HistoryBookingPage },
  { path: '/auth/google/callback', name: 'google-callback', component: GoogleCallback },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
