
first_load = true


var dropDown = d3.select("#country")
features = []

// Define the location of the samples dataset
const url = '/api/v1.0/dropdown';

// Trigger an update of the dashboard when the dropdown selection is changed
// d3.selectAll("#selDataset").on("change", optionChanged);

var width = 350
var height = 200

var margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
}

var svg = d3.select('#success-bar-vis')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;   

var data = {};



// var x_scale = d3.scaleBand()
//     .rangeRound([0, width])
//     .padding(0.1);

// var y_scale = d3.scaleLinear()
//     .range([height, 0]);

var colour_scale = d3.scaleQuantile()
    .range(["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

svg.append('g')
    .attr('class', 'y axis');


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


