// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from 'firebase/app'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAiP6-WAL42i_FwSLYFsedAPPPCI_j-ctY',
  authDomain: 'blog-7e7a6.firebaseapp.com',
  databaseURL: 'https://blog-7e7a6.firebaseio.com',
  projectId: 'blog-7e7a6',
  storageBucket: 'blog-7e7a6.appspot.com',
  messagingSenderId: '180239026597',
  appId: '1:180239026597:web:48ff1e056501980338c04c',
}

// Initialize Firebase
export const init = (): FirebaseApp => {
  const app = initializeApp(firebaseConfig)
  return app
}
