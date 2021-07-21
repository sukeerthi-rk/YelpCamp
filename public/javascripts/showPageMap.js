mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: geocord.coordinates, // starting position [lng, lat]
    zoom: 14 // starting zoom

});

new mapboxgl.Marker()
    .setLngLat(geocord.coordinates)
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());