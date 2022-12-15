
var countryInput = 'US'; // get it from the dropdown   
const spinner = document.getElementById('spinner-sm');
let topCountry = [];
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
    d3.selectAll("svg6").remove();
    chart.innerHTML = '';
    $('#exampleModal').modal('hide');
    drawChart(countryInput);
 }

function drawChart (countryInput){
    
var svgwidth = 1600
var svgheight = 800;
var padding = 100;

var viewBox = '0 0 1200 900'

var svg = d3.select('#chart-6')
    .append('svg')
    .attr('class', 'svg6')
    .attr('viewBox', viewBox)


svg.append("text")
    .style('font-size', '45px')
    .style('font-weight', '800')
    .style('fill','var(--rosso)')
    .attr("x", 30)
    .attr('y', 30)
    .attr('id', 'chart-title')
    .style('font-family', 'var(--font-family-sec-bold)')
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

var palettes =  ['#CC0007', '#1F1F67',  '#4D4D4D', '#FFA733', '#005B8F', '#009EBD','#752967', '#E1E1E1', '#4D4D4D',  '#993A8C', '#0D0D0D']
spinner.style.display = 'block';
setTimeout(() => {

    d3.csv("./data/top_100_youtubers.csv").then(function(data) {

        
        const categoryUnique = [...new Set(data.map(d => d.Category))].sort() //select only unique values of category
        const countryUnique = [...new Set(data.map(d => d.Country))].sort() //select only unique values of countries
        createCountryList(countryUnique);
      
        let barValues = [];
        let countriesCountValues = [];
        let itemCount = 0;
        let countriesCount = 0;
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
                total_channel: countriesCount
            });
        });

   
       
        
        topCountry =countriesCountValues.sort(function(a, b) {
            return b.total_channel - a.total_channel
          })
        
            //for stat chart value
            const flag = document.getElementById('top-country-flag');
            flag.innerHTML = '<i class="bi bi-1-square"></i> <img src ="'+'./assets/flags/'+topCountry[0].country+'.png" alt ="'+topCountry[0].country+'" class="flag-icon-alt"/><div class="fs-6">'+topCountry[0].country+'</div>';
            const flagVal = document.getElementById('top-country-flag-value');
            flagVal.innerHTML = topCountry[0].total_channel;
     
            document.getElementById('top-2-country-flag').innerHTML  =  ' <img alt ="'+topCountry[1].country+'" src ="'+'./assets/flags/'+topCountry[1].country+'.png" class="flag-icon"/> ' + topCountry[1].country + '  <span class="badge bg-dark rounded-pill float-end mt-1">'+topCountry[1].total_channel+'</span>';
            document.getElementById('top-3-country-flag').innerHTML  =  ' <img alt ="'+topCountry[2].country+'" src ="'+'./assets/flags/'+topCountry[2].country+'.png" class="flag-icon"/> ' + topCountry[2].country + '  <span class="badge bg-dark rounded-pill float-end mt-1">'+topCountry[2].total_channel+'</span>';
            document.getElementById('top-4-country-flag').innerHTML  =  ' <img alt ="'+topCountry[3].country+'" src ="'+'./assets/flags/'+topCountry[3].country+'.png" class="flag-icon"/> ' + topCountry[3].country + '  <span class="badge bg-dark rounded-pill float-end mt-1">'+topCountry[3].total_channel+'</span>';
            document.getElementById('top-5-country-flag').innerHTML  =  ' <img alt ="'+topCountry[4].country+'" src ="'+'./assets/flags/'+topCountry[4].country+'.png" class="flag-icon"/> ' + topCountry[4].country + '  <span class="badge bg-dark rounded-pill float-end mt-1">'+topCountry[4].total_channel+'</span>';
     
            var colorScale = d3.scaleOrdinal().domain(barValues.map(d => d.category))
            .range(palettes)

             xscale.domain(barValues.map(d => d.category))

             var xaxis = d3.axisBottom()
                .scale(xscale)
          
     

        g.append('g')
            .attr('transform', 'translate(0,' + inner_height + ')')
            .attr('class','x-axis')
            .call(xaxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr('fill', '#000')
            .attr('font-weight','700')
            .style('font-family', 'var(--font-family-sec-bold)')
            .attr("transform", "rotate(-45)")
            .style("font-size", "20px");

        g.append('text')
            .attr('x', 550)
            .attr("y", inner_height + 120)
            .style("font-size", "30px")
            .attr('fill', '#FF0009')
            .style('font-weight','700')
            .style('font-family', 'var(--font-family-sec-bold)')
            .text('Categories')
            

        yscale.domain([0, d3.max(barValues, d => parseInt(d.value) + 1)])

        var yaxis = d3.axisLeft()
            .scale(yscale)
            .tickFormat(d3.format('.0f'))
            .ticks(d3.max(barValues, d => parseInt(d.value) + 1));
        

        g.append('g')
            .call(yaxis)
            .selectAll("text")
            .attr('fill', '#000')
            .attr('font-weight','700')
            .attr('font-family', 'var(--font-family-sec-bold)')
            .style("font-size", "25px");
        
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -400)
            .attr('y', -31)
            .attr('fill', '#FF0009')
            .attr('font-weight','700')
            .attr('font-family', 'var(--font-family-sec-bold)')
            .style("font-size", "30px")
            .text('Total Channels')

        var graph = g.selectAll(".graph")
            .data(barValues)
            .enter()
            .append('g')
        

        graph.append("rect")
            .attr("class", "bar")
            .attr("fill", function(d){ return colorScale(d.category) })
           
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
                d3.select(this).style("opacity", "0.5");
                tooltip
                  .style("left", event.clientX-5 + "px")
                  .style("top", event.clientY+250 + "px")
                  .style("display", "inline-block")
                  .html((d.category) + " <b>("+ (d.value) + " channels)</b>");
            })
                .on("mouseout", function(d){ 
                    d3.select(this).style("opacity", "1");
                    tooltip.style("display", "none");});

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
        
   
    });
 
    spinner.style.display = 'none';
    chart.style.display = 'block';
    $('#exampleModal').modal('hide');
}, 1000);

}

// main call
drawChart(countryInput)

