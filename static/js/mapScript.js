// mapboxgl.accessToken = 'pk.eyJ1IjoiZGN1cnJpZ2FuIiwiYSI6ImNrcjdreHRmNDJvY3Yyb21ubWlqamllYWsifQ.Gp70CMOYPnRIGC5PcdS0fQ';

// var map = new mapboxgl.Map({
// container: 'map',
// zoom: 13.9,
// center: [86.7250, 27.9881],
// pitch: 100,
// bearing:140,
// style: 'mapbox://styles/mapbox/satellite-v9'
// });

// map.on('load', () => {
//     map.addSource('mapbox-dem', {
//     'type': 'raster-dem',
//     'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
//     'tileSize': 512,
//     'maxzoom': 14
//     });
//     // add the DEM source as a terrain layer with exaggerated height
//     map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 2 });
     
//     // add a sky layer that will show when the map is highly pitched
//     map.addLayer({
//     'id': 'sky',
//     'type': 'sky',
//     'paint': {
//     'sky-type': 'atmosphere',
//     'sky-atmosphere-sun': [0, 0],
//     'sky-atmosphere-sun-intensity': 45,
//     }
//     });
// });