 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
 import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut,signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
 import { getFirestore, doc, setDoc,getDoc,collection,addDoc,  getDocs, query, where,deleteDoc} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL  } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";


 const firebaseConfig = {
   apiKey: "AIzaSyDn2l80Bw7DXXayK7OzgbddE5X2TAn3V6A",
   authDomain: "blogging-website-ee5ce.firebaseapp.com",
   projectId: "blogging-website-ee5ce",
   storageBucket: "blogging-website-ee5ce.appspot.com",
   messagingSenderId: "94364312636",
   appId: "1:94364312636:web:e8ed19de75891f9a394f39"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const db = getFirestore(app);
const storage = getStorage(app)
console.log(auth)

export {
  auth,
  db,
  storage,
  onAuthStateChanged,
  doc, 
  setDoc,
  ref, 
  uploadBytes,
  getDownloadURL,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword ,
  signOut,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query, 
  where,
  deleteDoc,
}