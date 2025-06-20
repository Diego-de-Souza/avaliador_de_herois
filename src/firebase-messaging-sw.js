importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDR4VLfAOSGhLAtf0zR3wHIx2kKLleJXeM",
    authDomain: "messages-api-7db27.firebaseapp.com",
    projectId: "messages-api-7db27",
    storageBucket: "messages-api-7db27.firebasestorage.app",
    messagingSenderId: "66044860601",
    appId: "1:66044860601:web:7e0609e5afd70022ec2368",
    measurementId: "G-F3G66L4SMJ"
});

const messaging = firebase.messaging();
