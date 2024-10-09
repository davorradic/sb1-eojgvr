<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Welcome to Job Portal</h1>
    
    <div v-if="user" class="mb-6">
      <router-link to="/dashboard" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go to Dashboard
      </router-link>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Search Jobs</h2>
      <div class="flex space-x-4 mb-4">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search jobs..."
          class="flex-grow px-4 py-2 border rounded-lg"
          @input="filterJobs"
        />
        <select
          v-model="selectedCategory"
          class="px-4 py-2 border rounded-lg"
          @change="filterJobs"
        >
          <option value="">All Categories</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">All Job Listings</h2>
      <div v-if="loading">Loading job listings...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="filteredJobListings.length === 0">No job listings available at the moment.</div>
      <div v-else class="space-y-4">
        <div v-for="job in filteredJobListings" :key="job.id" class="border p-4 rounded-lg cursor-pointer hover:bg-gray-50" @click="goToJobDetails(job.id)">
          <div class="flex items-center space-x-4">
            <img v-if="job.imageUrl" :src="job.imageUrl" alt="Company logo" class="w-16 h-16 object-cover rounded">
            <div>
              <h3 class="text-xl font-semibold">{{ job.title }}</h3>
              <p><strong>Company:</strong> {{ job.company }}</p>
              <p><strong>Location:</strong> {{ job.location }}</p>
              <p><strong>Type:</strong> {{ job.type }}</p>
              <p><strong>Experience:</strong> {{ job.experience }}</p>
              <p><strong>Posted on:</strong> {{ formatDate(job.postedOn) }}</p>
              <p><strong>Categories:</strong> {{ job.categories ? job.categories.join(', ') : 'N/A' }}</p>
              <p><strong>Skills:</strong> {{ job.skills ? job.skills.join(', ') : 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase/config'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const jobListings = ref([])
const loading = ref(true)
const error = ref('')
const searchTerm = ref('')
const selectedCategory = ref('')

onMounted(async () => {
  try {
    const q = query(
      collection(db, 'jobListings'),
      orderBy('postedOn', 'desc')
    )
    const querySnapshot = await getDocs(q)
    jobListings.value = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(job => job.approved !== false) // Only show approved jobs or jobs without the 'approved' field
  } catch (err: any) {
    console.error('Error fetching job listings:', err)
    error.value = 'Failed to load job listings. Please try again later.'
  } finally {
    loading.value = false
  }
})

const uniqueCategories = computed(() => {
  const categories = new Set()
  jobListings.value.forEach(job => {
    if (job.categories) {
      job.categories.forEach(category => categories.add(category))
    }
  })
  return Array.from(categories)
})

const filteredJobListings = computed(() => {
  return jobListings.value.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || (job.categories && job.categories.includes(selectedCategory.value))
    return matchesSearch && matchesCategory
  })
})

const filterJobs = () => {
  // This function is called when the search term or category changes
  // The filtering is handled by the computed property, so we don't need to do anything here
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  if (timestamp.toDate) {
    const date = timestamp.toDate()
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return 'Invalid Date'
}

const goToJobDetails = (jobId: string) => {
  router.push({ name: 'JobDetails', params: { id: jobId } })
}
</script>