<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Your Job Listings</h2>
    <div v-if="loading">Loading job listings...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="jobListings.length === 0">
      <p>You haven't posted any jobs yet.</p>
      <router-link to="/post-job" class="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Post Your First Job
      </router-link>
    </div>
    <div v-else>
      <div v-for="job in jobListings" :key="job.id" class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 class="text-xl font-semibold mb-2">{{ job.title }}</h3>
        <p class="mb-2"><strong>Type:</strong> {{ job.type }}</p>
        <p class="mb-2"><strong>Experience:</strong> {{ job.experience }}</p>
        <p class="mb-2"><strong>Location:</strong> {{ job.location }}</p>
        <p class="mb-2"><strong>Posted on:</strong> {{ formatDate(job.postedOn) }}</p>
        <p class="mb-2"><strong>Categories:</strong> {{ job.categories ? job.categories.join(', ') : 'N/A' }}</p>
        <p class="mb-2"><strong>Skills:</strong> {{ job.skills ? job.skills.join(', ') : 'N/A' }}</p>
        <p class="mb-2"><strong>About:</strong> {{ job.about }}</p>
        <p class="mb-2"><strong>Status:</strong> {{ job.approved ? 'Approved' : 'Pending Approval' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { db } from '../firebase/config'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'

const authStore = useAuthStore()
const jobListings = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await fetchJobListings()
})

const fetchJobListings = async () => {
  try {
    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    const q = query(
      collection(db, 'jobListings'),
      where('companyId', '==', authStore.user.uid),
      orderBy('postedOn', 'desc')
    )

    const querySnapshot = await getDocs(q)
    jobListings.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.error('Error fetching job listings:', err)
    error.value = 'Failed to load job listings. Please try again later.'
  } finally {
    loading.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  if (timestamp.toDate) {
    const date = timestamp.toDate()
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return 'Invalid Date'
}
</script>