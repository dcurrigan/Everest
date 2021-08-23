

var slider = d3
    .sliderBottom()
    .min(100)
    .max(800)
    .step(200)
    .width(300)
    .ticks(5)
    .default(100)
    .displayValue(false)
    .on('onchange', num => {
        console.log(num)
    });

d3.select('#slider')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)    
    .append('g')
    .attr('transform', `translate(30,30)`)
    .call(slider);
 