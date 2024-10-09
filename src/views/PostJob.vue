<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Post a New Job</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Job Title</label>
        <input type="text" id="title" v-model="jobData.title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      
      <div>
        <label for="company" class="block text-sm font-medium text-gray-700">Company Name</label>
        <input type="text" id="company" v-model="jobData.company" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700">Job Type</label>
        <select id="type" v-model="jobData.type" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="project">Project</option>
        </select>
      </div>
      
      <div>
        <label for="experience" class="block text-sm font-medium text-gray-700">Experience Level</label>
        <select id="experience" v-model="jobData.experience" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="Entry Level">Entry Level</option>
          <option value="Mid Level">Mid Level</option>
          <option value="Senior Level">Senior Level</option>
        </select>
      </div>
      
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
        <input type="text" id="location" v-model="jobData.location" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      
      <div>
        <label for="categories" class="block text-sm font-medium text-gray-700">Categories</label>
        <div class="mt-2 space-y-2">
          <div v-for="category in availableCategories" :key="category">
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="jobData.categories" :value="category" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <span class="ml-2">{{ category }}</span>
            </label>
          </div>
          <div>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="showCustomCategory" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <span class="ml-2">Other</span>
            </label>
          </div>
          <div v-if="showCustomCategory">
            <input type="text" v-model="customCategory" placeholder="Enter custom category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          </div>
        </div>
      </div>
      
      <div>
        <label for="skills" class="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
        <input type="text" id="skills" v-model="skillsInput" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      
      <div>
        <label for="about" class="block text-sm font-medium text-gray-700">About the Job</label>
        <textarea id="about" v-model="jobData.about" rows="4" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
      </div>
      
      <div>
        <label for="job_link" class="block text-sm font-medium text-gray-700">Application Link or Email</label>
        <input type="text" id="job_link" v-model="jobData.job_link" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>

      <div>
        <label for="companyLogo" class="block text-sm font-medium text-gray-700">Company Logo</label>
        <input type="file" id="companyLogo" @change="handleFileUpload" accept="image/*" class="mt-1 block w-full">
        <img v-if="previewUrl" :src="previewUrl" alt="Logo preview" class="mt-2 h-32 object-contain">
      </div>

      <div>
        <label for="youtube_link" class="block text-sm font-medium text-gray-700">YouTube Video Link</label>
        <input type="url" id="youtube_link" v-model="jobData.youtube_link" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      
      <div>
        <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" :disabled="isSubmitting">
          {{ isSubmitting ? 'Posting...' : 'Post Job' }}
        </button>
      </div>
    </form>
    <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { db, storage } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const router = useRouter()
const authStore = useAuthStore()

const jobData = reactive({
  title: '',
  company: '',
  type: '',
  experience: '',
  location: '',
  categories: [],
  about: '',
  job_link: '',
  youtube_link: ''
})

const skillsInput = ref('')
const showCustomCategory = ref(false)
const customCategory = ref('')
const isSubmitting = ref(false)
const error = ref('')

const logoFile = ref(null)
const previewUrl = ref('')

const availableCategories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'UI/UX Design',
  'Elektro',
  'Metaalbewerking',
  'Autotechniek'
]

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    logoFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const uploadLogo = async () => {
  if (!logoFile.value) return null

  const fileRef = storageRef(storage, `companyLogos/${authStore.user.uid}/${Date.now()}_${logoFile.value.name}`)
  await uploadBytes(fileRef, logoFile.value)
  return getDownloadURL(fileRef)
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    error.value = ''

    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    const finalCategories = jobData.categories.filter(cat => cat !== 'Other')
    if (showCustomCategory.value && customCategory.value) {
      finalCategories.push(customCategory.value)
    }

    let imageUrl = null
    if (logoFile.value) {
      imageUrl = await uploadLogo()
    }

    const newJob = {
      ...jobData,
      categories: finalCategories,
      skills: skillsInput.value.split(',').map(skill => skill.trim()),
      companyId: authStore.user.uid,
      postedOn: serverTimestamp(),
      approved: false,
      imageUrl
    }

    await addDoc(collection(db, 'jobListings'), newJob)
    router.push('/company-job-listings')
  } catch (err) {
    console.error('Error posting job:', err)
    error.value = 'Failed to post job. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>