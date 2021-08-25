


function ageLineChart(data) {

    console.log(data) 

    
    // d3.json(data).then(function(data) {
        
        
        
        data.forEach(d => {
            if (d.death < 0.1) {
                d.death = 0
            }  
        });
        
        console.log("f")   
        const svgArea = d3.select("#crowding-line-vis")

        // If empty create the charts, otherwise update them
        if (!svgArea.empty() & first_load != true) {
            updateLineChart(data)
        } else {
            initiateLineChart(data)
        }
        
        svg = d3.select("#crowding-line-vis")
                

        function initiateLineChart() {
            
            var margin = {top: 10, right: 10, bottom: 20, left: 40},
            width = 400 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;       

            var xLinearScale = d3.scaleLinear()
                .domain([15,70])
                .range([0, width])
        
            var yLinearScale = d3.scaleLinear()
                .domain([0, 3])
                .range([height, 0])


            xaxis = d3.axisBottom().scale(xLinearScale)
            yaxis = d3.axisLeft().scale(yLinearScale)

            svg = d3.select("#age-line-vis")
            
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

            svg.append("g")

            colours = ['#fe8a71','#0e9aa7','#3da4ab', '#f6cd61']

            // success_line = svg.append("path")
            //             .datum(data)
            //             .attr("fill", "none")
            //             .attr("stroke", "#0e9aa7")
            //             .attr("stroke-width", 1.5)
            //             .attr("d", d3.line()
            //                 .x(d =>(xLinearScale(d.age)+margin.left))
            //                 .y(d => (yLinearScale(d.success)+margin.top)))
            //                 // .curve(d3.curveBasis)
                            

            death_line = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#f6cd61")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                    .x(d =>(xLinearScale(d.age)+margin.left))
                    .y(d => (yLinearScale(d.death)+margin.top)))
                // .curve(d3.curveBasis)
            
                
            // svg.append("circle").attr("cx",855).attr("cy",30).attr("r", 6).style("fill", "#0e9aa7")
            // svg.append("circle").attr("cx",855).attr("cy",60).attr("r", 6).style("fill", "#f6cd61")
            // svg.append('line').attr("x1", 847).attr("x2", 863).attr("y1", 90).attr("y2", 90)
            //     .attr("class", "result-line").style("stroke-width", 1.5).style("stroke", "#fe8a71")
            //     .style("stroke-dasharray", ("3, 3"))

            // svg.append("text").attr("x", 890).attr("y", 30).attr("class", "legend-label").text("Success %").style("font-size", "15px").attr("alignment-baseline","middle")
            // svg.append("text").attr("x", 890).attr("y", 60).attr("class", "legend-label").text("Death %").style("font-size", "15px").attr("alignment-baseline","middle")
            // svg.append("text").attr("x", 890).attr("y", 90).attr("class", "legend-label").text("Your Scores").style("font-size", "15px").attr("alignment-baseline","middle")


            // svg.append("text")
            //     .attr("transform", `translate(${(width / 2) - margin.left}, ${height + 50 })`)   
            //     .attr("class", "axis-label")
            //     .text("Number of Climbers") 
                
            // svg.append("text")
            // .attr("transform", `translate(10, ${(height / 2)+78}) rotate(-90)`)
            // .attr("class", "axis-label")
            // .style("font-size", "14px")
            // .text("Summit Success Rate (%)");

            // svg.append("text")
            // .attr("transform", `translate(${width + margin.left +23}, ${(height / 2)-25}) rotate(90)`)
            // .attr("class", "axis-label")
            // .style("font-size", "14px")
            // .text("Death Rate (%)");
                        
            
            // success_horizontal = svg.append('line')
            //  .attr("x1", 40)
            //  .attr("x2", width+40)
            //  .attr("y1", (successLinearScale(success_dict[0]['score'])+margin.top))
            //  .attr("y2", (successLinearScale(success_dict[0]['score'])+margin.top))
            //  .attr("class", "success-result-line")
            //  .style("stroke-width", 1.5)      
            //  .style("stroke", "#fe8a71")
            //  .style("stroke-dasharray", ("3, 3"))

             
             
            // //  Adjust the line/text height for very low risk values 
            // if ((deathLinearScale(death_dict[0]['score']) < (height+ margin.top))) {
            //     line_height = height + margin.top
            //     text_height = height + margin.top - 8
            // }
            // else {
            //     line_height = deathLinearScale(death_dict[0]['score']) + margin.top
            //     text_height = deathLinearScale(death_dict[0]['score']) + margin.top - 8
            // }

            // if (success_dict[0]['score'] > 90) {
            //     adjustment_factor  = -20
            // } 
            // else {
            //     adjustment_factor  = 8
            // }
             
             
             
            // death_horizontal = svg.append('line')
            //     .attr("x1", 40)
            //     .attr("x2", width+40)
            //     .attr("y1", line_height)
            //     .attr("y2", line_height)
            //     .attr("class", "death-result-line")
            //     .style("stroke-width", 1.5)      
            //     .style("stroke", "#fe8a71")
            //     .style("stroke-dasharray", ("3, 3"))

            // svg.append("text")
            //     .attr("transform", `translate(${(width-margin.left-25)}, ${successLinearScale(success_dict[0]['score'])+margin.top - adjustment_factor })`) 
            //     .attr("class", "success-personal-label")
            //     .style("font-size", "13px")
            //     .text("Your Success (%)");

               
            // svg.append("text")
            //     .attr("transform", `translate(${(width-margin.left-38)}, ${text_height})`)                                    
            //     .attr("class", "death-personal-label")
            //     .style("font-size", "13px")
            //     .text("Your Risk Death (%)");           

            first_load = false
        }





        function updateLineChart() {
            
            // var margin = {top: 10, right: 10, bottom: 20, left: 40},
            // width = 800 - margin.left - margin.right,
            // height = 400 - margin.top - margin.bottom;           
       
            // var successLinearScale = d3.scaleLinear()
            //     .domain([0, 100])
            //     .range([height, 0])

            // var deathLinearScale = d3.scaleLinear()
            //     .domain([0, d3.max(data, d => d[2])])
            //     .range([height+margin.top, 0])
            
            // var svg = d3.select("#crowding-line-vis")
            
            // svg.select(".success-result-line")
            // .transition()
            // .duration(1000)
            // .attr("x1", 40)
            // .attr("x2", width+40)
            // .attr("y1", (successLinearScale(success_dict[0]['score'])+margin.top))
            // .attr("y2", (successLinearScale(success_dict[0]['score'])+margin.top)) 


            // line_height = deathLinearScale(death_dict[0]['score'])
            // text_height = deathLinearScale(death_dict[0]['score']) - 8


            // if (success_dict[0]['score'] > 90) {
            //     adjustment_factor  = -20
            // } 
            // else {
            //     adjustment_factor  = 8
            // }



            // svg.select(".death-result-line")
            // .transition()
            // .duration(1000)
            //     .attr("x1", 40)
            //     .attr("x2", width+40)
            //     .attr("y1", line_height)
            //     .attr("y2", line_height)

            // svg.select(".success-personal-label")
            //     .transition()
            //     .duration(1000)
            //     .attr("transform", `translate(${(width-margin.left-25)}, ${successLinearScale(success_dict[0]['score'])+margin.top - adjustment_factor })`)   

            // svg.select(".death-personal-label")
            // .transition()
            // .duration(1000)
            // .attr("transform", `translate(${(width-margin.left-38)}, ${text_height})`)   


        
        }
    
    
    
    // })
    





}
