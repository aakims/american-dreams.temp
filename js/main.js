
var thisData, alldata; 
var dataset = "https://raw.githubusercontent.com/aakims/spice-rack/master/vdatafull_hq.json";
var parsedData, mapData, yData; 
var yExtent, yMin, yMax, yRange; 



var prepData = function () {
mapData = JSON.parse(JSON.stringify(thisData));
console.log(mapData[0]);
yData = 'all_salary'; 
yExtent = d3.extent(mapData, function(county) { 
//console.log(county[yData]); 
	return county[yData]; });
console.log(yExtent);

yMin = yExtent[0];
yMax = yExtent[1];
//d3.min(mapData, function(county) { console.log(county[yData]); return county[yData]; });
console.log(yMin); 

//var yMax = d3.max(mapData, function(county) {console.log(county[yData]); return county[yData]; });
console.log(yMax); 

yRange = yMax - yMin;
console.log(yRange);

mapData = _.map(mapData, function (county) {
	county = _.pick(county, 'cfips', yData); 
	county[yData] = +county[yData];
	return county; 
}); 



var svg = d3.select("svg");

var path = d3.geoPath();

var y = d3.scaleLinear()
	.domain(yExtent)
    .rangeRound([600, 860]);

var quantile = d3.scaleQuantile()
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));


// var color = d3.scaleThreshold()
//     .domain(yQuantile)
//     .range(d3.schemeBlues[9]);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

// g.selectAll("rect")
//   .data(color.range().map(function(d) {
//       d = color.invertExtent(d);
//       if (d[0] == null) d[0] = yMin;
//       if (d[1] == null) d[1] = yMax;
//       return d;
//     }))
//   .enter().append("rect")
//     .attr("height", 8)
//     .attr("x", function(d) { return y(d[0]); })
//     .attr("width", function(d) { return y(d[1]) - y(d[0]); })
//     .attr("fill", function(d) { return color(d[0]); });

//var h1b = d3.map(mapData, function (d) {return d["cfips"]}); 

var yDataVal = d3.map(mapData, function (d) {return d["cfips"]*100	});
mapData.forEach(function(d) { yDataVal[d.cfips] = + d[yData]});
//h1b.set(d.cfips, +d.tot_worker); 

d3.json("https://unpkg.com/us-atlas@1/us/10m.json", function(error, us) {
  if (error) throw error;

  svg.append("path")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 0.5)
      .attr("d", path(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); })));

  svg.append("path")
      .attr("stroke-width", 0.5)
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));

  svg.append("path")
      .attr("d", path(topojson.feature(us, us.objects.nation)));

	quantile.domain(yExtent);

  svg.append("g")
  	.attr("class", "counties")
  	.selectAll("path")
  	.data(topojson.feature(us, us.objects.counties).features)
  	.enter().append("path")
  	.attr("class", function(d) {console.log(yDataVal[d.id]); console.log(quantile(yDataVal[d.id])); return quantile(yDataVal[d.id])})
  	// .attr("fill", function(d) {console.log(yDataVal[d.id]); return color(yDataVal[d.id]);})
  	.attr("d", path)
  	.append("title");
  	//.text(function(d) {return d.worker = .get(d.cfips)});
});
};

$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
  	alldata = data; 
    parsedData = JSON.parse(data);
    thisData = _.filter(parsedData, function(county) {
    	return county["period"] === "2015Q4"; 
    });
    prepData(); 
}); 
});
