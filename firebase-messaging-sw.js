importScripts("https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDmRVqrP68RNSXyjopUz7od5HlGJ4vRLXM",
  authDomain: "treewatch-f6df4.firebaseapp.com",
  databaseURL: "https://treewatch-f6df4.firebaseio.com",
  projectId: "treewatch-f6df4",
  storageBucket: "treewatch-f6df4.appspot.com",
  messagingSenderId: "1087238844150",
  appId: "1:1087238844150:web:40fa1a8ffb6243dfc6c6d7",
  measurementId: "G-N2DG5BH91S",
};
firebase.initializeApp(firebaseConfig);

const initMessaging = firebase.messaging();
console.log(initMessaging.getToken());
