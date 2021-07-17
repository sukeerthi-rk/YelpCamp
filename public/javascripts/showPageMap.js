mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: geocord.geoJson.coordinates, // starting position [lng, lat]
    zoom: 14 // starting zoom

});

new mapboxgl.Marker()
    .setLngLat(geocord.geoJson.coordinates)
    .addTo(map);