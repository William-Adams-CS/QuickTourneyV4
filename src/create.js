//Use https://www.gstatic.com/firebasejs/11.5.0/firebase-SERVICE.js for webmodules

var userID;

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js';

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
const database = getDatabase(app);

onAuthStateChanged(auth, (user) => {
    if (user != null) {
        userID = user.uid;
    } else {
        window.location.href = "login.html";
    }
});

document.getElementById('submitButton').addEventListener('click', () => {

    const tournamentName = document.getElementById('tournamentName').value;
    const tournamentGame = document.getElementById('tournamentGame').value;
    const startDateTime = document.getElementById('startDateTime').value;
    const endDateTime = document.getElementById('endDateTime').value;
    const tournamentEntrants = document.getElementById('tournamentEntrants').value.split(',');

    if (!userID) {
        alert("User not authenticated.");
        return;
    }

    const tournamentID = Date.now().toString(); // Unique ID based on timestamp
    const tournamentData = {
        name: tournamentName,
        game: tournamentGame,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        entrants: tournamentEntrants,
        createdBy: userID
    };

    set(ref(database, 'tournaments/' + tournamentID), tournamentData)
        .then(() => {
            alert("Tournament created successfully!");
            document.getElementById('tournamentForm').reset();
        })
        .catch((error) => {
            console.error("Error creating tournament:", error);
            alert("Failed to create tournament. Please try again.");
        });
});