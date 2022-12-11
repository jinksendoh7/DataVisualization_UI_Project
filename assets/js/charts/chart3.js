/* d3js code here */
const chart = document.getElementById("chart-3");

var svgwidth_bar = 500;
var svgheight_bar = 500;
var barWidth = 50;
var padding = 20;
var inner_width = svgwidth_bar - 100; //400
var inner_height = svgheight_bar - 100; //400

var svg_bar = d3
  .select("#chart-3")
  .append("svg")
  //.attr("style", "outline: thin solid #4D4D4D;")
  // .attr('width', svgwidth_bar)
  // .attr('height', svgheight_bar)
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "0 0 600 550")
  // .attr("viewBox", "0 0 " + svgwidth_bar + " " + svgheight_bar)
  .attr("preserveAspectRatio", "xMidYMid meet");

svg_bar
  .append("text")
  .attr("class", "chart-title")
  .attr("x", 80)
  .attr("y", 30)
  .style("font-family", "Quicksand")
  .style("font-size", "18px")
  .text("Top Countries with YouTube Content Creators");

var g_bar = svg_bar
  .append("g")
  .attr("class", "group")
  .attr("transform", "translate(50, 50)");

var xscale = d3.scaleBand().range([0, inner_width]).paddingInner(0.5);

var yscale = d3.scaleLinear().range([inner_height, 0]);

var tooltip = d3.select("#chart-3").append("div").attr("class", "toolTip");

d3.csv("./data/top_100_youtubers.csv").then(function (data) {
  console.log(data);

  // define count object that holds count for each country
  var countObj = {};

  // count how much each country occurs in list and store in countObj
  data.forEach(function (d) {
    var country = d.Country;

    if (countObj[country] === undefined) {
      countObj[country] = 1;
    } else {
      countObj[country] = countObj[country] + 1;
    }
  });
  // now store the count in each data member
  data.forEach(function (d) {
    var country = d.Country;
    d.count = countObj[country];
  });
  console.log(countObj);

  var countObjValues = [];
  var keyCount = "Count";
  var keyCountry = "Country";

  //convert country iso code to country full name
  function convert(text) {
    if (text === "US") {
      text = "USA";
    } else if (text === "IN") {
      text = "India";
    } else if (text === "BR") {
      text = "Brazil";
    } else if (text === "KR") {
      text = "Korea";
    } else if (text === "CA") {
      text = "Canada";
    } else if (text === "MX") {
      text = "Mexico";
    } else if (text === "RU") {
      text = "Russia";
    } else if (text === "SV") {
      text = "El Salvador";
    } else if (text === "CL") {
      text = "Chile";
    } else if (text === "NO") {
      text = "Norway";
    } else if (text === "PR") {
      text = "Puerto Rico";
    } else if (text === "BY") {
      text = "Belarius";
    } else if (text === "PH") {
      text = "Philippines";
    } else if (text === "TH") {
      text = "Thailand";
    }

    return text;
  }

  // loop over values
  for (let value of Object.entries(countObj)) {
    var countryText = convert(value[0]);
    countObjValues.push({ [keyCountry]: countryText, [keyCount]: value[1] }); // usa, 40
  }
  countObjValues.sort((a, b) => b.Count - a.Count);
  console.log(countObjValues);

  xscale.domain(countObjValues.map((d) => d.Country));

  var xaxis = d3.axisBottom().scale(xscale);

  g_bar
    .append("g")
    .attr("transform", "translate(0," + inner_height + ")")
    .call(xaxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)")
    .style("font-size", "13px");

    g_bar.append("text")
    .attr("x", inner_width / 2)
    .attr("y", inner_height + 90)
    .style("fill", "#222")
    .style("font-family", "Quicksand")
    .style("font-weight", "bold")
    .style("font-size", "15px")
    .style("padding", padding)
    .text("Country")
    

  yscale.domain([0, d3.max(countObjValues, (d) => parseInt(d.Count)) + 2]);

  var yaxis = d3.axisLeft().tickSizeInner(-inner_width).scale(yscale);

  g_bar
    .append("g")
    .call(yaxis)
    .style("font-size", "13px")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -170)
    .attr("y", -30)
    .style("fill", "#222")
    .style("font-family", "Quicksand")
    .style("font-weight", "bold")
    .style("font-size", "14px")
    .text("# of Content Creators");

  var color_bar = d3
    .scaleOrdinal()
    .domain(countObjValues)
    .range([
      "#CC0007",
      "#FFA733",
      "#1F1F67",
      "#005B8F",
      "#009EBD",
      "#191919",
      "#4D4D4D",
      "#48B200",
      "#48B200",
      "#48B200",
      "#48B200",
      "#48B200",
      "#48B200",
      "#48B200",
    ]);

  //var tooltip = d3.select("#chart-3").append("div").attr("class", "toolTip");

  var graph_bar = g_bar
    .selectAll(".graph")
    .data(countObjValues)
    .enter()
    .append("g");

  graph_bar
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return xscale(d.Country);
    })
    .attr("y", function (d) {
      return yscale(parseInt(d.Count));
    })
    .attr("width", xscale.bandwidth() + 5)
    .attr("height", function (d) {
      return inner_height - yscale(parseInt(d.Count));
    })
    .attr("fill", (d) => color_bar(d.Country))
    .on("mouseover", function (event, d) {
      //changing color when hover
      d3.select(this).style("fill", "#E1E1E1");
      tooltip
       .style("left", event.clientX -10 + "px")
                  .style("top", event.clientY - 10 + "px")
                  .style("display", "inline-block")
                  .html((d.Country) + " <b>("+ (d.Count) + " content creators)</b>");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("fill", (d) => color_bar(d.Country));
      tooltip.style("display", "none");
    });

  graph_bar
    .append("text")
    .attr("class", "dataLabel")
    .attr("x", function (d) {
      return xscale(d.Country) - 5;
    })
    .attr("y", function (d) {
      return yscale(parseInt(d.Count) + 2);
    })
    .attr("dx", ".80em")
    .attr("dy", ".80em")
    .text(function (d) {
      return d.Count;
    })
    .attr("fill", "#222")
    .style("font-size", "14px");

  //14. add transition for the chart
  svg_bar
    .selectAll("rect")
    .transition()
    .ease(d3.easeLinear)
    .duration(800)
    .attr("y", function (d) {
      return yscale(parseInt(d.Count));
    })
    .attr("height", function (d) {
      return inner_height - yscale(parseInt(d.Count));
    })
    .delay(function (d, i) {
      return i * 100;
    });
});
