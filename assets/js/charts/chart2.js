var svgwidth = 500;
var svgheight = 500;
var padding = 200;

var numFormat = d3.format(".2s");

var svg = d3.select("#scatter_plot")
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr("style", "outline: thin solid #4D4D4D;")
            .attr('viewBox',
                '0 0 ' + svgwidth + ' ' + svgheight
            ).attr('preserveAspectRatio', 'xMidYMid meet')

var inner_width = svgwidth - padding;
var inner_height = svgheight - padding;

//X axis Title "Subscribers"
svg.append("text")
    .attr("transform", "translate(" + (svgwidth/2) + " ," + (svgheight-40) + ")")
    .style("text-anchor", "middle")
    .style("font-family", "Quicksand")
    .style("font-weight", "bold")
    .text("Followers/Subscribers");

    //Title "Relationship Between Likes and Subscribes"
svg.append("text")
    .attr("transform", "translate(" + (svgwidth/2) + " ," + (svgheight-460) + ")")
    .style("text-anchor", "middle")
    .style("font-family", "Quicksand")
    .style("font-size", "20")
    .style("font-weight", "bold")
    .text("Relationship Between Likes and Subscribes");

//Y axis Title "Likes"
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(svgheight/2))
    .attr("y", 50)
    .style("text-anchor", "middle")
    .style("font-family", "Quicksand")
    .style("font-weight", "bold")
    .text("Likes");

var g = svg.append('g')
            .attr('transform', 'translate(110, 90)')
            .attr('class', 'graph');

d3.csv("../data/top_100_youtubers.csv").then(function(data){
    var maxFollowers = d3.max(data, function(d) { return +d.followers;} );
    var maxLikes = d3.max(data, function(d) { return +d.Likes;} );
    console.log(maxLikes)
    
    console.log(maxFollowers.toFixed(2))

    var xscale = d3.scaleLinear()
                    .domain([0, maxFollowers.toFixed(3)])
                    .range([0, inner_width])
                    
    
    var xaxis = d3.axisBottom()
                    .scale(xscale)
                    .ticks(7).tickFormat(d3.format(".2s"));
                    

    g.append('g')
        .attr("transform", "translate(0," + inner_width + ")")
        .call(xaxis)

    var yscale = d3.scaleLinear()
                    .domain([0, maxLikes]).nice()
                    .range([inner_height, 0])
                    
                    

    var yaxis = d3.axisLeft()
                    .scale(yscale)
                    .ticks(7).tickFormat(d3.format(".2s"));
                    

    g.append('g')
        .call(yaxis)
    
    g.append('g')
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr("r", 3)
        .attr('cx', d => xscale(d.followers))
        .attr('cy', d => yscale(d.Likes))
        .style('fill', "#CC0007")
        .style("font-family", "Quicksand")
})
