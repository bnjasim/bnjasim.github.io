document.addEventListener("DOMContentLoaded", function(event) { 
//do d3 stuff here

// The svg where map is shown
var svg_map = d3.select("svg#map-svg"),
  svg_map_width = +svg_map.attr("width"),
  svg_map_height = +svg_map.attr("height");

// Dropdown selection
var dropdown = document.querySelector('#category-selector');
var type_to_index = {"Exports": 1, "Imports": 2};

// Tooltip for maps
var tip_map = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-5, 0])
  .html(function(d) {
    var dataRow = data.get(d.id);
    var index = type_to_index[dropdown.value];   
    if (dataRow && dataRow[index] > 0) {
       // console.log(dataRow);
       var trade = Math.round(dataRow[index])/1000
       return d.properties.name + ": $" + trade + " Billion";
    } else {
       console.log("no dataRow", d);
       return d.properties.name + ": No data.";
    }
});

svg_map.call(tip_map);

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(120)
  .center([0,55])
  .translate([svg_map_width / 2, svg_map_height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([10, 100, 1000, 10000, 100000, 1000000, 10000000])
  .range(d3.schemeBlues[7]);

// var colorScale = d3.scaleSequentialLog([10, 100000000], d3.interpolateBlues);

// The svg where map is shown
var svg_legend = d3.select("#legend-svg"),
  svg_legend_width = +svg_legend.attr("width"),
  svg_legend_height = +svg_legend.attr("height");

// Legend

var glegend = svg_legend.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(0,80)");

glegend.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text(dropdown.value); 

var labels = ['< 10 million', '10 - 100 million', 
                '100 million - 1 Billion', '1 - 10 Billion', '10 - 100 Billion', '100 Billion - 1 Trillion', '>1 Trillion'];
var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);

svg_legend.select(".legendThreshold")
    .call(legend);

// Bar chart
// set the dimensions and margins of the graph
var bar_margin = {top: 20, right: 30, bottom: 60, left: 90},
    bar_width = 560 - bar_margin.left - bar_margin.right,
    bar_height = 480 - bar_margin.top - bar_margin.bottom;

// append the svg object to the body of the page
var bar_svg = d3.select("#bar-svg")
    .attr("width", bar_width + bar_margin.left + bar_margin.right)
    .attr("height", bar_height + bar_margin.top + bar_margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + bar_margin.left + "," + bar_margin.top + ")");


// Tooltip for barcharts
var tip_bar = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-5, 0])
  .html(function(d) {  
    var index = type_to_index[dropdown.value] 
    var trade = Math.round(d.value[index])/1000
    return d.value[0] + ": $" + trade + " Billion";
  })

bar_svg.call(tip_bar);


// navigation tabs; event listeners
var maps_tab  = document.querySelector('#mainTab button[data-bs-target="#maps"]');
var top10_tab  = document.querySelector('#mainTab button[data-bs-target="#top10"]');
var info_tab  = document.querySelector('#mainTab button[data-bs-target="#info"]');
var legend_area = document.querySelector('#legend-area');

maps_tab.addEventListener('click', function (event) {
    var target = new bootstrap.Tab(maps_tab);
    event.preventDefault();
    target.show();
    // console.log('Maps');
    legend_area.setAttribute('class', 'visible');
});

top10_tab.addEventListener('click', function (event) {
    var target = new bootstrap.Tab(top10_tab);
    event.preventDefault();
    target.show();
    // console.log('Top10');
    legend_area.setAttribute('class', 'invisible');
});

info_tab.addEventListener('click', function (event) {
    var target = new bootstrap.Tab(info_tab);
    event.preventDefault();
    target.show();
    // console.log('Info');
    legend_area.setAttribute('class', 'invisible');
});


// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .defer(d3.csv, "trade_data.csv", function(d) { data.set(d.code, [d.name, d.exp, d.imp]); })
  .await(ready);

// Sort objects
function get_top10(data, index) {
  // convert dictionary to list type
  items = data.entries();

  // Sort the array based on the second element
  items.sort(function(first, second) {
    return second.value[index] - first.value[index];
  });

  // Create a new array with only the first 5 items
  return(items.slice(0, 10));
}

// Code for re-rendering maps & bar charts
function re_render(type) {
  index = type_to_index[type];
  // Re-Draw the map
  d3.select('#g-maps')
    .selectAll("path")
    .attr("fill", function (d) {
        var values = data.get(d.id) || ["name", 0, 0];
        return colorScale(values[index]);
    })

  // update title/caption
  d3.select(".caption")
    .attr("x", 0)
    .attr("y", -6)
    .text(dropdown.value);  

  // update the barchart
  var top10_data = get_top10(data, index);
  // Add X axis
  var bar_x = d3.scaleLinear()
    .domain([0, 3500])
    .range([ 0, bar_width]);
  // Update the Y axis (i.e. names of countries)
  var bar_y = d3.scaleBand()
    .range([ 0, bar_height ])
    .domain(top10_data.map(function(d) { return d.value[0]; }))
    .padding(.1);
    
    d3.select('#bar-y-axis')
    .call(d3.axisLeft(bar_y))

  //Update Bars
  bar_svg.selectAll("rect").remove()

  bar_svg.selectAll("bar-Rect")
    .data(top10_data)
    .enter()
    .append("rect")
    .attr("x", bar_x(0) )
    .attr("y", function(d) { return bar_y(d.value[0]); })
    .attr("width", function(d) { return bar_x(d.value[index]/1000); })
    .attr("height", bar_y.bandwidth() )
    .attr("fill", "#69b3a2")
    .on('mouseover', tip_bar.show)
    .on('mouseout', tip_bar.hide);
}


function ready(error, topo) {
  // Draw the map
  svg_map.append("g")
    .attr("id", "g-maps")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        var values = data.get(d.id) || [0, 0];
        d.exports = values[1];
        d.imports = values[2];
        return colorScale(d.exports);
      })
      .on('mouseover', tip_map.show)
      .on('mouseout', tip_map.hide);

  // Draw the bar chart
  var index = type_to_index[dropdown.value];
  var top10_data = get_top10(data, index);
  // console.log(top10_data.map(function(d) { return d.key; }));

  // Add X axis
  var bar_x = d3.scaleLinear()
    .domain([0, 3500])
    .range([ 0, bar_width]);
  
  bar_svg.append("g")
    .attr("transform", "translate(0," + bar_height + ")")
    .call(d3.axisBottom(bar_x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // x axis label
  bar_svg.append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", bar_width/2 + 120)
    .attr("y", bar_height + bar_margin.bottom)
    .text("Trade Volume (In Million US Dollars)");

  // Y axis
  var bar_y = d3.scaleBand()
    .range([ 0, bar_height ])
    .domain(top10_data.map(function(d) { return d.value[0]; }))
    .padding(.1);
    
    bar_svg.append("g")
    .attr('id', 'bar-y-axis')
    .call(d3.axisLeft(bar_y))

  //Bars
  bar_svg.selectAll("bar-Rect")
    .data(top10_data)
    .enter()
    .append("rect")
    .attr("x", bar_x(0) )
    .attr("y", function(d) { return bar_y(d.value[0]); })
    .attr("width", function(d) { return bar_x(d.value[index]/1000); })
    .attr("height", bar_y.bandwidth() )
    .attr("fill", "#69b3a2")
    .on('mouseover', tip_bar.show)
    .on('mouseout', tip_bar.hide);

  // change map type usign dropdown box
  dropdown.addEventListener('change', function (event) {
    // change the data to be displayed
    console.log(dropdown.value);
    re_render(dropdown.value);

  });
}
});
