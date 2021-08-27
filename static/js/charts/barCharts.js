// CREATES AND UPDATES THE SUCCESS AND DEATH BAR CHARTS //
//////////////////////////////////////////////////////////

// FUNCTION RECEIVES THE DATA FOR THE ONE OF TWO BAR CHARTS, AND ITS ID TAG

function BarChart(data, id) {
    
    // Convert to numeric
    data.forEach(d => {
        d.score = +d.score
    })

    // Set dimension for the SVG
    var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    if (id == "#success-bar-vis") {
        var adjustment_factor = 5
        var axis_text = "Chance of Success (%)"
    } else {
        var adjustment_factor = 0.2
        var axis_text = "Risk of Death (%)"
    }

    max = d3.max(data, d => d.score) + adjustment_factor

    if (max > 100) {
        max == 100
    }



    // Create/update the scales with the latest data 
    var xBandScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, width])
        .padding(0.1);

    var yLinearScale = d3.scaleLinear()
        .domain([0, max])
        .range([height, 0])


    // select the svg area
    var svgArea = d3.select("body").select("svg");
    
    // If empty create the charts, otherwise update them
    if (!svgArea.empty() & first_load != true) {
        updateBarChart(data, yLinearScale, height)

    } else {
        initiateBarChart(data, xBandScale, yLinearScale, width, height, margin.left, margin.right, margin.top, margin.bottom)
    }

    // CHART INITIALISER
    function initiateBarChart(data, xBandScale, yLinearScale, width, height, margin_left, margin_right, margin_top, margin_bottom) {
       
        var svg = d3.select(id)
        svg.selectAll("*").remove()
        
        // Apprend the svg
        var svg = d3.select(id)
            .append('svg')
            .attr('width', width + margin_left + margin_right)
            .attr('height', height + margin_top + margin_bottom)
            .append(`g`)
            .attr('transform', 'translate(' + margin_left + ',' + margin_right + ')');
        
        // Append the axes
        svg.append(`g`)
            .attr('class', 'y axis')
            .call(d3.axisLeft(yLinearScale))

        svg.append(`g`)
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'x axis')
            .call(d3.axisBottom(xBandScale))  
        
        // Append the bars
        var bars = svg.selectAll('.bar')       
    
        colours = ['#fe8a71','#0e9aa7','#3da4ab', '#f6cd61']
    
        bars 
         .data(data)
         .enter()
         .append('rect')
         .attr('class', 'bar')
         .style("fill", function(d, i) { return colours[i]})
         .attr('x', d => xBandScale(d.label))
         .attr('width', xBandScale.bandwidth())
         .attr('y', d => yLinearScale(d.score))
         .attr('height', d => height - yLinearScale(d.score))
        
        // Append the text labels   
        svg.selectAll(".text")
            .data(data)
         .enter().append("text") 
          .attr("class", "text")
          .attr("text-anchor", "start")
          .attr("font-size", "18px")
          .attr("x", d => (xBandScale(d.label)+12))
          .attr("y", height/2)
          .text(d => {
            if (d.score < 0.1) {
                return "<0.01%"
            }
            else {
                return `${d.score.toFixed(2)}%`
            };
          });    

        // Append the axis labels 
        svg.append("text")
          .attr("transform", `translate(-30, ${(height / 2)+50}) rotate(-90)`)
          .attr("class", "axis-label")
          .style("font-size", "14px")
          .text(axis_text);
    
    }

    // CHART UPDATER
    function updateBarChart(data, yLinearScale, height) {

        var svg = d3.select(id)
        
        // Update the axis scale
        y_axis = d3.axisLeft(yLinearScale);

        // Transition the y-axis
        svg.select(".y.axis")
            .transition()
            .duration(1000)
            .call(y_axis) 
            
        // Transition the bars
        svg.selectAll('rect')
            .data(data)
            .transition()
            .duration(2000)
            .attr('y', d => yLinearScale(d.score))
            .attr('height', d =>  height - yLinearScale(d.score))
        
        // Transition the text labels
        svg.selectAll(".text")
            .data(data)
            .transition()
            .duration(2000)
            .attr("x", d => (xBandScale(d.label)+12))
            .attr("y", height/2)
            .text(d => {
                if (d.score < 0.1) {
                    return "<0.01%"
                }
                else {
                    return `${d.score.toFixed(2)}%`
                };   
            })
    }




};


                
                
           
