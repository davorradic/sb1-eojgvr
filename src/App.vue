<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link to="/" class="flex-shrink-0 flex items-center">
              Job Portal
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="user">
              <router-link
                to="/dashboard"
                class="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </router-link>
              <button
                @click="logout"
                class="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </template>
            <router-link
              v-else
              to="/login"
              class="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { logout } = authStore
</script>