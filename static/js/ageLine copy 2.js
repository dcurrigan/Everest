


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
    
    var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;       

    var xLinearScale = d3.scaleLinear()
        .domain([15,70])
        .range([0, width])

    var yLinearScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0])


    xaxis = d3.axisBottom().scale(xLinearScale)
    yaxis = d3.axisLeft().scale(yLinearScale)

    svg = d3.select("#age-success-line-vis")
    
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
        .attr("class", "axis")
        .attr("transform", "translate("+ [margin.left, margin.top] +")")
        .call(yaxis)    

    update()     
    
    function update(data) {

        var update = svg.selectAll("age-success-line")
            .data([data], function(d) {
                return d.success
            })

        update
        .enter()
        .append("path")
        .attr("class", "age-success-line")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
        .x(d =>(xLinearScale(d.age)+margin.left))
        .y(d => (yLinearScale(d.success)+margin.top)))
        .attr("fill", "none")
        .attr("stroke", "#0e9aa7")
        .attr("stroke-width", 1.5)

              
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



    }




        first_load = false
}
