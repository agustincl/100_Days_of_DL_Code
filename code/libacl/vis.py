from IPython.display import IFrame
import json
import uuid
import os

def get_dirs():
    dir_path = os.path.dirname(os.path.realpath('__file__'))
    working_path = os.getcwd()
    graphs_directory = working_path + '/nn_definitions/'
    options = {"root_dir": dir_path, "definions_dir": graphs_directory, "html_dir": "figures/"}
    return options
    
def draw(name):
    options = get_dirs()
    with open('nn_definitions/' + name + '.json') as f:
        data = json.load(f)
    print(data['graphs']['label'])
    return redraw(data, options, physics=True, limit=100, physicskeeper=False)

def drawd3(name):
    options = get_dirs()    
    with open('nn_definitions/' + name + '.json') as f:
        data = json.load(f)
    print(data['graphs']['label'])
    return redrawd3(data, options, physics=True, limit=100, physicskeeper=False)

def redrawd3(data, options, physics=False, limit=100, physicskeeper=False):
    graph = data['graphs']
    nodes = []
    edges = []
    for row in graph['nodes']:
        source_id = row['id']
        source_label = row['label']
        source_title = ''
        source_group = ''

        if 'type' in row:
            source_group = row['group']
        elif 'metadata' in row:
            if 'group' in row['metadata']:
                source_group = row['metadata']['group']

        if 'metadata' in row:
            source_title = row['metadata']

        # source_info = {"id": source_id, "label": source_label, "group": source_group, "title": source_title}
        source_info = {"id": source_id, "name": source_label, "group": source_group, "title": source_title}

        if source_info not in nodes:
            nodes.append(source_info)

        edge_label = ''
        edge_to = ''
        edge_from = ''

        for edge in graph['edges']:
            if edge['source'] == source_id:
                edge_from = edge['source']
                edge_to = edge['target']
                if 'value' in edge:  # if 'relation' in edge:
                    edge_label = edge['value']

                # edges.append({"from": edge_from, "to": edge_to, "label": edge_label})
                edges.append({"source": edge_from, "target": edge_to, "value": edge_label})
    
    graphs_filename = options['html_dir'] + 'graph-' + graph['label'] + '.html'
    return d3_network(graphs_filename, nodes, edges, physics=physics, physicskeeper=False)

def d3_network(graphs_filename, nodes, edges, physics=False, physicskeeper=False):
    html = """
    <!DOCTYPE html>
        <head>
          <meta charset="utf-8">
          <title>Dynamically changing force parameters</title>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
          <script src="http://d3js.org/d3.v5.min.js"></script>
          <link href="../includes/d3/style.css" rel="stylesheet" type="text/css">            
        </head>
        <body>
            <svg></svg>
            <div id="main" role="main">
              <div id="vis"></div>
            </div>
            <script>
                var _nodes = {nodes};
                var _edges = {edges};
                var physicskeeper = {physicskeeper};
                var id = "{id}";
            </script>
            <script src="../includes/d3/netd3.js"></script>
        </body>
    </html>
    """

    unique_id = str(uuid.uuid4())
    html = html.format(id=unique_id, nodes=json.dumps(nodes), edges=json.dumps(edges), physics=json.dumps(physics), physicskeeper=json.dumps(physicskeeper))

    file = open(graphs_filename, "w")
    file.write(html)
    file.close()

    return IFrame(graphs_filename, width="100%", height="300")

def vis_network(graphs_filename, nodes, edges, physics=False, physicskeeper=False):
    html = """
    <html>
    <head>
      <script type="text/javascript" src="../includes/vis/vis.js"></script>
      <link href="../includes/vis/vis.css" rel="stylesheet" type="text/css">
    </head>
    <body>

    <div id="{id}"></div>
    <script>
        var nodes = {nodes};
        var edges = {edges};
        var physics = {physics};
        var physicskeeper = {physicskeeper};
        var id = "{id}";
    </script>
    <script src="../includes/vis/netvis.js"></script>
    </body>
    </html>
    """

    unique_id = str(uuid.uuid4())
    html = html.format(id=unique_id, nodes=json.dumps(nodes), edges=json.dumps(edges), physics=json.dumps(physics), physicskeeper=json.dumps(physicskeeper))

#     filename = graphs_directory + "graph-{}.html".format(unique_id)
#     file = open(filename, "w")
    file = open(graphs_filename, "w")
    file.write(html)
    file.close()

    return IFrame(graphs_filename, width="100%", height="300")



def redraw(data, options=False, physics=False, limit=100, physicskeeper=False):
    graph = data['graphs']
    nodes = []
    edges = []

    for row in graph['nodes']:
        source_node = row
        source_id = row['id']
        source_label = row['label']

        source_title = ''
        source_group = ''

        if 'type' in row:
            source_group = row['type']
        elif 'metadata' in row:
            if 'group' in row['metadata']:
                source_group = row['metadata']['group']

        if 'metadata' in row:
            source_title = row['metadata']

        source_info = {"id": source_id, "label": source_label, "group": source_group, "title": source_title}
        if source_info not in nodes:
            nodes.append(source_info)

        edge_label = ''
        edge_to = ''
        edge_from = ''

        for edge in graph['edges']:
            if edge['source'] == source_id:
                source_rel = edge
                edge_from = edge['source']
                edge_to = edge['target']
                if 'relation' in edge:
                    edge_label = edge['relation']
                edges.append({"from": edge_from, "to": edge_to, "label": edge_label})

    graphs_filename = options['html_dir'] + 'graph-' + graph['label'] + '.html'
    return vis_network(graphs_filename, nodes, edges, physics=physics, physicskeeper=physicskeeper)




