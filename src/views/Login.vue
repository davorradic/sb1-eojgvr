<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
      </div>
    </form>
    <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'An error occurred during login'
  } finally {
    isLoading.value = false
  }
}
</script>