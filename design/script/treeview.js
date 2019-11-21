$(document).ready(function(){
    var width = $('#chart').width(),
    height = $('#chart').height(),
    root;

    var force = d3.layout.force()
        .linkDistance(distance)
        .charge(-300)
        .gravity(.01)
        .size([width, height])
        .on("tick", tick);

    var svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node"),
        posts = svg.selectAll(".node .post");


    d3.json("script/graph.json", function(error, json) {
      if (error) throw error;

      root = json;
      update();
    });

    function update() {
      var nodes = flatten(root),
          links = d3.layout.tree().links(nodes);

      // Restart the force layout.
      force
          .nodes(nodes)
          .links(links)
          .start();

      // Update links.
      link = link.data(links, function(d) { return d.target.id; });

      link.exit().remove();

      link.enter().insert("line", ".node")
          .attr("class", "link");

      // Update nodes.
      node = node.data(nodes, function(d) { return d.id; });
      node.exit().remove();

      var nodeEnter = node.enter().append("g")
          .attr("class", classes)
          .attr("data-id", function(d){return d.id})
          .on("click", click)
          .call(force.drag);

      $.each(nodeEnter[0], function(k, v){
          if($(v).hasClass('post')){
              // $(this).append("rect")
              //     .attr("width", 200)
              //     .attr("height", 200);
              //
              // $(this).append("text")
              //     .attr("dy", ".35em")
              //     .text(function(d) { return d.name; });
              //
              // $(this).select("rect")
              // .style("fill", color);

              // console.log(node);
          }
          else{

          }
      })

      // nodeEnter.append("rect")
      //     .attr("width", 200)
      //     .attr("height", 200);
      //
      // nodeEnter.append("text")
      //     .attr("dy", ".35em")
      //     .text(function(d) { return d.name; });
      //
      // nodeEnter.select("rect")
      // .style("fill", color);

      nodeEnter.append("circle")
          .attr("r", isround);

      nodeEnter.append("text")
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });

      node.select("circle")
      .style("fill", color);


      // Update posts.
      // posts = posts.data(posts, function(d) { return d.id; });
      // console.log(posts);
      //
      // posts.exit().remove();
      //
      // var postsEnter = posts.enter().append("g")
      //     .attr("class", classes)
      //     .on("click", click)
      //     .call(force.drag);
      //
      // postsEnter.append("rect")
      //     .attr("width", 200)
      //     .attr("height", 200);
      //
      // postsEnter.append("text")
      //     .attr("dy", ".35em")
      //     .text(function(d) { return d.name; });
      //
      // postsEnter.select("rect")
      //     .style("fill", color);


    }

    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      showPosts();

    }

    function color(d) {
      return d._children ? "#014d83" // collapsed package
          : d.children ? "#6199cf" // expanded package
          : "#002962"; // leaf node
    }

    function isround(d) {
        return d._children ? 100 // collapsed package
            : d.children ? 50 // expanded package
            : 0; // leaf node
    }

    function distance(d){
        return d._children ? 10 // collapsed package
            : d.children ? 300 // expanded package
            : 200; // leaf node
    }

    function classes(d){
        return d._children ? 'node first' // collapsed package
            : d.children ? 'node' // expanded package
            : 'post'; // leaf node
    }

    function ispost(d){
        return d._children ? "circle" // collapsed package
            : d.children ? "circle" // expanded package
            : "circle" // leaf node
    }

    // Toggle children on click.
    function click(d) {
      if (d3.event.defaultPrevented) return; // ignore drag
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update();
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
      var nodes = [], i = 0;

      function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        nodes.push(node);
      }

      recurse(root);
      return nodes;
    }

})

function showPosts(){
    $.each($('div#chart .post'), function(k, v){

        var pos = $(v)[0].getAttribute('transform');
        var result = pos.split(',');
        var xpos = result[0].substr(10);
        var ypos = result[1].substr(0, result[1].length - 1);

        // $('.postblock').text("{'top': "+ xpos + ", 'left': " + ypos + "}");
        // $('.postblock').css({'top': xpos + "px", 'left': ypos + "px"});

        $.each($('div#chart .postblock'), function(kp, vp){
            if($(vp).attr('data-id') == $(v).attr('data-id')){
                $(vp).css({'top': xpos + "px", 'left': ypos + "px"});
            }
            
        })
    })
}
