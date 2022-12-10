var svgwidth = 500;
var svgheight = 500;
var padding = 100;

var svg = d3.select("#chart-1")
    .append('svg')
    .attr('viewBox', '0 -50 800 600')
    .attr('width', svgwidth)
    .attr('height', svgheight);

//-------------------------TITLE FOR PIE CHART-------------------------\\    
svg.append("text")  
    .attr("class", "title")
    .attr("transform", "translate(220, 0)")
    .attr("x", "30")
    .attr("y", "30")
    .style("text-anchor", "middle")
    .style("font-family", "Zilla Slab")
    .style("font-weight", "bold")
    .style("font-size", 18)
    .style("fill", '#595959')
    .text("Top 100 YouTube Channels Per Category")

var inner_width = svgwidth - padding;
var inner_height = svgheight -padding;

var g = svg.append("g")
    .attr("transform", "translate(250, 250)")
    .attr("class", "graph")

//-------------------------RADIUS FOR PIECHART-------------------------\\    
var radius = Math.min(inner_width, inner_height) / 2; 

d3.csv('./data/top_100_youtubers.csv').then(function(data) { 

var totalCat = {}
var categories = data.map(d => d)

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

var color = d3.scaleOrdinal()
    .range(['#CC0007', '#1F1F67',  '#4D4D4D', '#FFA733', '#005B8F', '#009EBD', '#E1E1E1', '#4D4D4D', '#0D0D0D']); //colors

var pie = d3.pie() //create pie 
    .value(d => {
        return d[1];
    })

var arc = d3.arc() // manage arc 
    .innerRadius(0)
    .outerRadius(radius * 0.8)                          
    
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

//-------------------------POLYLINES CREATED-------------------------\\      
var labelArc = d3.arc()
    .innerRadius(radius)
    .outerRadius(radius * 0.9)

g.selectAll('.allPolylines')
    .data(pie(Object.entries(totalCat)))
    .join('polyline')
    .attr("stroke", "#595959")
    .attr("fill", 'none')
    .attr('stroke-width', 1)
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
    .style("fill", '#595959')
    .attr("x", -10)
    .attr("y", 2)
    .style("font-family", "Zilla Slab")
    .style("font-weight", "bold")
    .style("font-size", 15)
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
    .attr("font-size", 14)
    .style("font-family", "Zilla Slab")
    .attr("transform", function(d,i) { return "translate(" + i%legendValue * itemWidth + "," + Math.floor(i/legendValue) * itemHeight + ")"; })
    .style("fill", function(d){return color(d)})
    .text(d => {
        return (d.data[0])

    })
    .attr("text-anchor", "right")
    .style("alignment-baseline", "middle")  
})  