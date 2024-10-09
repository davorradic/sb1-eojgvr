import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { firebaseConfig } from './firebase/config'
import { useAuthStore } from './stores/auth'

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const auth = getAuth(firebaseApp)

// Initialize the auth store
const authStore = useAuthStore()

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('User is signed in:', user)
    authStore.user = user
    await authStore.fetchUserRole(user.uid)
  } else {
    console.log('User is signed out')
    authStore.user = null
    authStore.userRole = null
  }
})

app.mount('#app')