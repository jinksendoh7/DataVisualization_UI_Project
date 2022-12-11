const chart = document.getElementById("chart-4");

var svgwidth_area = 500;
var svgheight_area = 500;
var padding_area = 200;

var svg_area = d3
  .select("#chart-4")
  .append("svg")
  .attr("style", "outline: thin solid #4D4D4D;")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "0 0 " + svgwidth_area + " " + svgheight_area)
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
  .style("font-family", "Quicksand")
  .style("font-size", "20")
  .style("font-weight", "bold")
  .text("Top 5 Channels Ave. Views per Year");

var g_stkarea = svg_area
  .append("g")
  .attr("transform", "translate(80, 90)")
  .attr("class", "graph");

// var xscale = d3.scaleTime().range([0, inner_width_area]);
// var yscale = d3.scaleLinear().range([inner_height_area, 0]);

d3.csv("./data/avg_view_every_year.csv").then(function (data) {
  //get xaxis
  var years = data.map((d) => d.Year);
  console.log(years);

  data.forEach(function (d) {
    d.Year = parseTime(d.Year);
    d["T-Series"] = parseInt(d["T-Series"]);
    d["ABCkidTV - Nursery Rhymes"] = parseInt(d["ABCkidTV - Nursery Rhymes"]);
    d["SET India"] = parseInt(d["SET India"]);
    d.PewDiePie = parseInt(d.PewDiePie);
    d.MrBeast = parseInt(d.MrBeast);
  });
  console.log(data);

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
    .style("fill", "#222")
    .style("font-family", "Quicksand")
    .style("font-weight", "bold")
    .style("font-size", "14px")
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
    .style("fill", "#222")
    .style("font-family", "Quicksand")
    .style("font-weight", "bold")
    .style("font-size", "14px")
    .text("Average Views");

  //var keysToStack = ['T-Series', 'ABCkidTV - Nursery Rhymes', 'SET India', 'PewDiePie', 'MrBeast'];
  var keysToStack = data.columns.slice(1);
  console.log(keysToStack);

  var generateStack = d3.stack().keys(keysToStack)(data);

  console.log("generateStack", generateStack);

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
    .attr("d", generateLine)
    .style("fill", (d) => color_area(d.key));
  //  .attr("fill", "none")
  //   .style("stroke", (d) => color(d.key))
  //   .attr("stroke-width", 1.5)

  var legend_area = svg_area
    .selectAll(".legend")
    .data(keysToStack)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(" + -10 * i + "," + 450 + ")";
    })
    .attr("width", 36);

  legend_area
    .append("rect")
    .attr("x", function (d, i) {
      return 10 + 120 * i;
    })
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color_area);

  legend_area
    .append("text")
    //.attr("x", width - 24)
    .attr("x", function (d, i) {
      return 10 + 120 * i + 20;
    })
    .attr("y", 9)
    .attr("dy", ".35em")

    //.style("text-anchor", "end")
    .text(function (d) {
      return d;
    })
    .style("font-size", "7px")
    .style("font-family", "Quicksand");
});
