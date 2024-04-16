let map, directionsRenderer, directionsService;
let startPos = null; // store user's current position

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 44.9727, lng: -93.2354 },
    zoom: 15
  });

  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer.setMap(map);

  initAutoComplete();
  getUserLocation(); // get user location on map initialization

  map.addListener('click', function (e) {
    geocodeLatLng(e.latLng);
  });
}

function initAutoComplete() {
  const inputs = ['source'];
  inputs.forEach(inputId => {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      new google.maps.places.Autocomplete(inputElement, { types: ['geocode'] });
    } else {
      console.error('Element not found:', inputId);
    }
  });
}

function geocodeLatLng(latLng) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'location': latLng }, function (results, status) {
    if (status === 'OK' && results[0]) {
      document.getElementById('source').value = results[0].formatted_address;
    } else {
      console.error('Geocoder failed:', status);
    }
  });
}

function calculateRoute() {
  let start = startPos || document.getElementById('source').value;
  let end = document.getElementById('directionDestination').value;
  let selectedMode = document.querySelector('input[name="routetype"]:checked').value;

  directionsService.route({
    origin: start,
    destination: end,
    travelMode: selectedMode
  }, function (response, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      startPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(startPos); // center the map at the user's location
    }, function () {
      handleLocationError(true, map.getCenter());
    });
  } else { // browsr doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  console.error(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  map.setCenter(pos);
}
