const tournamentID = localStorage.getItem('tournamentID'); 
console.log(tournamentID);
var userID;

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js';

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

if (tournamentID) {
    const tournamentRef = ref(database, `tournaments/${tournamentID}`);
    get(tournamentRef).then((snapshot) => {
        if (snapshot.exists()) {
            const tournamentData = snapshot.val();

            // Populate tournament details
            const tournamentNameElem = document.querySelector('#tournament-name span');
            if (tournamentNameElem) tournamentNameElem.textContent = tournamentData.name || 'N/A';

            const tournamentGameElem = document.querySelector('#tournament-game span');
            if (tournamentGameElem) tournamentGameElem.textContent = tournamentData.game || 'N/A';

            const tournamentStartDateElem = document.querySelector('#tournament-start-date span');
            if (tournamentStartDateElem) {
                const startDate = new Date(tournamentData.startDateTime);
                tournamentStartDateElem.textContent = isNaN(startDate.getTime()) ? 'N/A' : startDate.toLocaleString();
            }

            const tournamentEndDateElem = document.querySelector('#tournament-end-date span');
            if (tournamentEndDateElem) {
                const endDate = new Date(tournamentData.endDateTime);
                tournamentEndDateElem.textContent = isNaN(endDate.getTime()) ? 'N/A' : endDate.toLocaleString();
            }

            const tournamentLocationElem = document.querySelector('#tournament-location span');
            if (tournamentLocationElem) tournamentLocationElem.textContent = tournamentData.location || 'N/A';

            // Populate participants table
            const participantsTable = document.getElementById('participants-table');
            participantsTable.innerHTML = ''; // Clear any existing table content

            if (Array.isArray(tournamentData.entrants)) {
                const participants = tournamentData.entrants;

                // Create table header row
                const headerRow = document.createElement('tr');
                const emptyHeaderCell = document.createElement('th');
                headerRow.appendChild(emptyHeaderCell); // Top-left empty cell
                participants.forEach((participant) => {
                    const headerCell = document.createElement('th');
                    headerCell.textContent = participant;
                    headerRow.appendChild(headerCell);
                });
                participantsTable.appendChild(headerRow);

                // Create table rows
                participants.forEach((rowParticipant) => {
                    const row = document.createElement('tr');
                    const rowHeaderCell = document.createElement('th');
                    rowHeaderCell.textContent = rowParticipant;
                    row.appendChild(rowHeaderCell);

                    participants.forEach(() => {
                        const cell = document.createElement('td');
                        cell.textContent = ''; // You can populate this with relevant data if needed
                        row.appendChild(cell);
                    });

                    participantsTable.appendChild(row);
                });
            }
        } else {
            console.error('No tournament data found for the given ID.');
        }
    }).catch((error) => {
        console.error('Error fetching tournament data:', error);
    });
} else {
    console.error('No tournament ID found in localStorage.');
}