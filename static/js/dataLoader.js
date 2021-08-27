
// Create global variables that operate between data files to hold data and control function operations
var first_load = true

var success_data = []
var death_data = []
var age_data = []
var crowding_value = 100

const url = '/api/v1.0/dropdown';
var rotation_speed = 300

 // Create event listeners for the form elements
 d3.select("#gender").on("change", updateData)
 d3.select("#age").on("change", updateData)
 d3.select("#country").on("change", updateData)
 d3.select("#route").on("change", updateData)
 d3.select("#ascent").on("change", updateData)
 d3.select("#descent").on("change", updateData)
 d3.select("#sleep").on("change", updateData)
 d3.select("#climber").on("change", updateData)
 d3.select("#cook").on("change", updateData)
 d3.select("#doctor").on("change", updateData)
 d3.select("#deputy").on("change", updateData)
 d3.select("#leader").on("change", updateData)
 d3.select("#other").on("change", updateData)
 d3.select("#crowding-state").on("change", updateData)
 d3.select(".slider").on("change", updateData)

//  Turn the map rotation on and off
 d3.select("#map-rotation").on("change", function() {
    console.log("got here")
    state = d3.select("#map-rotation").property("checked") 
    if (state == true) {
        rotation_speed = 300
    } else {
        rotation_speed = 99999999999999
    }
});

// Show/hide the about/visualisations div's
function showHideVis() {
    document.getElementById('about-container').style.display = "none";
    document.getElementById("welcome-container").style.display = "none";
    document.getElementById('vis-container').style.display = "block";
    map.resize()
}

function showHideAbout() {
    document.getElementById("welcome-container").style.display = "none";
    document.getElementById('vis-container').style.display = "none";
    document.getElementById('about-container').style.display = "block";
    map.resize()
}

// Renders data on initial page load
function loadData() {
    // Fetch the JSON data from samples.json
    d3.json(url).then(function(data) {
               
        // Add the countries to the dropdown 
        d3.select("#country")
        .selectAll('myOptions')
        .data(data)
        .enter()
            .append('option')
            .text(function (d) { return d[0]; }) // text showed in the dropdown
            .attr("class", "country")
            .attr("value", function (d) { return d[0]; }) // corresponding value returned by the dropdown
            .style("padding-bottom","10px")
            .style("padding-top","10px")
                
        // Default value of the drop down 
         d3.select("#country").property("value", "Australia")
        
    }).then(x => {
        // Call updateData to get the current data
        updateData()
    })

};

loadData()

// Function to update the date on change
function updateData() {
   
    // Collect the data from the form 
    gender = d3.select("#gender").property("value")
    age = d3.select("#age").property("value")
    country = d3.select("#country").property("value")
    route = d3.select("#route").property("value")
    ascent = d3.select("#ascent").property("checked")
    descent = d3.select("#descent").property("checked")
    sleep = d3.select("#sleep").property("checked")
    jobs = ['#climber', '#cook', '#doctor', '#deputy', '#leader', '#other']
    jobs.forEach(item => {
        if ((d3.select(item).property("checked")) == true ) {
            job = (d3.select(item).property("value"))
        };
    });
    crowding_state = d3.select("#crowding-state").property("checked")

    // set the "Standard Route Feature Variable"
    if (route == "other") {
        std_route = false
    }
    else {
        std_route = true
    };

    // set the "Any O2 Feature Variable"
    if (ascent == true || descent == true || sleep == true) {
        o2_any = true
    }
    else {
        o2_any = false
    }

    // Combine variables into an array
    features = [{gender, age, country, route, o2_any, ascent, descent, sleep, std_route, job, crowding_value,crowding_state, }]

    // fetch data for the bar chart 
    fetch(`api/v1.0/bar/`, {
        method: "POST",
        body: JSON.stringify(features),
        cache: "no-cache",
        headers: new Headers({"content-type": "application/json"})
    })
    .then(response => { 
        response.json()
        .then(function(data) {
            // Organise the response into two javascript objects (success and death data)
            success_data = [{'label':'Your Succuss %','score':data[0]['your_success']},
            {'label':'Avg for Gender', 'score': data[0]['gender_success']},
            {'label':'Avg for age','score':data[0]['age_success']},
            {'label':'Overall Average', 'score':data[0]['overall_success']}]

            death_data =   [{'label':'Your Risk %','score':data[0]['your_death']},
            {'label':'Avg for Gender', 'score': data[0]['gender_death']},
            {'label':'Avg for age','score':data[0]['age_death']},
            {'label':'Overall Average', 'score':data[0]['overall_death']}]
            

        }).then(function(data) {
            // Create the bar charts (functions in barCharts.js)
            BarChart(success_data, "#success-bar-vis")
            BarChart(death_data, "#death-bar-vis")
        }).then(function(data) {
            // Create the bar charts (function in crowdingLine.js)
            crowdingLine(success_data, death_data)
        })

    })
    
    fetch(`api/v1.0/age/`, {
        method: "POST",
        body: JSON.stringify(features),
        cache: "no-cache",
        headers: new Headers({"content-type": "application/json"})
    })
    .then(response => { 
        response.json()
        .then(function(data) {
            // Create the age line charts (function in ageLine.js)
            ageLineChart(data)
        }).then(function(data)  {
            
        })
    })

 };

// Create the map background
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
     
    // add a sky layer that will show when the map pitched
    map.addLayer({
    'id': 'sky',
    'type': 'sky',
    'paint': {
    'sky-type': 'atmosphere',
    'sky-atmosphere-sun': [0.0, 0.0],
    'sky-atmosphere-sun-intensity': 15
    }})

    // disable user map zoom
    map.scrollZoom.disable();
    
});

// Rotate the map around the everest lat lon coordinates
function rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    map.rotateTo((timestamp / rotation_speed) % 360, { duration: 0 });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
}

// Start the animation.
map.on('load', () => {
        
        rotateCamera(0);
         
        
        const layers = map.getStyle().layers;
        for (const layer of layers) {
        if (layer.type === 'symbol' && layer.layout['text-field']) {
        // remove text labels
        map.removeLayer(layer.id);
        }
        }
});