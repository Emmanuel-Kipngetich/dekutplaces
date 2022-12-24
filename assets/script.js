mapboxgl.accessToken = 'pk.eyJ1IjoiZW1tYW51ZWwta2lwbmdldGljaCIsImEiOiJjbGI3b3hsajUwNnZ5M3ZuNWNtOW9uNzR4In0.6N1mM0xgWDhT44uaNVRVBA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [36.960617,-0.395416],
  zoom: 15
  
});

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

map.on('load', function() {
  var conn = new psycopg2.Client({
    host: 'database-1.c5xfzctcvd8s.af-south-1.rds.amazonaws.com',
    dbname: 'database-1',
    user: 'Emmanuel_Kipngetich',
    password: 'emmanueldekut'
  });
  conn.connect();
  var cursor = conn.cursor();
  cursor.execute("SELECT address, ST_AsText(location) FROM database-1");
  var addresses = cursor.fetchall();

  map.addLayer({
    id: 'points',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: addresses.map(function(address) {
          var longitude = ST_X(ST_GeomFromText(address[1]));
          var latitude = ST_Y(ST_GeomFromText(address[1]));
          return {
            type: 'Feature',
            properties: {
              description: address[0]
            },
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          };
        })
      }
    },
    layout: {
      'icon-image': 'marker-15',
      'text-field': '{description}',
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 0.6],
      'text-anchor': 'top'
    }
  });
});
