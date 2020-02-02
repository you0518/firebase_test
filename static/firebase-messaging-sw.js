/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/7.8.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.8.0/firebase-messaging.js')
importScripts('./firebase_env.js')

firebase.initializeApp(firebaseEnv)
const messaging = firebase.messaging()
