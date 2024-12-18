let comuni = []; // Variabile per memorizzare i dati dei comuni

// Caricamento del file JSON (o API dei comuni)
fetch('data/gi_comuni_cap.json') // percorso del file JSON 
    .then(response => response.json())
    .then(data => {
        comuni = data; // Salvo i comuni nella variabile globale
        populateSelect(comuni); // Popolo il menu a tendina con tutti i comuni
    })
    .catch(error => console.error('Errore nel caricamento dei comuni:', error));

// Funzione per popolare il menu a tendina con i comuni
function populateSelect(data) {
    const select = document.getElementById('mySelect');
    data.forEach(comune => {
        const option = document.createElement('option');
        option.value = comune.codice_istat; 
        option.textContent = comune.denominazione_ita; // Nome del comune
        select.appendChild(option);
    });
}

// Funzione per filtrare i comuni in base al campo di ricerca
function filterComuni() {
    const input = document.getElementById('searchComune').value.toLowerCase();
    const select = document.getElementById('mySelect');
    select.innerHTML = ''; // Cancello le opzioni precedenti

    // Filtro i comuni in base all'input
    const comuniFiltrati = comuni.filter(comune =>
        comune.denominazione_ita.toLowerCase().includes(input)
    );

    // Ripopolo il menu a tendina con i comuni filtrati
    comuniFiltrati.forEach(comune => {
        const option = document.createElement('option');
        option.value = comune.codice_istat;
        option.textContent = comune.denominazione_ita;
        select.appendChild(option);
    });
}

// Funzione per ottenere le condizioni meteo in base al comune selezionato
function fetchWeatherData() {
    const select = document.getElementById('mySelect');
    const selectedComune = select.options[select.selectedIndex];

    if (selectedComune.value) {
        const comuneData = comuni.find(comune => comune.codice_istat === selectedComune.value);
        
        if (comuneData) {
            const lat = comuneData.lat;
            const lon = comuneData.lon;

            document.getElementById('lon').textContent = lon;
            document.getElementById('lat').textContent = lat;

            // Eseguo una chiamata all'API OpenWeather per ottenere le condizioni meteo
            const apiKey = '5f578038b84d9a8cf214d8cf92613764&lang=it';
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            fetch(url)
                .then(response => response.json())
                .then(weatherData => {
                    document.getElementById('description').textContent = weatherData.weather[0].description;
                    document.getElementById('temperature').textContent = weatherData.main.temp.toFixed(1); // Temperatura con un decimale
                    document.getElementById('weatherInfo').style.display = 'block'; // Mostro le informazioni meteo
                })
                .catch(error => console.error('Errore nel recupero dei dati meteo:', error));
        }
    }
}
