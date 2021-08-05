mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: waterfall.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

new mapboxgl.Marker()
.setLngLat(waterfall.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(`<h3>${waterfall.title}</h3><p>${waterfall.location}</p>`)
)
.addTo(map);