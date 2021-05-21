import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCLTAr5hhAUbUyGl47m3cZ_og6Wd58k7eo",
  authDomain: "test-7be84.firebaseapp.com",
  projectId: "test-7be84",
  storageBucket: "test-7be84.appspot.com",
  messagingSenderId: "58687392102",
  appId: "1:58687392102:web:6d49f69934772f790960a7"
};

firebase.initializeApp(config);


export { firebase };
