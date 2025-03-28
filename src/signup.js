import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyAEMIczaR6m6CGWfRNvUfsKWQf0FtSyouk",
    authDomain: "quicktourneyapp.firebaseapp.com",
    projectId: "quicktourneyapp",
    storageBucket: "quicktourneyapp.firebasestorage.app",
    messagingSenderId: "310201871231",
    appId: "1:310201871231:web:df38a4aef8d8131ea8084a",
    measurementId: "G-7NHV77LR3D",
    databaseURL: "https://quicktourneyapp-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User signed up:', userCredential.user);
        alert('Sign up successful!');
        window.location.href = "home.html";
    } catch (error) {
        console.error('Error signing up:', error.message);
        alert('Sign up failed: ' + error.message);
    }
});