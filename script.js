const map = L.map('map', {
    maxBounds: [
      [-90, -180],
      [90, 180],
    ],
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    dragging: false,
    maxBoundsViscosity: 1.0,
  }).setView([0, 0], 2);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

let selectedCountry = null;
let countryLayer;
let totalCustomPrice = 40;
let customCountries = [];
let displayedCountries = "";

// Regions
const regionCountries = {
    Europa: [
      "Albania",
      "Andorra",
      "Austria",
      "Belarus",
      "Belgium",
      "Bosnia and Herzegovina",
      "Bulgaria",
      "Croatia",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Estonia",
      "Finland",
      "France",
      "Germany",
      "Greece",
      "Hungary",
      "Iceland",
      "Ireland",
      "Italy",
      "Kosovo",            // teils anerkannt
      "Latvia",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Malta",
      "Moldova",
      "Monaco",
      "Montenegro",
      "Netherlands",
      "North Macedonia",
      "Norway",
      "Poland",
      "Portugal",
      "Romania",
      "San Marino",
      "Serbia",
      "Slovakia",
      "Slovenia",
      "Spain",
      "Sweden",
      "Switzerland",
      "Ukraine",
      "United Kingdom",
      "Vatican City"
    ],
  
    Asien: [
      "Afghanistan",
      "Armenia",
      "Azerbaijan",
      "Bahrain",
      "Bangladesh",
      "Bhutan",
      "Brunei",
      "Cambodia",
      "China",
      "Georgia",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Israel",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Lebanon",
      "Malaysia",
      "Maldives",
      "Mongolia",
      "Myanmar",
      "Nepal",
      "North Korea",
      "Oman",
      "Pakistan",
      "Philippines",
      "Qatar",
      "Russia",       // transkontinental
      "Saudi Arabia",
      "Singapore",
      "South Korea",
      "Sri Lanka",
      "Syria",
      "Taiwan",       // teils anerkannt
      "Tajikistan",
      "Thailand",
      "Timor-Leste",
      "Turkey",       // transkontinental
      "Turkmenistan",
      "United Arab Emirates",
      "Uzbekistan",
      "Vietnam",
      "Yemen"
    ],
  
    Nordamerika: [
      "Antigua and Barbuda",
      "Bahamas",
      "Barbados",
      "Belize",
      "Canada",
      "Costa Rica",
      "Cuba",
      "Dominica",
      "Dominican Republic",
      "El Salvador",
      "Grenada",
      "Guatemala",
      "Haiti",
      "Honduras",
      "Jamaica",
      "Mexico",
      "Nicaragua",
      "Panama",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Trinidad and Tobago",
      "United States of America"
    ],
  
    Südamerika: [
      "Argentina",
      "Bolivia",
      "Brazil",
      "Chile",
      "Colombia",
      "Ecuador",
      "Guyana",
      "Paraguay",
      "Peru",
      "Suriname",
      "Uruguay",
      "Venezuela"
    ],
  
    Ozeanien: [
      "Australia",
      "Fiji",
      "Kiribati",
      "Marshall Islands",
      "Micronesia",
      "Nauru",
      "New Zealand",
      "Palau",
      "Papua New Guinea",
      "Samoa",
      "Solomon Islands",
      "Tonga",
      "Tuvalu",
      "Vanuatu"
    ]
  };
  

// GeoJSON
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(response => response.json())
  .then(data => {
    countryLayer = L.geoJSON(data, {
      style: {
        color: '#4caf50',
        weight: 1,
        fillOpacity: 0.1
      },
      onEachFeature: function (feature, layer) {
        layer.on('click', () => {
          if (document.getElementById('map').classList.contains('active')) {
            selectCountry(feature, layer);
          }
        });
      }
    }).addTo(map);
  });

// Select Bundle
function selectBundle(element, price) {
  resetSelection();
  document.querySelectorAll('.region-button').forEach(b => b.classList.remove('selected'));
  element.classList.add('selected');
  highlightRegion(element.dataset.region);
  updatePrice(price);
  updateCountryList(regionCountries[element.dataset.region]);
}

// Select Custom
function selectCustom(element) {
  resetSelection();
  document.querySelectorAll('.region-button').forEach(b => b.classList.remove('selected'));
  element.classList.add('selected');
  document.getElementById('map').classList.add('active');
  updatePrice(40);
}

// Highlight Region
function highlightRegion(region) {
  countryLayer.eachLayer(layer => {
    const countryName = layer.feature.properties.name;
    if (regionCountries[region].includes(countryName)) {
      layer.setStyle({
        color: 'red',
        weight: 2,
        fillOpacity: 0.3
      });
    } else {
      countryLayer.resetStyle(layer);
    }
  });
}

// Select Country
function selectCountry(feature, layer) {
  const countryName = feature.properties.name;
  if (!customCountries.includes(countryName)) {
    customCountries.push(countryName);
    totalCustomPrice += 15;
    updatePrice(totalCustomPrice);
    updateCountryList(customCountries);
  }
  layer.setStyle({
    color: 'blue',
    weight: 3,
    fillOpacity: 0.3
  });
}

// Update Country List
function updateCountryList(countries) {
  const countryList = document.getElementById('country-list');
  countryList.textContent = countries.length ? countries.join(', ') : 'Keine Länder ausgewählt.';
}

// Reset Selection
function resetSelection() {
  totalCustomPrice = 40;
  customCountries = [];
  displayedCountries = "";
  countryLayer.eachLayer(layer => countryLayer.resetStyle(layer));
  document.getElementById('map').classList.remove('active');
}

// Update Price Display
function updatePrice(price) {
  const priceDisplay = document.getElementById('price-display');
  priceDisplay.textContent = `Preis: ${price} €`;
}
