

var slider = d3
    .sliderBottom()
    .min(100)
    .max(400)
    .step(100)
    .width(300)
    .ticks(4)
    .default(100)
    .displayValue(false)
    .on('onchange', num => {
        crowding_value = num
        updateData()
    });

d3.select('#slider')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)    
    .append('g')
    .attr('transform', `translate(30,30)`)
    .call(slider);
 