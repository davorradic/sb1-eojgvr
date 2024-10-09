<template>
  <div class="max-w-4xl mx-auto p-4">
    <div v-if="loading">Loading job details...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="job" class="bg-white shadow-md rounded-lg p-6">
      <div class="mb-6 relative">
        <div class="flex space-x-4 overflow-x-auto pb-4">
          <img v-if="job.imageUrl" :src="job.imageUrl" alt="Company logo" class="w-full h-64 object-cover rounded">
          <div v-if="job.youtube_link" class="w-full h-64 flex-shrink-0">
            <iframe 
              :src="getYouTubeEmbedUrl(job.youtube_link)" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              class="w-full h-full rounded"
            ></iframe>
          </div>
        </div>
      </div>
      <h2 class="text-3xl font-bold mb-4">{{ job.title }}</h2>
      <p class="text-xl mb-2"><strong>Company:</strong> {{ job.company }}</p>
      <p class="mb-2"><strong>Location:</strong> {{ job.location }}</p>
      <p class="mb-2"><strong>Type:</strong> {{ job.type }}</p>
      <p class="mb-2"><strong>Experience:</strong> {{ job.experience }}</p>
      <p class="mb-2"><strong>Posted on:</strong> {{ formatDate(job.postedOn) }}</p>
      <p class="mb-2"><strong>Categories:</strong> {{ job.categories ? job.categories.join(', ') : 'N/A' }}</p>
      <p class="mb-2"><strong>Skills:</strong> {{ job.skills ? job.skills.join(', ') : 'N/A' }}</p>
      <div class="mt-4">
        <h3 class="text-2xl font-semibold mb-2">About the Job</h3>
        <p>{{ job.about }}</p>
      </div>
      <div class="mt-6">
        <a :href="job.job_link" target="_blank" rel="noopener noreferrer" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Apply Now
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()
const job = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const jobId = route.params.id as string
  try {
    const jobDoc = await getDoc(doc(db, 'jobListings', jobId))
    if (jobDoc.exists()) {
      job.value = { id: jobDoc.id, ...jobDoc.data() }
    } else {
      error.value = 'Job not found'
    }
  } catch (err) {
    console.error('Error fetching job details:', err)
    error.value = 'Failed to load job details. Please try again later.'
  } finally {
    loading.value = false
  }
})

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  if (timestamp.toDate) {
    const date = timestamp.toDate()
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return 'Invalid Date'
}

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return ''
  const videoId = url.split('v=')[1]
  if (!videoId) return ''
  const ampersandPosition = videoId.indexOf('&')
  if (ampersandPosition !== -1) {
    return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`
  }
  return `https://www.youtube.com/embed/${videoId}`
}
</script>