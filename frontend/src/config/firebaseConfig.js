import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA7h3lpPND2-diqQsXiJTZQQaGbKeiZffs",
  authDomain: "diplomska-dea7c.firebaseapp.com",
  projectId: "diplomska-dea7c",
  storageBucket: "diplomska-dea7c.firebasestorage.app",
  messagingSenderId: "98083160078",
  appId: "1:98083160078:web:9e16a498763c11042d3c5f",
  measurementId: "G-FN7PZJBFPD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const analytics = getAnalytics(app);
export default auth;