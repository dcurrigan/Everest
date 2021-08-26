
first_load = true

const url = '/api/v1.0/dropdown';
rotation_speed = 300

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

d3.select("#map-rotation").on("change", function() {
    console.log("got here")
    state = d3.select("#map-rotation").property("checked") 
    if (state == true) {
        rotation_speed = 300
    } else {
        rotation_speed = 99999999999999
    }
});


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


