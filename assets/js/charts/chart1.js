var svgwidth = 500;
var svgheight = 500;
var padding = 100;

var svg = d3.select("#donut_chart")
            .append('svg')
            .attr('width', svgwidth)
            .attr('height', svgheight);

var inner_width = svgwidth - padding;
var inner_height = svgheight -padding;

var g = svg.append("g")
.attr("transform", "translate(250, 250)")
.attr("class", "graph")

var radius = Math.min(inner_width, inner_height) / 2;
