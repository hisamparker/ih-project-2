// error: WebGL warning: texImage: Alpha-premult and y-flip are deprecated for non-DOM-Element uploads. is an issue w/mapbox they should update, but not an issue now https://github.com/mapbox/mapbox-gl-js/issues/5292
mapboxgl.accessToken = mapToken;
const parsedSpot = spot.split(`,`);
const map = new mapboxgl.Map({
    container: `map`, // container ID
    style: `mapbox://styles/mapbox/streets-v11`, // style URL
    center: parsedSpot, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(parsedSpot)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h6>${spotName}</h6>`))
    .addTo(map);
