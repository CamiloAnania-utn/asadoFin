// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// PEGA AQUÍ LO QUE COPIASTE DE LA CONSOLA DE FIREBASE:
const firebaseConfig = {
  apiKey: "AIzaSyDS9XZ6lXL5lJHeg3LwN7pgb8qyOyfYMWg",
  authDomain: "asadofinde2025.firebaseapp.com",
  projectId: "asadofinde2025",
  storageBucket: "asadofinde2025.firebasestorage.app",
  messagingSenderId: "904971909012",
  appId: "1:904971909012:web:b88e872e44c68c619e8181"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
// Exportamos la base de datos para usarla en la App
export const db = getFirestore(app);