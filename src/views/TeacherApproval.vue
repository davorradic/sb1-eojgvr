<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Job Listings Pending Approval</h2>
    <div v-if="loading">Loading job listings...</div>
    <div v-else-if="pendingJobs.length === 0">
      <p>No job listings pending approval.</p>
    </div>
    <div v-else>
      <div v-for="job in pendingJobs" :key="job.id" class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 class="text-xl font-semibold mb-2">{{ job.title }}</h3>
        <p class="mb-2"><strong>Company:</strong> {{ job.company }}</p>
        <p class="mb-2"><strong>Type:</strong> {{ job.type }}</p>
        <p class="mb-2"><strong>Experience:</strong> {{ job.experience }}</p>
        <p class="mb-2"><strong>Location:</strong> {{ job.location }}</p>
        <p class="mb-2"><strong>Posted on:</strong> {{ formatDate(job.postedOn) }}</p>
        <p class="mb-2"><strong>Categories:</strong> {{ job.categories.join(', ') }}</p>
        <p class="mb-2"><strong>Skills:</strong> {{ job.skills.join(', ') }}</p>
        <p class="mb-2"><strong>About:</strong> {{ job.about }}</p>
        <button @click="approveJob(job.id)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
          Approve
        </button>
        <button @click="rejectJob(job.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Reject
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { db } from '../firebase/config'
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const authStore = useAuthStore()
const pendingJobs = ref([])
const loading = ref(true)

onMounted(async () => {
  await fetchPendingJobs()
})

const fetchPendingJobs = async () => {
  try {
    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    const q = query(
      collection(db, 'jobListings'),
      where('approved', '==', false),
      orderBy('postedOn', 'desc')
    )

    const querySnapshot = await getDocs(q)
    pendingJobs.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching pending job listings:', error)
  } finally {
    loading.value = false
  }
}

const approveJob = async (jobId: string) => {
  try {
    await updateDoc(doc(db, 'jobListings', jobId), { approved: true })
    await fetchPendingJobs()
  } catch (error) {
    console.error('Error approving job:', error)
  }
}

const rejectJob = async (jobId: string) => {
  try {
    await deleteDoc(doc(db, 'jobListings', jobId))
    await fetchPendingJobs()
  } catch (error) {
    console.error('Error rejecting job:', error)
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