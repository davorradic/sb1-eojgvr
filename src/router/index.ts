import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import PostJob from '../views/PostJob.vue'
import CompanyJobListings from '../views/CompanyJobListings.vue'
import TeacherApproval from '../views/TeacherApproval.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/post-job', component: PostJob, meta: { requiresAuth: true, requiresCompany: true } },
  { path: '/company-job-listings', component: CompanyJobListings, meta: { requiresAuth: true, requiresCompany: true } },
  { path: '/teacher-approval', component: TeacherApproval, meta: { requiresAuth: true, requiresTeacher: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login')
  } else if (to.meta.requiresCompany && authStore.userRole !== 'company') {
    next('/dashboard')
  } else if (to.meta.requiresTeacher && authStore.userRole !== 'teacher') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router