



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

        testFunction()
        // Collect the data from the form 
        gender = d3.select("#gender").property("value")
        age = d3.select("#age").property("value")
        solo = d3.select("#solo").property("value")
        country = d3.select(".country").node().value;
        console.log(country)
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
    
        features = [{gender, age, country, solo, route, o2_any, ascent, descent, sleep, std_route, job}]
        console.log(features)   
        
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

                death_data =   [{'label':'Your risk of Death %','score':data[0]['your_death']},
                                {'label':'Avg for Gender', 'score': data[0]['gender_death']},
                                {'label':'Avg for age','score':data[0]['age_death']},
                                {'label':'Overall Average', 'score':data[0]['overall_death']}]
                
                success_data.forEach(d => {
                    d.score = +d.score
                })

                death_data.forEach(d => {
                    d.score = +d.score
                })
                
                var xBandScale = d3.scaleBand()
                .domain(success_data.map(d => d.label))
                .range([0, width])
                .padding(0.1);
            
                
                var yLinearScale = d3.scaleLinear()
                    .domain([0, d3.max(success_data, d => d.score)])
                    .range([height, 0]);
            
                var y_axis = d3.axisLeft(yLinearScale);
                var x_axis = d3.axisBottom(xBandScale);
                            
                var bars = svg.selectAll('.bar')       

                colours = ['#fe8a71','#0e9aa7','#3da4ab', '#f6cd61']

                var success_bars = bars 
                    .data(success_data)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .style("fill", function(d, i) { return colours[i]})
                    .attr('x', d => xBandScale(d.label))
                    .attr('width', xBandScale.bandwidth())
                    .attr('y', d => yLinearScale(d.score))
                    .attr('height', d => height - yLinearScale(d.score))




                svg.select('.x.axis')
                    .call(x_axis);

                svg.select('.y.axis')
                    // .transition(t)
                    .call(y_axis);
                
            
            
            
            
            
            
                        
                
            
            })

        
        
    
    })
})}    



loadData()







// // Collect the data from the form 
// gender = d3.select("#gender").property("value")
// age = d3.select("#age").property("value")
// solo = d3.select("#solo").property("value")
// country = d3.select(".country").node().value;
// console.log(country)
// route = d3.select("#route").property("value")
// ascent = d3.select("#ascent").property("checked")
// descent = d3.select("#descent").property("checked")
// sleep = d3.select("#sleep").property("checked")

// jobs = ['#climber', '#cook', '#doctor', '#deputy', '#leader', '#other']
// jobs.forEach(item => {
//     if ((d3.select(item).property("checked")) == true ) {
//         job = (d3.select(item).property("value"))
//     };
// });

// if (route == "other") {
//     std_route = false
// }
// else {
//     std_route = true
// };

// if (ascent == true || descent == true || sleep == true) {
//     o2_any = true
// }
// else {
//     o2_any = false
// }

// features = [gender, age, country, solo, route, o2_any, ascent, descent, sleep, std_route, job]




// console.log(features)
