import { Plugin } from '@nuxt/types'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebaseui/dist/firebaseui.css'

// Initialize Firebase
firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
})

declare module 'vue/types/vue' {
  interface Vue {
    $firebase: typeof firebase
  }
}

const FirebasePlugin: Plugin = async ({ store }, inject) => {
  inject('firebase', firebase)

  await new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      await store.dispatch('User/setUser', user)
      resolve()
    })
  })
}

export default FirebasePlugin
