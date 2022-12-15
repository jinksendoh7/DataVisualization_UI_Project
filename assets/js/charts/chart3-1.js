
// set the dimensions and margins of the graph

const margin = {top: 20, right: 30, bottom: 40, left: 50},
    width = 600-margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg3 object to the body of the page
const svg3 = d3.select("#chart-3")
  .append("svg")
    .attr("viewBox","0 0 600 430")
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

 
svg3.append("text")
.style('font-size', '22px')
.style('font-weight', '700')
.style('fill','var(--rosso)')
.attr("x", 0)
.attr('y', -5)
.attr('id', 'chart-title')
.style('font-family', 'var(--font-family-sec-bold)')
    .text("Top Countries with YouTube Content Creators");

// Parse the Data
d3.csv("./data/top_100_youtubers.csv").then( function(data) {
const countryUnique = [...new Set(data.map(d => d.Country))].sort() //select only unique values of countries

let countriesCountValues  = [];
Object.keys(countryUnique).forEach(index => {
    countriesCount = 0;
    Object.entries(data).forEach(entry => {
        const [key, item] = entry;
        if (countryUnique[index] === item.Country) {
            countriesCount+= 1;
        }
    });
    // reconstruct the data
    countriesCountValues.push({
        country: countryUnique[index],
        value: countriesCount
    });
});    
var tooltip_chart3 = d3.select("#chart-3").append("div").attr("class", "toolTip");

// Add X axis
  const x = d3.scaleLinear()
    .domain([0, d3.max(countriesCountValues, d => parseInt(d.value))])
    .range([ 0, width])


  svg3.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .style("text-anchor", "end")
      .attr('fill', '#000')
      .attr('font-weight','700')
      .style("font-size", "12px")
      .attr('fill', '#000')
      .style('font-family', 'var(--font-family-sec-bold)')

  // Y axis
  const y = d3.scaleBand()
    .range([ 0, height ])
    .domain(countriesCountValues.map(d => d.country))
    .padding(.2);
  
  const g = svg3.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr('fill', '#000')
    .style('font-weight','700')

    .style("font-size", "12px")
    
    svg3.append("text")
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .attr('fill', 'var(--primary)')
    .attr("transform", "rotate(-90)")
    .attr("x", -180)
    .attr("y", -32)
    .text("Top Countries")
    .style('font-family', 'var(--font-family-sec-bold)')


    var color_bar = d3
    .scaleOrdinal()
    .domain(countriesCountValues)
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


  //Bars
  svg3.selectAll("myRect")
    .data(countriesCountValues)
    .join("rect")
    .attr("id", "bar_rect")
    .attr("x", x(0))
    .attr("y", d => y(d.country))
    .attr("width", 0)
    .attr("height", y.bandwidth())
    .attr("fill", (d) => color_bar(d.value))
    .on("mouseover", function (event, d) {
      //changing color when hover
      d3.select(this).style("opacity", "0.5");
      tooltip_chart3
        .style("left", (event.clientX -300) + "px")
        .style("top", (event.clientY-500)+ "px")
        .style("display", "inline-block")
        .html('<img class="flag-icon" src="./assets/flags/'+d.country + '.png"/>'+" <br/> "+d.country+': <b>' + d.value+'</b>');
    })
    .on("mouseout", function (d) {
      d3.select(this).style("opacity", "1");
      tooltip_chart3.style("display", "none");
    });
    svg3.append("text")
    .attr('x', 250)
    .attr("y", inner_height -20)
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .attr('fill', '#FF0009')
    .attr('font-size','20px')
    .attr('font-weight','700')
    .attr('font-family', 'var(--font-family-sec-bold)')
    .text('Total YouTube Creators');


    d3.selectAll("#bar_rect")
      .data(countriesCountValues)
      .transition()
      .duration(2000)
      .attr("width", d=>x(d.value))
})