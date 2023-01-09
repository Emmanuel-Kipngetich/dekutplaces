mapboxgl.accessToken = 'pk.eyJ1IjoiZW1tYW51ZWwta2lwbmdldGljaCIsImEiOiJjbGI3b3hsajUwNnZ5M3ZuNWNtOW9uNzR4In0.6N1mM0xgWDhT44uaNVRVBA';
    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [36.960647, -0.394718],
        zoom: 15
    });

    map.addControl(
        new MapboxDirections({
            accessToken: mapboxgl.accessToken
        }),
        'top-left'
    );

    // Add the geolocate control to the map
map.addControl(new mapboxgl.GeolocateControl({
  position: 'top-middle',
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
}));


// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

document.getElementById('search-button').addEventListener('click', function() {
  var searchInput = document.getElementById('search-input').value;
  var response = requests.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInput}.json`, { params: { access_token: 'pk.eyJ1IjoiZW1tYW51ZWwta2lwbmdldGljaCIsImEiOiJjbGI3b3hsajUwNnZ5M3ZuNWNtOW9uNzR4In0.6N1mM0xgWDhT44uaNVRVBA' }});
  var responseJson = response.json();
  if (responseJson["features"]) {
    var latitude = responseJson["features"][0]["center"][1];
    var longitude = responseJson["features"][0]["center"][0];
    map.setCenter([longitude, latitude]);
  }
});

