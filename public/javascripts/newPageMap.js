mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [77.59105480145251, 12.978133187015658],
    zoom: 14
});
var marker1 = new mapboxgl.Marker();
var currentMarkers = [];
map.on('click', async function (e) {
    var coordinates = e.lngLat;
    if (currentMarkers !== null) {
        for (var i = currentMarkers.length - 1; i >= 0; i--) {
            currentMarkers[i].remove();
        }
    }

    marker1.setLngLat(coordinates)
        .addTo(map);
    currentMarkers.push(marker1);
    let lng = e.lngLat.lng;
    let lat = e.lngLat.lat;
    const reverseGeocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&access_token=pk.eyJ1Ijoic3VrZWVydGhpIiwiYSI6ImNrcjRwNW1jajE2aDAydXJ4cHVsZnRkNmsifQ.avto11daM0M1eyX5uZWRHg`;
    let response = await fetch(reverseGeocodeURL);
    let res = await response.json();
    let place = res.features[0].place_name;
    new mapboxgl.Popup()
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

geocoder.on('result', function (e) {
    // if (currentMarkers !== null) {
    //     for (var i = currentMarkers.length - 1; i >= 0; i--) {
    //         currentMarkers[i].remove();
    //     }
    // }
    // marker1.setLngLat(coordinates)
    //     .addTo(map);
    // currentMarkers.push(marker1);
    document.getElementById('geocode').value = `${e.result.geometry.coordinates[0]},${e.result.geometry.coordinates[1]}`;
    document.getElementById('location').value = e.result.place_name;
});