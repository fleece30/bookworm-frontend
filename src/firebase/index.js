import firebase from "firebase/app";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDa3990wGMxdxehnNTQ1yiACJ7gSD85MuU",
  authDomain: "recipem-e1c30.firebaseapp.com",
  projectId: "recipem-e1c30",
  storageBucket: "recipem-e1c30.appspot.com",
  messagingSenderId: "1020221898879",
  appId: "1:1020221898879:web:59e6ce333d0a6077607f4a",
  measurementId: "G-J2KQ1NVXLB",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const Storage = firebase.storage();

export { Storage, firebase as default };
