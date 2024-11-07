// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjWPR-XBhMWLl75lTMgqghnhA2MtMNMfc",
  authDomain: "gossy-fbbcf.firebaseapp.com",
  databaseURL: "https://gossy-fbbcf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gossy-fbbcf",
  storageBucket: "gossy-fbbcf.appspot.com",
  messagingSenderId: "981903549611",
  appId: "1:981903549611:web:563b6659ca2bb04d57c3ee",
  measurementId: "G-8L09BJW2PG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default firebaseConfig;
