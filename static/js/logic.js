mapboxgl.accessToken = 'pk.eyJ1IjoiZGN1cnJpZ2FuIiwiYSI6ImNrcjdreHRmNDJvY3Yyb21ubWlqamllYWsifQ.Gp70CMOYPnRIGC5PcdS0fQ';

var map = new mapboxgl.Map({
container: 'map',
zoom: 12.7,
center: [115.78, -32.05] ,
pitch: 65,
bearing:7,
style: 'mapbox://styles/mapbox/light-v10'
});

d3.json("app.json").then(function(data) {
  console.log(data)
})


map.on('load', function() {

  map.addSource('boundaries', {
    type: 'geojson',
    data: 'app.geojson'
  });
 
  vizMetric = 'population' //this is the colour variable 

  map.addLayer({
    'id': 'boundaries',
    'source': 'boundaries',
    //'source-layer': 'counties',
    //'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 4,
    'paint': {
        //'fill-extrusion-color': '#CCC',
        /*
        'fill-extrusion-color': {
            property: vizMetric,
            stops: [
                [-8, '#DA9C20'],
                [-5, '#E6B71E'],
                [-2, '#EED322'],
                [0, '#CCC'],
            ]
        },
        */
        'fill-extrusion-color': {
            property: vizMetric,
            stops: [
                [10000, '#de2d26'],
                [30000,   '#fee0d2'],
            ]
        },
        'fill-extrusion-height': {
            property: vizMetric,
            stops: [
                [10000, 7000],
                [30000, 2000]                    
            ]
        },
        'fill-extrusion-opacity': .6

    }
}, 'waterway-label');

//   map.addLayer({
//     'id': 'boundaries',
//     'type': 'fill',
//     'source': 'boundaries',
//     'layout': {},
//     'paint': {
//         'fill-color': {
//             property: 'population',
//             stops: [
//                 [-20, '#F2F12D'],
//                 [-5, '#EED322'],
//                 [5, '#E6B71E'],
//                 [20, '#DA9C20'],
//             ]
//         },
//         'fill-opacity': 0.8
//     }
// }, 'waterway-label')






})