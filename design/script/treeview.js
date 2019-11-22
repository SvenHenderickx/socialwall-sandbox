$(document).ready(function() {
    var width = $('#chart').width(),
        height = $('#chart').height(),
        root;

    var force = d3.layout.force()
        .linkDistance(500)
        .charge(-100)
        .gravity(.002)
        .size([width, height])
        .on("tick", tick);

    var svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

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
        link = link.data(links, function(d) {
            return d.target.id;
        });

        link.exit().remove();

        link.enter().insert("line", ".node")
            .attr("class", "link");

        // Update nodes.
        node = node.data(nodes, function(d) {
            return d.id;
        });

        node.exit().remove();

        var nodeEnter = node.enter().append("g")
            .attr("class", classes)
            .attr("data-id", dataid)
            .on("click", click)
            .call(force.drag);

        nodeEnter.append("circle")
            .attr("r", size);

        nodeEnter.append("text")
            .attr("dy", ".35em")
            .text(returntext);

        node.select("circle")
            .style("fill", color);
    }

    function tick() {
        link.attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        showPosts();
    }

    function color(d) {
        return d._children ? "#3182bd" // collapsed package
            :
            d.children ? "#c6dbef" // expanded package
            :
            "#fd8d3c"; // leaf node
    }

    function size(d){
        return d._children ? 100 // collapsed package
            :
            d.children ? 100 // expanded package
            :
            200; // leaf node
    }

    function classes(d){
        return d._children ? "node" // collapsed package
            :
            d.children ? "node" // expanded package
            :
            "post"; // leaf node
    }

    function returntext(d){
        return d._children ? d.name // collapsed package
            :
            d.children ? d.name // expanded package
            :
            ""; // leaf node
    }

    function dataid(d){
        return d._children ? -1// collapsed package
            :
            d.children ? -1 // expanded package
            :
            d.id; // leaf node
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
        removePosts();
        update();
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
        var nodes = [],
            i = 0;

        function recurse(node) {
            if (node.children) node.children.forEach(recurse);
            if (!node.id) node.id = ++i;
            nodes.push(node);
        }

        recurse(root);
        return nodes;
    }

})

function showPosts() {
    $.each($('div#chart .post'), function(k, v) {

        var pos = $(v)[0].getAttribute('transform');
        var result = pos.split(',');
        var xpos = result[0].substr(10);
        var ypos = result[1].substr(0, result[1].length - 1);

        // $('.postblock').text("{'top': "+ xpos + ", 'left': " + ypos + "}");
        // $('.postblock').css({'top': xpos + "px", 'left': ypos + "px"});
        var isAdded = false;

        $.each($('div#chart .postblock'), function(kp, vp) {
            if ($(vp).attr('data-id') == $(v).attr('data-id')) {
                $(vp).css({
                    'top': ypos - 200 + "px",
                    'left': xpos - 200 + "px"
                });

                // $(vp).attr('transform', pos);
                isAdded = true;
            }

        })

        if(!isAdded){
            $('#chart').append('<div class="postblock" data-id="' + $(v).attr('data-id') + '" style="top: ' + xpos + '; left:' + ypos + ';"></div>');
        }
    })

    removePosts();
}

function removePosts(){
    $.each($('div#chart .postblock'), function(k, v) {

        var isAdded = false;

        $.each($('div#chart .post'), function(kp, vp) {
            if ($(vp).attr('data-id') == $(v).attr('data-id')) {

                isAdded = true;
            }

        })

        if(!isAdded){
            $(v).remove();
        }
    })
}
