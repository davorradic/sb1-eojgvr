import { defineStore } from 'pinia'
import { auth, db } from '../firebase/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    userRole: null as string | null,
  }),
  actions: {
    async register(email: string, password: string, role: string) {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: role,
        })

        this.user = user
        this.userRole = role
      } catch (error: any) {
        console.error('Registration error:', error)
        throw error
      }
    },
    async login(email: string, password: string) {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        this.user = user
        
        // Fetch user role from Firestore
        await this.fetchUserRole(user.uid)
      } catch (error: any) {
        console.error('Login error:', error)
        throw error
      }
    },
    async logout() {
      try {
        await signOut(auth)
        this.user = null
        this.userRole = null
      } catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    },
    async fetchUserRole(userId: string) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (userDoc.exists()) {
          this.userRole = userDoc.data().role
        } else {
          console.error('User document not found')
          this.userRole = null
        }
      } catch (error) {
        console.error('Error fetching user role:', error)
        this.userRole = null
      }
    },
  },
})