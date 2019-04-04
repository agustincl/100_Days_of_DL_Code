var graph = {}
    graph.nodes = _nodes
    graph.links = _edges
var width = 800
var height = 280
var radius = 5
var arrowWidth = 8
var color = d3.scaleOrdinal(d3.schemePaired).domain([0,1,2,3,4,5,6,7,8,9,10])
var scale = d3.scaleSqrt().range([2,20]).domain([0,36])

// Network space
var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)

    //add encompassing group for the zoom
    var g = svg.append("g")
        .attr("class", "everything");

        //add drag capabilities
    var drag_handler = d3.drag()
        .on("start", drag_start)
        .on("drag", drag_drag)
    //    .on("end", drag_end)



    var path = g.append("g")
        .attr("class", "arcs")
        .selectAll("path")
        .data(graph.links)
        .enter().append("path")
//        .attr('marker-end', function(d,i){ return 'url(#marker_arrow)' })

    //draw lines for the links
    var link = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", 1)
            .style("stroke", "#aaa")
//            .attr('marker-end', function(d,i){ return 'url(#marker_arrow)' })
          ;
//          .style("stroke", linkColour);

    //draw circles for the nodes
    var node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r",  radio)
        .attr("fill", d=> color(d.group))

    var label = g.append("g")
        .attr("class", "label")
        .selectAll("text")
        .data(graph.nodes)
        .enter()
        .append("text")
        .text(function(d, i) {
//             return i % 2 == 0 ? "" : d.name;
            return d.name;
        })
        .style("fill", "#555")
        .style("font-family", "Arial")
    //    .style("font-size", 12)
        .style("pointer-events", "none") // to prevent mouseover/drag capture
        .style("font-size", "10px").style("fill", "#333");


var simulation = d3.forceSimulation()
    .nodes(graph.nodes);

var link_force =  d3.forceLink(graph.links)
        .id(function(d) { return d.id; });

//If strength is specified, A positive value causes nodes to attract each other, similar to gravity,
//while a negative value causes nodes to repel each other, similar to electrostatic charge
var charge_force = d3.forceManyBody()
    .strength(-70)
    .distanceMax(width / 3);

// centering force with the specified x- and y- coordinates
var center_force = d3.forceCenter(width / 2, height / 2);

//console.log(link_force)

simulation
    .force("charge_force", charge_force)
    .force("center_force", center_force)
    .force("links",link_force)
    ;

//add tick instructions:
simulation.on("tick", tickActions );
drag_handler(node);


//add zoom capabilities
var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

zoom_handler(svg);
/** Functions **/

function textnode(d){
    console.log(d.name)
    return d.name;
}

function radio(n){
    let size = 0;
    _edges.forEach(l => {
      if(n.id == l.source || n.id == l.target){
        size += 1;
      }
    })
    n.size = size
    return scale(size);
}

//Function to choose what color circle we have
//Let's return blue for males and red for females
function circleColour(d){
    if(d.sex =="M"){
        return "blue";
    } else {
        return "pink";
    }
}

//Function to choose the line colour and thickness
//If the link type is "A" return green
//If the link type is "E" return red
function linkColour(d){
    if(d.type == "A"){
        return "green";
    } else {
        return "red";
    }
}

//Drag functions
//d is the node
function drag_start(d) {
     if (!d3.event.active)
        simulation
            .alphaTarget(0.01)
            .restart()
            ;
     d.fx = d.x;
     d.fy = d.y;
}

//make sure you can't drag the circle outside the box
function drag_drag(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

//function drag_end(d) {
//  if (!d3.event.active) simulation.alphaTarget(0);
//  d.fx = null;
//  d.fy = null;
//}

//Zoom functions
function zoom_actions(){
    g.attr("transform", d3.event.transform)
}

function tickActions() {

    path
      .attr("d", function(d) {
      var x1 = d.source.x,
          y1 = d.source.y,
          x2 = d.target.x,
          y2 = d.target.y,
          dx = x2 - x1,
          dy = y2 - y1,
          dr = Math.sqrt(dx * dx + dy * dy),

          // Defaults for normal edge.
          drx = dr,
          dry = dr,
          xRotation = 0, // degrees
          largeArc = 0, // 1 or 0
          sweep = 1; // 1 or 0

          // Self edge.
          if ( x1 === x2 && y1 === y2 ) {
            // Fiddle with this angle to get loop oriented.
            xRotation = -15;

            // Needs to be 1.
            largeArc = 1;

            // Change sweep to change orientation of loop.
            //sweep = 0;

            // Make drx and dry different to get an ellipse
            // instead of a circle.
            drx = 9;
            dry = 9;

            // For whatever reason the arc collapses to a point if the beginning
            // and ending points of the arc are the same, so kludge it.
            x2 = x2 + 1;
            y2 = y2 + 1;
            return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
          }
//return "M" + x1 + "," + y1 + "," + x2 + "," + y2;


    });

    //update circle positions each tick of the simulation
    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
//        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        ;

    //update link positions
    link
        .attr("d", function(d) {
        var x1 = d.source.x,
          y1 = d.source.y,
          x2 = d.target.x,
          y2 = d.target.y,
          dx = x2 - x1,
          dy = y2 - y1,
          dr = Math.sqrt(dx * dx + dy * dy),

          // Defaults for normal edge.
          drx = dr,
          dry = dr,
          xRotation = 0, // degrees
          largeArc = 0, // 1 or 0
          sweep = 1; // 1 or 0
        return "M" + x1 + "," + y1 + "," + x2 + "," + y2;


    })
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })



    label
        .attr("x", function(d) { return d.x; })
        .attr("y", function (d) { return d.y; });

}
var defs = svg.append('svg:defs')

var data = [
    { id: 0, name: 'circle', path: 'M 0, 0  m -5, 0  a 5,5 0 1,0 10,0  a 5,5 0 1,0 -10,0', viewbox: '-6 -6 12 12' }
  , { id: 1, name: 'square', path: 'M 0,0 m -5,-5 L 5,-5 L 5,5 L -5,5 Z', viewbox: '-5 -5 10 10' }
  , { id: 2, name: 'arrow', path: 'M 0,0 m -5,-5 L 5,0 L -5,5 Z', viewbox: '-5 -5 10 10' }
  , { id: 2, name: 'stub', path: 'M 0,0 m -1,-5 L 1,-5 L 1,5 L -1,5 Z', viewbox: '-1 -5 2 10' }
  ]

var marker = defs.selectAll('marker')
    .data(data)
    .enter()
    .append('svg:marker')
      .attr('id', function(d){ return 'marker_' + d.name})
      .attr('markerHeight', 6)
      .attr('markerWidth', 10)
      .attr('markerUnits', 'strokeWidth')
      .attr('orient', 'auto')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('viewBox', function(d){ return d.viewbox })
      .append('svg:path')
//        .attr("d", "M 0,0 V 4 L6,2 Z")
        .attr('d', function(d){ return d.path })
//        .attr('fill', function(d,i) { return color(i)});
        .attr("fill", "#aaa")



