
first_load = true

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

 d3.select("#map-rotation").on("change", function() {
    console.log("got here")
    state = d3.select("#map-rotation").property("checked") 
    if (state == true) {
        rotation_speed = 300
    } else {
        rotation_speed = 99999999999999
    }
});


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
        updateData()
    }).then(x => {
        
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

    if (route == "other") {
        std_route = false
    }
    else {
        std_route = true
    };

    if (ascent == true || descent == true || sleep == true) {
        o2_any = true
    }
    else {
        o2_any = false
    }

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
            success_data = [{'label':'Your Succuss %','score':data[0]['your_success']},
            {'label':'Avg for Gender', 'score': data[0]['gender_success']},
            {'label':'Avg for age','score':data[0]['age_success']},
            {'label':'Overall Average', 'score':data[0]['overall_success']}]

            death_data =   [{'label':'Your Risk %','score':data[0]['your_death']},
            {'label':'Avg for Gender', 'score': data[0]['gender_death']},
            {'label':'Avg for age','score':data[0]['age_death']},
            {'label':'Overall Average', 'score':data[0]['overall_death']}]
            

        }).then(function(data) {
            BarChart(success_data, "#success-bar-vis")
            BarChart(death_data, "#death-bar-vis")
        }).then(function(data) {
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
            ageLineChart(data)
        }).then(function(data)  {
            
        })
    })

 };


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
         
        
        const layers = map.getStyle().layers;
        for (const layer of layers) {
        if (layer.type === 'symbol' && layer.layout['text-field']) {
        // remove text labels
        map.removeLayer(layer.id);
        }
        }
});