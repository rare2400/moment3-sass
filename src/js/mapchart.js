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
        type: 'pie',
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



/* moment 5 - Frontend-baserad utveckling DT211G
Av Ramona Reinholdz, rare2400 */

"use strict";


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