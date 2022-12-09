
var countryInput = 'US'; // get it from the dropdown   
const spinner = document.getElementById('spinner-sm');
 
const chart = document.getElementById('chart-6');

//Functions

function createCountryList (list){

    document.getElementById("country-list").innerHTML = '';
    Object.keys(list).forEach(i =>{
    
        const li = document.createElement("li");
        li.className = 'list-group-item';
        li.data = list[i];
        li.innerHTML ='<div class="country-select" onclick="onSelectCountry('+"'"+list[i]+"')"+'"'+'><b>' + list[i] + '</b>' + '<img src ="'+'./assets/flags/'+list[i]+'.png" class="flag-icon" style="margin-left: 1rem"/></div>';
        document.getElementById("country-list").appendChild(li);
    });
}

function onSelectCountry(countryInput){
   
    chart.style.display = 'none';
    document.getElementById("btn-flag").innerHTML = '<img src ="'+'./assets/flags/'+countryInput+'.png" class="flag-icon"/>'
    d3.selectAll("svg").remove()
    $('#exampleModal').modal('hide');
    drawChart(countryInput);
 }

function drawChart (countryInput){
    
var svgwidth = screen.width * .50;
var svgheight = 500;
var padding = 100;


var svg = d3.select('#chart-6')
    .append('svg')
    .attr('viewBox', '0 0 1000 500')
  

svg.append("text")
    .style('font-size', '1.2rem')
    .style('font-weight', '800')
    .style('fill','var(--primary)')
    .attr("x", 30)
    .attr('y', 30)
    .attr('id', 'chart-title')
    .text('YouTube Channels By Category' + ' ('+countryInput+')')

var inner_width = svgwidth - padding; //400
var inner_height = svgheight - padding; //400



var g = svg.append('g')
    .attr('class', 'group')
    .attr("transform", "translate(50, 50)")



var xscale = d3.scaleBand()
    .range([0, inner_width])
    .paddingInner(0.5)
    .paddingOuter(0.2)


var yscale = d3.scaleLinear()
    .range([inner_height, 0])

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var palettes = [
                '#FF0009',
                "#FFCA0D",
                "#14CC16",
                "#0D52FF",
                "#CC149D",
                "#993A8C",
                "#752967",
                "#009EBD",
                "#005B8F",
                "#1F1F67",
                "#FFA733",
                "#CC0007", 
                "#48B200"];
spinner.style.display = 'block';
setTimeout(() => {

    d3.csv("./data/top_100_youtubers.csv").then(function(data) {

        
        const categoryUnique = [...new Set(data.map(d => d.Category))] //select only unique values of category
        const countryUnique = [...new Set(data.map(d => d.Country))].sort() //select only unique values of countries
        createCountryList(countryUnique);
      
          
      
        let barValues = [];
        let itemCount = 0;
        // Restructure the data
        Object.keys(categoryUnique).forEach(index => {
            itemCount = 0;
            Object.entries(data).forEach(entry => {
                const [key, item] = entry;
                if (categoryUnique[index] === item.Category && item.Country === countryInput) {
                    itemCount+= 1;
                }
            });
            // reconstruct the data
            barValues.push({
                category: categoryUnique[index],
                value: itemCount
            });

        });
        console.log(barValues, 'bv')
        var colorScale = d3.scaleOrdinal().domain(barValues.map(d => d.category))
            .range(palettes)

        xscale.domain(barValues.map(d => d.category))

        var xaxis = d3.axisBottom()
            .scale(xscale)
     

        g.append('g')
            .attr('transform', 'translate(0,' + inner_height + ')')
            .call(xaxis)
            .append('text')
            .attr('x', inner_width / 2.5)
            .attr('y', 40)
            .attr('fill', '#FF0009')
            .attr('font-size','1rem')
            .attr('font-weight','700')
            .attr('font-family', 'var(--font-family-bold)')
            .text('Categories')

        yscale.domain([0, d3.max(barValues, d => parseInt(d.value) + 1)])

        var yaxis = d3.axisLeft()
            .scale(yscale)
          

        g.append('g')
            .call(yaxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -170)
            .attr('y', -30)
            .attr('fill', '#FF0009')
            .attr('font-size','1rem')
            .attr('font-weight','700')
            .attr('font-family', 'var(--font-family-bold)')
            .text('Total Channels')

        var graph = g.selectAll(".graph")
            .data(barValues)
            .enter()
            .append('g')
        

        graph.append("rect")
            .attr("class", "bar")
            .attr("fill", function(d){ return colorScale(d) })
           
            .attr('x', function(d) {
                return xscale(d.category)
            })
            
            .attr('y', function(d) {
                return yscale(0)
            })
            .attr('width', xscale.bandwidth())
            .attr('height', function(d) {
                return inner_height - yscale(0)
            })
            .on("mouseover", function(event,d){
                tooltip
                  .style("left", event.clientX -10 + "px")
                  .style("top", event.clientY - 10 + "px")
                  .style("display", "inline-block")
                  .html((d.category) + " <b>("+ (d.value) + " channels)</b>");
            })
                .on("mouseout", function(d){ tooltip.style("display", "none");});

        //14. add transition for the chart
        svg.selectAll('rect')
            .transition()
            .ease(d3.easeLinear)
            .duration(800)
            .attr("y", function(d) {
                return yscale(parseInt(d.value))
            })
            .attr("height", function(d) {
                return inner_height - yscale(parseInt(d.value))
            })
            .delay(function(d, i) {
                return i * 100
            })
            d3.selectAll("svg").exit();
    });
    spinner.style.display = 'none';
    
    chart.style.display = 'block';
    $('#exampleModal').modal('hide');
}, 1000);
}

// main call
drawChart(countryInput)