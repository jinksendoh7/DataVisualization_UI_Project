var svgwidth = 650;
var svgheight = 590;
var padding = 100;

var numFormat = d3.format(".2s");

var svg = d3
  .select("#chart-2")
  .append("svg")

  .attr("viewBox", "0 0 " + svgwidth + " " + svgheight);

var inner_width = svgwidth - padding;
var inner_height = svgheight - padding;

//X axis Title "Subscribers"
svg
  .append("text")
  .attr(
    "transform",
    "translate(" + svgwidth / 2 + " ," + (svgheight - 40) + ")"
  )
  .style("text-anchor", "middle")
  .style("font-family", "var(--font-family-sec-bold)")
  .attr("fill", "var(--rosso)")
  .style("font-size", "14px")
  .text("Followers/Subscribers");

//Title "Relationship Between Likes and Subscribes"
svg
  .append("text")
  .attr("transform", "translate(" + 30 + " ," + 80 + ")")
  .style("font-family", "var(--font-family-sec-bold)")
  .attr("fill", "var(--rosso)")
  .style("font-size", "20px")
  .style("font-weight", "bold")
  .text("Relationship Between Likes and Subscribers");

//Y axis Title "Likes"
svg
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -(svgheight / 2))
  .attr("y", 50)
  .style("font-family", "var(--font-family-sec-bold)")
  .attr("fill", "var(--rosso)")
  .style("font-size", "14px")
  .text("Likes");

var g = svg
  .append("g")
  .attr("transform", "translate(110, 90)")
  .attr("class", "graph");

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

d3.csv("./data/top_100_youtubers.csv").then(function (data) {
  var maxFollowers = d3.max(data, function (d) {
    return +d.followers;
  });
  var maxLikes = d3.max(data, function (d) {
    return +d.Likes;
  });

  var xscale = d3
    .scaleLinear()
    .domain([0, maxFollowers.toFixed(3)])
    .range([0, inner_width]);

  var xaxis = d3
    .axisBottom()
    .scale(xscale)
    .ticks(7)
    .tickFormat(d3.format(".2s"));

  g.append("g")
    .attr("transform", "translate(0," + inner_width + ")")
    .call(xaxis);

  var yscale = d3
    .scaleLinear()
    .domain([0, maxLikes])
    .nice()
    .range([inner_height, 0]);

  var yaxis = d3.axisLeft().scale(yscale).ticks(7).tickFormat(d3.format(".2s"));



  g.append("g").call(yaxis);

  g.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", 3)
    .attr("cx", (d) => xscale(d.followers))
    .attr("cy", (d) => yscale(d.Likes))
    .style("fill", "#CC0007")
    .style("font-family", "Quicksand")
    .on("mouseover", function (event, d) {
      d3.select(this).style("opacity", "0.5");
      tooltip
        .style("left", event.clientX - 5 + "px")
        .style("top", event.clientY + 250 + "px")
        .style("display", "inline-block")
        .html(
          "Followers: " +
            d3.format(".4s")(d.followers) +
            " <br/>Likes: " +
            d3.format(".4s")(d.Likes)
        );
    })
    .on("mouseout", function (d) {
      d3.select(this).style("opacity", "1");
      tooltip.style("display", "none");
    });

  
});
