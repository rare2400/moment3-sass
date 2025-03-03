/* moment 5 - Frontend-baserad utveckling DT211G
Av Ramona Reinholdz, rare2400 */

"use strict";

/**
 * Funktion för att köra funktioner när sidan laddas
 * @returns {void}
 * @listens window.onload
 */
window.onload = () => {
    getData();
}

/**
 * Hämtar statistik från json-fil och skickar data till funktioner för diagram
 * @returns {Promise<void>} - Anropar funktioner som skapar diagram
 * @throws {Error} - Fel vid hämtning av data
 */
async function getData() {
    try {
        const response = await fetch('https://studenter.miun.se/~mallar/dt211g/');
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error('Fel vid hämtning av data');
        }
        createBarDiagram(getTopSixCourses(data));
        createPieChart(getTopFivePrograms(data));
    } catch (error) {
        console.error('Error:', error);
        document.querySelector('#error').textContent = 'Fel vid anslutning - prova igen senare';
    }
}

/**
 * Filtrerar ut de 6 mest sökta kurserna
 * @param {Array<Object>} data - Data från json-fil
 * @returns {Array<Object} - Returnerar en array med de 6 mesta sökta kurserna
 */
function getTopSixCourses(data) {
    return data
        .filter(item => item.type === "Kurs")
        .sort((a, b) => parseInt(b.applicantsTotal) - parseInt(a.applicantsTotal))
        .slice(0, 6);
}

/**
 * Filtrerar ut de 5 mest sökta programmen
 * @param {Array<Object>} data - Data från json-fil
 * @returns {Array<Object>} - Returnerar en array med de 5 mest sökta programmen
 */
function getTopFivePrograms(data) {
    return data
        .filter(item => item.type === "Program")
        .sort((a, b) => parseInt(b.applicantsTotal) - parseInt(a.applicantsTotal))
        .slice(0, 5);
}

/**
 * Funktion för att skapa stapeldiagram
 * @param {Array} courses - Array med de 6 mesta sökta kurserna
 * @returns {void} 
 */
function createBarDiagram(courses) {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: courses.map(course => course.name),
            datasets: [{
                label: 'Antal sökande',
                data: courses.map(course => course.applicantsTotal),
                backgroundColor: ['#ff2b2b', '#4a8df7', '#297021', '#a159c2', 'orange', '#fff954'],
                borderColor: ['red', '#4a8df7', '#297021', '#a159c2', 'orange', 'yellow'],
                borderWidth: 1,
                borderRadius: 10,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        callback: function (value) {
                            let label = this.getLabelForValue(value);
                            return label.length > 37 ? label.match(/.{1,37}/g) : label;
                        },
                    }
                },
            }
        }
    });
}

/**
 * Funktion för att skapa cirkeldiagram
 * @param {Array} programs - Array med de 5 mest sökta programmen
 * @returns {void}
 */
function createPieChart(programs) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: programs.map(program => program.name),
            datasets: [{
                label: 'Antal sökande',
                data: programs.map(program => program.applicantsTotal),
                backgroundColor: ['#a159c2', '#4a8df7', '#297021', '#ff2b2b', 'orange'],
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true
        }
    });
}

/**
 * initierar leaflet-kartan med en startvy över Sverige
 * @constant {L.Map}
 */
const map = L.map('map').setView([59.8581306, 17.6335778], 5);

/**
 * läggre till OpenStreetmap-lager på kartan
 * @constant {L.tileLayer}
 */
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

/**
 * skapar markör på kartan på startvyn
 * @constant {L.marker}
 */
let marker = L.marker([59.8581306, 17.6335778]).addTo(map);

/**
 * Hämtar koordinater från Nominatim API baserat på en sökfras.
 * @param {string} query - Platsen som användaren söker efter.
 * @returns {Promise<{lat: string, lon: string}>} - Returnerar latitud och longitud.
 * @throws {Error} - Om platsen inte hittas/API-anropet misslyckas
 */
async function getCoordinates(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.length === 0) {
            throw new Error('Platsen hittades inte.');
        }
        
        return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
        console.error('Fel vid hämtning av koordinater:', error);
        alert('Platsen kunde inte hittas. Försök igen!');
    }
}

/**
 * Eventlyssnare för sökformuläret vid tryck på "sök"-knappen
 * @event submit
 * @listens document.getElementById#searchform:submit
 */
document.getElementById('searchForm').addEventListener('submit', searchQuery);

/**
 * Hämtar sökningen från input-fältet
 * @returns {string}
 */
function getSearchInput() {
  return document.getElementById('searchInput').value.trim();
}

/**
 * Eventlyssnare för formuläret när man skriver in en plats och trycker på "sök"
 * @param {Event} event -Sökningen från formuläret
 * @returns {Promise<void>}
 */
async function searchQuery(event) {
  //förhindar laddning av sidan
    event.preventDefault();

    const inputValue = getSearchInput();
    
    //alert om att en plats behöver fyllas i
    if (inputValue.trim() === '') {
        alert('Skriv in en plats att söka efter.');
        return;
    }

    // Hämta koordinater och uppdatera kartan/markören
    const coords = await getCoordinates(inputValue);
    
    if (coords) {
        const { lat, lon } = coords;

        // Flytta kartan till den nya platsen
        map.setView([lat, lon], 16);

        // Uppdatera markörens position
        marker.setLatLng([lat, lon]);
    }
};