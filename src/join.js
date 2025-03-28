//Use https://www.gstatic.com/firebasejs/11.5.0/firebase-SERVICE.js for webmodules

var userID;

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js';
import { getDatabase, ref, get, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js';

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

document.getElementById('searchButton').addEventListener('click', async () => {
    const searchInput = document.getElementById('searchInput').value.trim();
    const searchCriteria = document.getElementById('searchCriteria').value;

    if (!searchInput) {
        alert("Please enter a search term.");
        return;
    }

    let queryRef;

    switch (searchCriteria) {
        case 'name':
            queryRef = query(ref(database, 'tournaments'), orderByChild('name'), equalTo(searchInput));
            break;
        case 'location':
            queryRef = query(ref(database, 'tournaments'), orderByChild('location'), equalTo(searchInput));
            break;
        case 'tournamentID':
            queryRef = ref(database, `tournaments/${searchInput}`);
            break;
        default:
            alert("Invalid search criteria.");
            return;
    }

    try {
        const snapshot = await get(queryRef);

        if (snapshot.exists()) {
            const results = searchCriteria === 'tournamentID' ? { [searchInput]: snapshot.val() } : snapshot.val();
            const resultCount = Object.keys(results).length;

            if (resultCount > 1) {
                const resultsContainer = document.getElementById('resultsContainer');
                resultsContainer.innerHTML = '';

                Object.entries(results).forEach(([id, tournament]) => {
                    const tournamentCard = document.createElement('div');
                    tournamentCard.classList.add('tournament-card');
                    tournamentCard.style.border = '1px solid #ccc';
                    tournamentCard.style.borderRadius = '8px';
                    tournamentCard.style.padding = '16px';
                    tournamentCard.style.margin = '8px 0';
                    tournamentCard.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    tournamentCard.style.cursor = 'pointer';
                    tournamentCard.style.transition = 'transform 0.2s';
                    tournamentCard.style.backgroundColor = '#121212'; // Set background to dark
                    tournamentCard.style.color = '#fff'; // Set text color to white

                    tournamentCard.addEventListener('mouseover', () => {
                        tournamentCard.style.transform = 'scale(1.02)';
                    });

                    tournamentCard.addEventListener('mouseout', () => {
                        tournamentCard.style.transform = 'scale(1)';
                    });

                    tournamentCard.innerHTML = `
                        <h3 style="margin: 0; color: #fff;">${tournament.name}</h3>
                        <p style="margin: 4px 0; color: #ccc;"><strong>Game:</strong> ${tournament.game}</p>
                        <p style="margin: 4px 0; color: #ccc;"><strong>Location:</strong> ${tournament.location}</p>
                        <p style="margin: 4px 0; color: #ccc;"><strong>Start Date:</strong> ${tournament.startDateTime}</p>
                    `;

                    tournamentCard.addEventListener('click', () => {
                        localStorage.setItem('tournamentID', id);
                        window.location.href = 'tournament.html';
                    });

                    resultsContainer.appendChild(tournamentCard);
                });
            } else if (resultCount === 1) {
                const tournamentID = Object.keys(results)[0];
                localStorage.setItem('tournamentID', tournamentID); 
                window.location.href = 'tournament.html';
            } else {
                console.log("No results found.");
            }

            alert("Search completed.");
        } else {
            alert("No matches found.");
        }
    } catch (error) {
        console.error("Error searching tournaments:", error);
        alert("An error occurred while searching. Please try again.");
    }
});