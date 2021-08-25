


function ageLineChart(data) {

    data.forEach(d => {
        if (d.death < 0.1) {
            d.death = 1        }  
    });
    
    const svgArea = d3.select("#crowding-line-vis")

    // If empty create the charts, otherwise update them
    if (!svgArea.empty() & first_load != true) {
        updateLineChart(data)
    } else {
        initiateFirstLineChart(data)
        initiateSecondLineChart(data)
    }
    
             

    function initiateFirstLineChart(data) {
        
        var margin = {top: 10, right: 10, bottom: 20, left: 40},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;       

        var xLinearScale = d3.scaleLinear()
            .domain([15,70])
            .range([0, width])
    
        // set the max value for the y-axis
        max = d3.max(data, d => d.success) + 5
        if (max > 100) {
            max = 100
        }
   
        var yLinearScale = d3.scaleLinear()
            .domain([0, max])
            .range([height, 0])


        xaxis = d3.axisBottom().scale(xLinearScale)
        yaxis = d3.axisLeft().scale(yLinearScale)

        var svg = d3.select("#age-success-line-vis")
        
        svg.append("svg")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`)

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(40," + (height+margin.top) + ")")
            .call(xaxis);
    
        svg.append("g")
            .attr("class", "success-y-axis")
            .attr("transform", "translate("+ [margin.left, margin.top] +")")
            .call(yaxis)


        colours = ['#fe8a71','#0e9aa7','#3da4ab', '#f6cd61']

        success_line = svg.append("path")
                    .datum(data)
                    .attr("class", "age-success-line")
                    .attr("fill", "none")
                    .attr("stroke", "#0e9aa7")
                    .attr("stroke-width", 1.5)
                    .attr("class", "age-success-line")
                    .merge(svg)
                    .transition()
                    .duration(1000)
                    .attr("d", d3.line()
                        .x(d =>(xLinearScale(d.age)+margin.left))
                        .y(d => (yLinearScale(d.success)+margin.top)))
                    

        svg.append("text")
            .attr("transform", `translate(${(width / 2)+20}, ${height + 43 })`)   
            .attr("class", "axis-label")
            .style("font-size", "14px")
            .text("Age") 
            
        svg.append("text")
        .attr("transform", `translate(10, ${(height / 2)+70}) rotate(-90)`)
        .attr("class", "axis-label")
        .style("font-size", "14px")
        .text("Chance of Success (%)");

      

        first_load = false
    }

    function initiateSecondLineChart(data) {
        
        var margin = {top: 10, right: 10, bottom: 20, left: 40},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;       

        var xLinearScale = d3.scaleLinear()
            .domain([15,70])
            .range([0, width])
    
        var yLinearScale = d3.scaleLinear()
            .domain([0, (d3.max(data, d => d.death)+1)])
            .range([height, 0])


        xaxis = d3.axisBottom().scale(xLinearScale)
        yaxis = d3.axisLeft().scale(yLinearScale).ticks(8)

        svg = d3.select("#age-death-line-vis")
        
        svg.append("svg")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`)

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(40," + (height+margin.top) + ")")
            .call(xaxis);
    
        svg.append("g")
            .attr("class", "death-y-axis")
            .attr("transform", "translate("+ [margin.left, margin.top] +")")
            .call(yaxis)

        
        colours = ['#fe8a71','#0e9aa7','#3da4ab', '#f6cd61']


        success_line = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#f6cd61")
            .attr("stroke-width", 1.5)
            .attr("class", "age-death-line")
            .attr("d", d3.line()
                .x(d =>(xLinearScale(d.age)+margin.left))
                .y(d => (yLinearScale(d.death)+margin.top)))
        

        svg.append("text")
            .attr("transform", `translate(${(width / 2)+20}, ${height + 43 })`)   
            .attr("class", "axis-label")
            .style("font-size", "14px")
            .text("Age") 
            
        svg.append("text")
        .attr("transform", `translate(10, ${(height / 2)+70}) rotate(-90)`)
        .attr("class", "axis-label")
        .style("font-size", "14px")
        .text("Risk of Death (%)");

        first_load = false
    }





    function updateLineChart() {
        

        
        var margin = {top: 10, right: 10, bottom: 20, left: 40},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;       

        var xLinearScale = d3.scaleLinear()
            .domain([15,70])
            .range([0, width])
    

        // First transition the age/success elements 
        svg = d3.select("#age-success-line-vis")

        console.log((d3.max(data, d => d.success)))
        // set the max value for the y-axis
        max = d3.max(data, d => d.success) + 5
        if (max > 100) {
            max = 100
        }
   
        // create the scale and y-axis
        var yLinearScale = d3.scaleLinear()
            .domain([0, max])
            .range([height, 0])

        y_axis = d3.axisLeft().scale(yLinearScale)

        // transition the y-axis
        svg.select(".success-y-axis")
            .transition()
            .duration(1000)
            .call(y_axis) 

        // update the dataset
        svg.select(".age-success-line")
            .datum(data)

        // set the new values for the line path
        var line = d3.line()
            .x(d =>(xLinearScale(d.age)+margin.left))
            .y(d => (yLinearScale(d.success)+margin.top))

        // create a transition object of duration 1sec 
        var trans = svg.transition().duration(1000);

        // transition the line points
        trans.selectAll(".age-success-line")
        .attr("d", line)

        // Now transition the age/death elements 
        svg = d3.select("#age-death-line-vis")

        console.log((d3.max(data, d => d.death)))
        // create the scale and y-axis
        yLinearScale = d3.scaleLinear()
            .domain([0, (d3.max(data, d => d.death)+1)])
            .range([height, 0])

        y_axis = d3.axisLeft().scale(yLinearScale)

        // transition the y-axis
        svg.select(".death-y-axis")
            .transition()
            .duration(1000)
            .call(y_axis) 

        // update the dataset
        svg.select(".age-death-line")
            .datum(data)

        // set the new values for the line path
        line = d3.line()
            .x(d =>(xLinearScale(d.age)+margin.left))
            .y(d => (yLinearScale(d.death)+margin.top))

        // create a transition object of duration 1sec 
        trans = svg.transition().duration(1000);

        // transition the line points
        trans.selectAll(".age-death-line")
        .attr("d", line)




    
    }
    
    
    
    // })
    





}
