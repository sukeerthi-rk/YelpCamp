mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campgroundLocation,
    zoom: 14
});

var currentMarkers = [];
var mapPopup = new mapboxgl.Popup()
map.on('click', async function (e) {
    var coordinates = e.lngLat;
    if (currentMarkers !== null) {
        for (var i = currentMarkers.length - 1; i >= 0; i--) {
            currentMarkers[i].remove();
        }
    }

    var marker1 = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);
    currentMarkers.push(marker1);
    let lng = e.lngLat.lng;
    let lat = e.lngLat.lat;
    const reverseGeocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&access_token=pk.eyJ1Ijoic3VrZWVydGhpIiwiYSI6ImNrcjRwNW1jajE2aDAydXJ4cHVsZnRkNmsifQ.avto11daM0M1eyX5uZWRHg`;
    let response = await fetch(reverseGeocodeURL);
    let res = await response.json();
    let place = res.features[0].place_name;
    mapPopup
        .setLngLat(coordinates)
        .setHTML('place selected: <br/>' + place)
        .addTo(map);
    document.getElementById('geocode').value = `${lng},${lat}`;
    document.getElementById('location').value = place;
});

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
})
map.addControl(geocoder);
map.addControl(new mapboxgl.NavigationControl());

geocoder.on('result', function (e) {
    mapPopup.remove();
    geocoder.clear();
    if (currentMarkers !== null) {
        for (var i = currentMarkers.length - 1; i >= 0; i--) {
            currentMarkers[i].remove();
        }
    }
    var marker2 = new mapboxgl.Marker()
        .setLngLat(e.result.geometry.coordinates)
        .addTo(map);
    currentMarkers.push(marker2);
    document.getElementById('geocode').value = `${e.result.geometry.coordinates[0]},${e.result.geometry.coordinates[1]}`;
    document.getElementById('location').value = e.result.place_name;
});