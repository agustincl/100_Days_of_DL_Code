console.log(nodes)
console.log(edges)
console.log(id)

var container = document.getElementById(id);

var data = {
    nodes: nodes,
    edges: edges
};

var options = {
      nodes: {
        shape: 'dot',
        margin: 100,
        font: {
          size: 12
        },
        widthConstraint: {
            maximum: 200
        }
      },
      edges: {
          font: {
              size: 12
          },
          arrows: {
              to: {enabled: true, scaleFactor: 0.5}
          },
          smooth: {enabled: false},
          widthConstraint: {
              maximum: 150
          }
      },
      physics: {
          enabled: physics,
          forceAtlas2Based: {
                gravitationalConstant: -50,
                centralGravity: 0.003,
                springLength: 100,
                springConstant: 0.08,
                damping: 0.50,
                avoidOverlap: 0.09
            },
            maxVelocity: 63,
            solver: 'forceAtlas2Based',
//            timestep: 0.35,
            stabilization: {
                enabled: true,
                iterations: 1000,
                updateInterval: 25
            },
//          "barnesHut": {
//              "gravitationalConstant": -9850,
//              "centralGravity": 0.95,
//              "springLength": 120,
//              "springConstant": 0.45,
//              "avoidOverlap": 0.1
//          },
          "minVelocity": 0.75
      },
      interaction: {
        tooltipDelay: 200,
        hideEdgesOnDrag: true,
        selectConnectedEdges: true,
      },
      layout:{
          randomSeed:22,
          improvedLayout: false
      }
};

var network = new vis.Network(container, data, options);

network.on("stabilizationIterationsDone", function () {
    network.setOptions( { physics: physicskeeper } );
});


