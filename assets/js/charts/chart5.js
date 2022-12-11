const chart = document.getElementById("chart-5");

var svgwidth = 600;
var svgheight = 550;
var barWidth = 50;
var padding = 20;
var inner_width = svgwidth - 200; //350
var inner_height = svgheight - 150; //350

var svg_grp = d3
  .select("#chart-5")
  .append("svg")
  .attr("style", "outline: thin solid #4D4D4D;")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "0 0 " + svgwidth + " " + svgheight)
  .attr("preserveAspectRatio", "xMidYMid meet");

svg_grp
  .append("text")
  .attr("class", "chart-title")
  .attr("x", inner_width / 2)
  .attr("y", 30)
  .text("Top 5 Channel Income");

var g_grpbar = svg_grp
  .append("g")
  .attr("class", "group")
  .attr("transform", "translate(150, 50)");

d3.csv("./data/top_100_youtubers.csv").then(function (data) {
  console.log(data);

  //format file to get only the first 5
  var slicedData = data.slice(0, 5); //top 5 here
  console.log(slicedData);

  //get xaxis
  var groups = data.map((d) => d.ChannelName).slice(0, 5); //top 5 here
  console.log(groups);

  var xscale = d3.scaleLinear().domain([0, 1000000]).range([0, inner_width]);

  var xaxis = d3
    .axisBottom()
    .scale(xscale)
    .ticks(10)
    .tickFormat(d3.format(".2s"));
  //.attr("transform",`translate(${0},${inner_height - 20})`)

  //xaxis label
  g_grpbar
    .append("g")
    .attr("transform", "translate(0, " + inner_height + ")")
    .call(xaxis)
    .append("text")
    .attr("x", inner_width / 2)
    .attr("y", 40)
    .style("fill", "#222")
    .style("font-family", "Quicksand")
    .style("font-weight", "bold")
    .style("font-size", "14px")
    .text("Quarterly Income");

  //get yaxis
  var yscale = d3
    .scaleBand()
    .domain(groups)
    .range([0, inner_width])
    .padding([0.2]);

  var yaxis = d3.axisLeft().scale(yscale);

  //yaxis label
  g_grpbar
    .append("g")
    .call(yaxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -150)
    .attr("y", -110)
    .style("fill", "#222")
    .style("font-family", "Quicksand")
    .style("font-size", "14px")
    .text("YouTube Channels");

  var subgroups = data.columns.slice(19);
  console.log(subgroups);

  var ySubGroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, yscale.bandwidth()]);

  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#1F1F67", "#CC0007", "#FFA733", "#009EBD"]);

  g_grpbar
    .append("g")
    .selectAll("g")
    .data(slicedData)
    .join("g")
    .attr("transform", (d) => `translate(0, ${yscale(d.ChannelName)})`)
    .selectAll("rect")
    .data(function (d) {
      return subgroups.map(function (key) {
        return { key: key, value: d[key] };
      });
    })
    .join("rect")
    .attr("x", (d) => xscale(20))
    .attr("y", (d) => ySubGroup(d.key))
    .attr("width", (d) => xscale(d.value))
    .attr("height", ySubGroup.bandwidth())
    .attr("fill", (d) => color(d.key))
    .on("mouseover", function (d) {
      d3.select(this).style("fill", "#E1E1E1");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("fill", (d) => color(d.key));
    });

  //                 // Legends which is in right side
  // var legend = svg_grp.selectAll(".legend")
  //   .data(subgroups)
  //   .enter().append("g")
  //   .attr("class", "legend")
  //   .attr("transform", function(d, i) {
  //     return "translate(180," + i * 20 + ")";
  //   });

  var legend = svg_grp
    .selectAll(".legend")
    .data(subgroups)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(" + -40 * i + "," + 520 + ")";
    })
    .attr("width", 36);

  legend
    .append("rect")
    .attr("x", function (d, i) {
      return 150 + 150 * i;
    })
    .attr("width", 18)
    .attr("height", 18)
    //.style("text-anchor", "end") //"startOffset"="100%
    //.style("startOffset","100%") //"startOffset"="100%
    .style("fill", color);

  legend
    .append("text")
    //.attr("x", width - 24)
    .attr("x", function (d, i) {
      return 150 + 150 * i + 20;
    })
    .attr("y", 9)
    .attr("dy", ".35em")

    //.style("text-anchor", "end")
    .text(function (d) {
      return d;
    })
    .style("font-size", "12px")
    .style("font-family", "Quicksand");
});
