$(document).ready(function(){
    var width = $('#chart').width(),
        height = $('#chart').height();

    var fill = d3.scale.category20();

    var svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height);

    var nodes = d3.selectAll("li")[0],
        links = nodes.slice(1).map(function(d) {
          return {source: d, target: d.parentNode.parentNode};
        });

    var force = d3.layout.force()
        .charge(-280)
        .distance(300)
        .nodes(nodes)
        .links(links)
        .size([width, height])
        .start();

    var link = svg.selectAll(".link")
        .data(links)
      .enter().append("line")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    var node = svg.selectAll(".node")
        .data(nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 50)
        .call(force.drag);

    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    });
})
