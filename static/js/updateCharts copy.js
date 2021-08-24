


function SuccessBarChart(data) {
    
    data.forEach(d => {
        d.score = +d.score
    })

    var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    var xBandScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, width])
        .padding(0.1);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.score)])
        .range([height, 0])


  
    var svgArea = d3.select("body").select("svg");
      
    if (!svgArea.empty() & first_load != true) {
        updateBarChart(success_data, yLinearScale, height)
        // svgArea.remove();
    } else {
        initiateBarChart(data, xBandScale, yLinearScale, width, height, margin.left, margin.right, margin.top, margin.bottom)
    }

    function initiateBarChart(data, xBandScale, yLinearScale, width, height, margin_left, margin_right, margin_top, margin_bottom) {
       
        var svg = d3.select('#success-bar-vis')
        svg.selectAll("*").remove()
        
        var svg = d3.select('#success-bar-vis')
            .append('svg')
            .attr('width', width + margin_left + margin_right)
            .attr('height', height + margin_top + margin_bottom)
            .append('g')
            .attr('transform', 'translate(' + margin_left + ',' + margin_right + ')');
                
        svg.append("g")
            .attr('class', 'y axis')
            .call(d3.axisLeft(yLinearScale))

        svg.append("g")
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'x axis')
            .call(d3.axisBottom(xBandScale))  
            
           
                
        var bars = svg.selectAll('.bar')       
    
        colours = ['#fe8a71','#0e9aa7','#3da4ab', '#f6cd61']
    
        var success_bars = bars 
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .style("fill", function(d, i) { return colours[i]})
            .attr('x', d => xBandScale(d.label))
            .attr('width', xBandScale.bandwidth())
            .attr('y', d => yLinearScale(d.score))
            .attr('height', d => height - yLinearScale(d.score))
        
                    
        svg.selectAll(".text")
            .data(data)
         .enter().append("text") 
          .attr("class", "text")
          .attr("text-anchor", "start")
          .attr("font-size", "18px")
          .attr("x", d => (xBandScale(d.label)+12))
          .attr("y", height/2)
          .text(d => `${d.score}%`);       



    
  }

    function updateBarChart(data, yLinearScale, height) {
        
        var svg = d3.select('#success-bar-vis')
        
        console.log(data)
        
        
       
        // scaler = d3.scaleLinear()
        //     .domain([0, d3.max(data, d => d.score)])
        //     .range([height, 0])
        y_axis = d3.axisLeft(yLinearScale);

        svg.select(".y.axis")
            .transition()
            .duration(1000)
            .call(y_axis) 
            
        
        svg.selectAll("rect")
            .data(data)
            .transition()
            .duration(2000)
            .attr('y', d => {
                console.log(d.score)
                return yLinearScale(d.score)})
            .attr('height', d => height - yLinearScale(d.score))

        svg.selectAll(".text")
            .data(data)
            .transition()
            .duration(2000)
            .attr("x", d => (xBandScale(d.label)+12))
            .attr("y", height/2)
            .text(d => `${d.score}%`);   
    
    }




};


                
                
           
