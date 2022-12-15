const chart4 = document.getElementById("chart-4");


var svgwidth_area = 500;
var svgheight_area = 500;
var padding_area = 200;

    // What to do when one group is hovered
    var highlight = function(d){
    
      // reduce opacity of all groups
      d3.selectAll("#myArea").style("opacity", .1)
      // expect the one that is hovered
      d3.select("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function(d){
      d3.selectAll("#myArea").style("opacity", 1)
    }


var svg_area = d3
  .select("#chart-4")
  .append("svg")

  .attr("viewBox", "0 0 " + svgwidth_area + " 450")
  .attr("preserveAspectRatio", "xMidYMid meet");

var inner_width_area = svgwidth_area - 100;
var inner_height_area = svgheight_area - padding_area;

var parseTime = d3.timeParse("%Y");

//Title "Top 5 Channels Ave. Views per Year"
svg_area
  .append("text")
  .attr(
    "transform",
    "translate(" + svgwidth_area / 2 + " ," + (svgheight_area - 460) + ")"
  )
  .style("text-anchor", "middle")
  .style("font-weight", "bold")
  .attr("transform", "translate(220, 0)")
  .style("text-anchor", "middle")
  .style("font-family", "var(--font-family-sec-bold)")
  .style("font-weight", "700")
  .style("font-size", "16px")
  .attr("x", -10)
  .attr('y', 65)
  .style("fill", "var(--rosso)")
  .text("Top 5 Channels (Average Views/Year)");

var g_stkarea = svg_area
  .append("g")
  .attr("transform", "translate(80, 90)")
  .attr("class", "graph");

// var xscale = d3.scaleTime().range([0, inner_width_area]);
// var yscale = d3.scaleLinear().range([inner_height_area, 0]);

d3.csv("./data/avg_view_every_year.csv").then(function (data) {
  //get xaxis
  var years = data.map((d) => d.Year);

  data.forEach(function (d) {
    d.Year = parseTime(d.Year);
    d["T-Series"] = parseInt(d["T-Series"]);
    d["ABCkidTV - Nursery Rhymes"] = parseInt(d["ABCkidTV - Nursery Rhymes"]);
    d["SET India"] = parseInt(d["SET India"]);
    d.PewDiePie = parseInt(d.PewDiePie);
    d.MrBeast = parseInt(d.MrBeast);
  });
  //create xaxis
  var xscale = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.Year;
      })
    )
    .range([0, inner_width_area]);

  var xaxis = d3.axisBottom().scale(xscale);

  g_stkarea
    .append("g")
    .attr("transform", "translate(0, 300)")
    .call(xaxis)
    .append("text")
    .attr("x", inner_width_area / 2)
    .attr("y", 40)
    .style("fill", "var(--rosso)")
    .style("text-anchor", "middle")
    .style("font-family", "var(--font-family-sec-bold)")
    .style("font-weight", "700")
    .style("font-size","14px")
    .text("Year");
  
   
  var yscale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return (
          d["T-Series"] +
          d["ABCkidTV - Nursery Rhymes"] +
          d["SET India"] +
          d.PewDiePie +
          d.MrBeast
        );
      }),
    ])
    .range([inner_height_area, 0]);

  var yaxis = d3
    .axisLeft()
    .scale(yscale)
    .ticks(20)
    .tickFormat(d3.format(".2s"));

  g_stkarea
    .append("g")
    .call(yaxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -100)
    .attr("y", -50)
    .style("fill", "var(--rosso)")
    .style("text-anchor", "middle")
    .style("font-family", "var(--font-family-sec-bold)")
    .style("font-weight", "700")
    .style("font-size", "14px")
    .text("Average Views");

  //var keysToStack = ['T-Series', 'ABCkidTV - Nursery Rhymes', 'SET India', 'PewDiePie', 'MrBeast'];
  var keysToStack = data.columns.slice(1);

  var generateStack = d3.stack().keys(keysToStack)(data);
  var tooltip = d3.select("body").append("div").attr("class", "toolTip");


  var initialarea = d3.area()
  .x(function(d) { return xscale(d.data.Year); })
  .y0(yscale(0))
  .y1(yscale(0));

  var generateLine = d3
    .area()
    .x((d) => xscale(d.data.Year))
    .y0((d) => yscale(d[0]))
    .y1((d) => yscale(d[1]));

  var color_area = d3
    .scaleOrdinal()
    .domain(keysToStack)
    .range(["#752967", "#1F1F67", "#FFA733", "#005B8F", "#CC0007"]);

  g_stkarea
    .append("g")
    .selectAll("path")
    .data(generateStack)
    .join("path")
    .attr("d", initialarea)
    .transition()
    .delay(200)
    .duration(2000)
    .attr("d", generateLine)
    .attr("id","myArea")
    .attr("class", function(d) { 
        return d.key === 'SET India' ? "myArea_" + (d.key.length + 1): "myArea_" + (d.key.length);
      })
    .style("fill", (d) => color_area(d.key));
    
    d3.selectAll('text')
    .style("font-family", "var(--font-family-sec-bold)");

    svg_area.selectAll("mydots")
    .data(keysToStack)
    .enter()
    .append("circle")
      .attr("cx", 100)
      .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", function(d){ return color_area(d)})
      .on("mouseover", (event, d)=> {
        if(d === 'SET India'){
          highlight('myArea_'+(d.length+ 1))
        }
        else{
          highlight('myArea_'+d.length)
        }
        })
      .on("mouseleave", (event)=>{
        noHighlight();
      })

  
    
  // Add one dot in the legend for each name.
  svg_area.selectAll("mylabels")
    .data(keysToStack)
    .enter()
    .append("text")
      .attr("x", 120)
      .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return color_area(d)})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("font-family", "var(--family-bold-sec)")
      .style("font-weight", "700")
      .style("font-size", '12px')
      .style("alignment-baseline", "middle")
      .on("mouseover", (event, d)=> {
        if(d === 'SET India'){
          highlight('myArea_'+(d.length+ 1))
        }
        else{
          highlight('myArea_'+d.length)
        }
        })
      .on("mouseleave", (event)=>{
        noHighlight();
      })


  
});
