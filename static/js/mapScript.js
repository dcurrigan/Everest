mapboxgl.accessToken = 'pk.eyJ1IjoiZGN1cnJpZ2FuIiwiYSI6ImNrcjdreHRmNDJvY3Yyb21ubWlqamllYWsifQ.Gp70CMOYPnRIGC5PcdS0fQ';

var map = new mapboxgl.Map({
container: 'map',
zoom: 11.5,
center: [86.925, 27.985],
pitch: 70.1,
bearing:11.92,
style: 'mapbox://styles/dcurrigan/cksrdtcqo2l4217mfgvb8q9il'
});

map.on('load', () => {
    
    
    map.addSource('mapbox-dem', {
    'type': 'raster-dem',
    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    'tileSize': 512,
    'maxzoom': 14
    });
    
    
    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 2 });
     
    // add a sky layer that will show when the map is highly pitched
    map.addLayer({
    'id': 'sky',
    'type': 'sky',
    'paint': {
    'sky-type': 'atmosphere',
    'sky-atmosphere-sun': [0.0, 0.0],
    'sky-atmosphere-sun-intensity': 15
    }})

    map.scrollZoom.disable();
    
});


function rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    map.rotateTo((timestamp / rotation_speed) % 360, { duration: 0 });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
}

map.on('load', () => {
        // Start the animation.
        rotateCamera(0);
         
        // Add 3d buildings and remove label layers to enhance the map
        const layers = map.getStyle().layers;
        for (const layer of layers) {
        if (layer.type === 'symbol' && layer.layout['text-field']) {
        // remove text labels
        map.removeLayer(layer.id);
        }
        }
});








