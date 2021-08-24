


function crowdingLine() {

    d3.json('/api/v1.0/line/').then(function(data) {
       
    
        // Convert to numeric
        data.forEach(d => {
            d[1] = +d[1]
            d[2] = +d[2]
        })

       
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
            width = 800 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;           

            var xLinearScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d[0])])
                .range([0, width])
        
            var successLinearScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d[1])])
                .range([height, 0])

            console.log(d3.max(data, d => d[1]))

            var deathLinearScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d[2])])
                .range([height, 0])

            xaxis = d3.axisBottom().scale(xLinearScale)
            yaxis = d3.axisLeft().scale(successLinearScale)
            zaxis = d3.axisRight().scale(deathLinearScale)

            svg = d3.select("#crowding-line-vis")
            
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
                .attr("class", "axis")
                .attr("transform", "translate("+ [(width+margin.left), margin.top] +")")
                .call(zaxis)


            // var maxw= 100
            // svg.selectAll("text").each(function() {
            //     if(this.getBBox().width > maxw) maxw = this.getBBox().width;
            // });
            // svg.attr("transform", "translate(" + maxw + ",0)");




        }


        function updateLineChart() {



            console.log("ended up here")
        
        }
    
    
    
    })
    





}
