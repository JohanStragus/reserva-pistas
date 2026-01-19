const firebaseConfig = {
    apiKey: "AIzaSyDepNDGkZlQscZl3tnvxKtogj8tkl4s6DY",
    authDomain: "reserva-pistas-423b3.firebaseapp.com",
    projectId: "reserva-pistas-423b3",
    storageBucket: "reserva-pistas-423b3.firebasestorage.app",
    messagingSenderId: "83827527535",
    appId: "1:83827527535:web:e3fdec7bf765ef895de29a"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();