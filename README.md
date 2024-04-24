# Google Maps
Tech share by Ice-Water

## Introduction
Map services are a great tool in our modern age. There are many such services offered by many companies. We will showcase how you can use Google's map services on your website. In this tech guide, we want to share with you how you can do these actions with Google Maps:
- Autocomplete an input box
- Autofill text in the input box by clicking on the map
- Directions
- Nearby Search

- The final code of this tech share is available in this repository, feel free to look around. You will need to get your API key and add it to the script tag at the bottom of the HTML page.
- 
## Setup & Installation
1. First, you will need to get your API key. You can get one by following the instructions [here](https://developers.google.com/maps/documentation/javascript/get-api-key#:%7E:text=Go%20to%20the%20Google%20Maps%20Platform%20%3E%20Credentials%20page.&text=On%20the%20Credentials%20page%2C%20click,Click%20Close). 
> **Important:** You will need a credit/debit card.
2. Now you will set up these files:
   - index.html
   - code.js
   - css.css (optional)
3. Now we will set up the html file that we will be using for the remainder of the guide.<br>
```ruby
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Maps Example</title>
  <link rel="stylesheet" href="css.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>
<body>
  <div class="inputs">
    <p class="input">Type an address, or click on the map to autofill it:</p>
    <input id="source" class="inputBox" placeholder="Enter source">
  </div>
  <div class="directions">
    <p class="panelrow">
      <label for="destination">Direction to:</label>
      <input type="text" id="directionDestination" class="inputBox" placeholder="Enter destination">
      <label for="start">Direction from:</label>
      <input type="text" id="directionStart" class="inputBox" placeholder="Enter start">
    </p>
    <p class="panelrow">
      WALK <input name="routetype" id="walking" type="radio" value="WALKING" checked> <br>
      DRIVE <input name="routetype" id="driving" type="radio" value="DRIVING"> <br>
      TRANS<input name="routetype" id="transit" type="radio" value="TRANSIT">
    </p>
    <button onclick="calculateRoute()">Get Directions</button>
  </div>
  <div id="map" style="height:400px; width:100%;"> 
  </div>

  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap" async defer></script>
  
  
  <script src="code.js"></script> 
</body>
</html>
```

4. Now we need to set up the initial  map (in code.js). We will center the map over the UMN.
```ruby
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 44.9727, lng: -93.2354 }, 
    zoom: 15
  });

}
```

Congratulations! Now your website should be showing a map! Keep following the code below to add more features.

## Autocomplete an input box
![image](https://github.com/JabirDA/Tech-Share-Ice-Water/assets/39343454/9aab9999-8f84-48bf-b693-692be1f33856)

When a user types in an address, it can very helpful to show options that are smilar to the typed in address. This is where the autocomplete options come in. You will need to insert this in your ```initmap()``` fucntion: ```initAutoComplete();```.

Outside of  ```initMap()```, add the following code:



```ruby
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
```


## Autofill text in the input box by clicking on the map


https://github.com/JabirDA/Tech-Share-Ice-Water/assets/39343454/ee22901f-5158-43b7-bc82-33daab5ca24b



The user may see a place on the map and want to get the location's address into their input box. To get the autofill feature to work, add this code into  ```initmap()```: 
```ruby
  map.addListener('click', function(e) {
    geocodeLatLng(e.latLng, map);
  });
```

Outside of  ```initMap()```, add the following code:
```ruby
function geocodeLatLng(latLng, map) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'location': latLng }, function(results, status) {
    if (status === 'OK' && results[0]) {
      const address = results[0].formatted_address;
      document.getElementById('source').value = address;  
    } else {
      console.error('Geocoder failed:', status);
    }
  });
}
```

## Directions



https://github.com/JabirDA/Tech-Share-Ice-Water/assets/39343454/e0bfaed4-c8b0-4e5e-a5fa-5f811b1fa73a



A large part of map services is providing directions from point A to point B. We will show you how your users can get directions from their current location to their desired destination. Below are the steps you need to follow to do this:
1. We will need to hold the user's current location (in the variable startPos). Before your  ```initMap()``` function, add these variables:
```ruby
  let map, directionsRenderer, directionsService;
  let startPos = null;
```
2. Inside of the ```initMap()``` add the following:
```ruby
 directionsRenderer = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer.setMap(map);

  getUserLocation();
```
3. We need to get the user's current location. This is typically used as the start location of a trip. Users have to enable location sharing in their browser for your page so this function can get their location. In the code below, we center the map on the user's location using ```map.setCenter(startPos);```. Add the below code outside of ```initMap()```.
```ruby
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      startPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(startPos);
    }, function() {
      handleLocationError(true, map.getCenter());
    });
  } else {
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  console.error(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  map.setCenter(pos);
}
```

4. Now to calculate the route. We get the start, end, and transportation mode for this route, and then feed it into Google Maps's ```route``` function. Add code below outside of ```initMap()```.
```ruby
function calculateRoute() {
  let start = startPos || document.getElementById('source').value;
  let end = document.getElementById('directionDestination').value;
  let selectedMode = document.querySelector('input[name="routetype"]:checked').value;

  directionsService.route({
    origin: start,
    destination: end,
    travelMode: selectedMode
  }, function(response, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
```

## Nearby Search
Nearby Attractions Official documentation link: ```https://developers.google.com/maps/documentation/places/web-service/search-nearby#maxprice```

The Nearby search component in the Google Maps API is an incredibly expansive and advantageous feature to include in any project with a map. Given some constraints such as location and search radius, this feature can locate attractions within your radius that match your search query. Let's take a look at how it works:

The Nearby Search feature is an HTTP request made to the following link:

```https://maps.googleapis.com/maps/api/place/nearbysearch/output?parameters```

Within this URL there are two parts you need to provide the first being the desired output. The response for this request can be distributed in one of two formats ```JSON``` or ```XML```. So within the URL, you would need to state which of these two you would like by replacing output. For example, if I wanted  a JSON response the link would look like this: 

```https://maps.googleapis.com/maps/api/place/nearbysearch/json?parameters```

Now moving on to the second required part to complete before we get this working which is the parameters. Although there are many parameters that can be used in order to filter your search for example including ```opennow``` which only returns locations that are currently open. Only three parameters are required to send a successful request these are:
``` ruby
Key
LOCATION
RADIUS
```
The ```key``` parameter is what is your identification and how Google verifies you're allowed to make the request. The ```location``` parameter is an object that contains a ```Longitude``` and ```Latitude``` specifying the area in which you would like to query. Lastly, the ```radius``` is simply how wide you would like your search to cover relative to the Location parameter set previously. Here is a completed example using the UMN location:
```ruby
https://maps.googleapis.com/maps/api/place/nearbysearch/json
  ?location=-44.974000, -93.227700
  &radius=1000
  &key=YOUR_API_KEY
```
Here is the query on Postman:
<img width="898" alt="tech-share-photo-1" src="https://github.com/JabirDA/Tech-Share-Ice-Water/assets/101074642/98e5f9a0-63fd-429d-a4ad-bed793352bef">


Although the query worked it's not very helpful so let's add some common additional parameters to make the results more custom. The first parameter we could add is ```keyword``` which is a string that is compared to the name of the location returning any partial matches. The second parameter that could be helpful is ```opennow``` which only returns locations that are currently open. One last useful parameter is ```type``` which filters locations by tags for example bars or hospitals. An important thing to note about tags is that a location may have multiple tags however your tage parameter can only have one value not multiple. 

Utilizing all of these optional features we can create a more accurate response. For example, in the following request, we are looking for food places near the UMN that are open and have the word chicken in the name:
```ruby
https://maps.googleapis.com/maps/api/place/nearbysearch/json
  ?location=-44.974000, -93.227700
  &radius=1000
  &key=YOUR_API_KEY
  &keyword=chicken
  &type=food
  &opennow
```

(Postman request)

<img width="1000" alt="tech-share-photo-8" src="https://github.com/JabirDA/Tech-Share-Ice-Water/assets/101074642/a52b43ec-07ef-40d8-b572-38d1704849b0">


 As we can see within the response the optional filters we added are present for each nearby places returned.

<img width="700" alt="tech-share-photo-4" src="https://github.com/JabirDA/Tech-Share-Ice-Water/assets/101074642/6179056b-61dc-4657-b3b0-29985b5c3b35">
<br>
<img width="300" alt="tech-share-photo-5" src="https://github.com/JabirDA/Tech-Share-Ice-Water/assets/101074642/2b0124b7-5702-4134-a60f-3b0552c2259a">


Although we did mention some of the more popular parameter options there are still a lot more that you could find useful:  
```https://developers.google.com/maps/documentation/places/web-service/search-nearby#optional-parameters```

## Conclusion 
























