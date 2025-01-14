const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let selectedCountry = null;
let countryLayer;

// Regions
const regionCountries = {
  Europa: ['Germany', 'France', 'Italy', 'Spain', 'Poland'],
  USA: ['United States'],
  Afrika: ['Nigeria', 'Egypt', 'South Africa', 'Kenya'],
  Asien: ['China', 'Japan', 'India', 'South Korea'],
  Ozeanien: ['Australia', 'New Zealand']
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
function selectBundle(element) {
  document.querySelectorAll('.bundle').forEach(b => b.classList.remove('selected'));
  element.classList.add('selected');
  const region = element.dataset.region;

  if (region === 'Custom') {
    document.getElementById('map').classList.add('active');
    countryLayer.eachLayer(layer => countryLayer.resetStyle(layer));
  } else {
    highlightRegion(region);
    document.getElementById('map').classList.remove('active');
  }

  document.getElementById('form').style.display = 'block';
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
  if (selectedCountry) {
    countryLayer.resetStyle(selectedCountry);
  }
  selectedCountry = layer.feature;
  layer.setStyle({
    color: 'blue',
    weight: 3,
    fillOpacity: 0.3
  });
}

// Smooth Scroll
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
