var svgwidth = 450;
var svgheight = 450;
var padding = 100;

var svg = d3.select("#chart-1")
    .append('svg')
    .attr('viewBox', '0 0 500 500')

//-------------------------TITLE FOR PIE CHART-------------------------\\    
svg.append("text")  
    .attr("class", "title")
    .attr("transform", "translate(220, 0)")
    .attr("x", "30")
    .attr("y", "30")
    .style("text-anchor", "middle")
    .style("font-family", "var(--family-bold-sec)")
    .style("font-weight", "700")
    .style("font-size", 22)
    .style("fill", 'var(--primary)')
    .text("Top 100 YouTube Channels Per Category")

var inner_width = svgwidth - padding;
var inner_height = svgheight - padding;

var g = svg.append("g")
    .attr("transform", "translate(250, 250)")
    .attr("class", "graph")

//-------------------------RADIUS FOR PIECHART-------------------------\\    
var radius = Math.min(inner_width, inner_height) / 2; 

d3.csv('./data/top_100_youtubers.csv').then(function(data) { 

var totalCat = [];
var categories = data.map(d => d);

categories.forEach((item, data) => {
    if(!totalCat[item.Category]) {
        totalCat[item.Category] = 1;
    } else {
        totalCat[item.Category] += 1;
    }
})

 const values = Object.values(totalCat);
 const sum = values.reduce((acc, value) =>{
            return acc + value;
        }, 0)
const palletes = ['#CC0007', '#1F1F67',  '#4D4D4D', '#FFA733', '#005B8F', '#009EBD','#752967',   '#993A8C', '#0D0D0D']
var color = d3.scaleOrdinal()
    .range(palletes); //colors

var pie = d3.pie() //create pie 
    .value(d => {
        return d[1];
    })

var arc = d3.arc() // manage arc 
    .innerRadius(radius - 100)
    .outerRadius(radius * .8)    
    
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    
g.selectAll('.graph') //input Category data count
    .data(pie(Object.entries(totalCat)))
    .join('path')
    .attr('transform', 'rotate(2)')
    .attr('d', arc)
    .attr('fill', function(d){
        // console.log(d.data)
        return color(d.data)
    })
    .attr('stroke', 'white')
    .style('stroke-width', '1px')
    .on("mouseover", function(event,d){
        tooltip
          .style("left", event.clientX -10 + "px")
          .style("top", event.clientY - 10 + "px")
          .style("display", "inline-block")
          .html(d.data[0] + " <b>(" + ((d.data[1]/sum) * 100).toFixed() + "%)</b>");
    })
    .on("mouseout", function(d){ tooltip.style("display", "none");});
    
    g.append("text")
    .attr("text-anchor", "middle")
    .style("font-family", "var(--family-bold-sec)")
      .attr('font-size', '50px')
      .attr('font-weight', '700')
      .style("fill", 'var(--rosso)')
      .attr('y', 10)
    .text(sum);
    g.append("text")
    .attr("text-anchor", "middle")
    .style("font-family", "var(--family-bold-sec)")
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .style("fill", 'var(--rosso)')
      .attr('y', 40)
    .html('CHANNELS');

//-------------------------POLYLINES CREATED-------------------------\\      
var labelArc = d3.arc()
    .innerRadius(radius)
    .outerRadius(radius * 1)

g.selectAll('.allPolylines')
    .data(pie(Object.entries(totalCat)))
    .join('polyline')
    .attr("stroke", "#595959")
    .attr("fill", 'none')
    .attr('stroke-width', 2)
    //.attr('transform', 'rotate(-1)')
    .attr('points', function(d) {
        var posA = arc.centroid(d);
        var posB = labelArc.centroid(d);
            return [posA, posB] 
        })
//-------------------------POLYLINE DATA-------------------------\\
g.selectAll('.allLabels')
    .data(pie(Object.entries(totalCat)))
    .join('text')
    .style("font-family", "var(--family-bold-sec)")
    .style("font-weight", "700")
    .style("font-size", 15)
    .style("fill", 'var(--primary)')
    .attr("x", -12)
    .attr("y",2)
    .text(d => {
        return (+((d.data[1]/sum) * 100).toFixed()) + '%'
    })
    .attr('transform', function(d){
        const pos = labelArc.centroid(d)
        return `translate(${pos})`;
    })

//-------------------------LEGEND CREATION-------------------------\\
var legendValue = Object.entries(totalCat).length/2;
    var itemWidth =150;
    var itemHeight = 15;
    var legendValue = Object.entries(totalCat).length/3;
      
svg.selectAll(".legend")
    .data(pie(Object.entries(totalCat)))
    .enter()
    .append('rect')
    .attr("x", 75)
    .attr("y", 420)
    .attr("transform", function(d,i) { return "translate(" + i%legendValue * itemWidth + "," + Math.floor(i/legendValue) * itemHeight + ")"; })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d){ return color(d)})
                
        
svg.selectAll("mylabels")
    .data(pie(Object.entries(totalCat)))
    .enter()
    .append("text")
    .attr("x", 95)
    .attr("y", 425)
    .join('text')
    .style("font-family", "var(--family-bold-sec)")
    .style("font-weight", "700")
    .style("font-size", 15)
    .attr("transform", function(d,i) { return "translate(" + i%legendValue * itemWidth + "," + Math.floor(i/legendValue) * itemHeight + ")"; })
    .style("fill", function(d){return color(d)})
    .text(d => {
        return (d.data[0])

    })
    .attr("text-anchor", "right")
    .style("alignment-baseline", "middle")  
})  