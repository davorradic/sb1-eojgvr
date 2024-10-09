<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <p class="mb-4">Welcome, {{ user?.email }}</p>
      <p class="mb-4">User Role: {{ userRole }}</p>
      
      <div v-if="userRole === 'company'">
        <h3 class="text-xl font-semibold mb-2">Company Dashboard</h3>
        <div class="space-y-4">
          <router-link to="/post-job" class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Post a New Job
          </router-link>
          <router-link to="/company-job-listings" class="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            View Your Job Listings
          </router-link>
        </div>
      </div>
      
      <div v-else-if="userRole === 'student'">
        <h3 class="text-xl font-semibold mb-2">Student Dashboard</h3>
        <p>Here you can view and apply for job listings.</p>
      </div>
      
      <div v-else-if="userRole === 'teacher'">
        <h3 class="text-xl font-semibold mb-2">Teacher Dashboard</h3>
        <p>Here you can review and approve student applications.</p>
        <router-link to="/teacher-approval" class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          Approve Job Listings
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const userRole = ref('')
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    if (user.value) {
      const userDoc = await getDoc(doc(db, 'users', user.value.uid))
      if (userDoc.exists()) {
        userRole.value = userDoc.data().role
      } else {
        error.value = 'User document not found. Please check your registration.'
      }
    } else {
      error.value = 'User not authenticated. Please log in.'
    }
  } catch (err) {
    console.error('Error fetching user role:', err)
    error.value = 'An error occurred while fetching user data. Please try again.'
  } finally {
    loading.value = false
  }
})
</script>