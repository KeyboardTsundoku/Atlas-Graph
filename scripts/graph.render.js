angular.module('graph.render', ['graph.process'])
.directive('agGraph',['graphService', function (Graph) {
  return {
    restrict: 'E',
    templateUrl: 'partials/graph.html',
    controller: ['$scope', function($scope) {
      $scope.$on('graph.update', function(event) {
        console.log("updating the graph");
        $scope.graph = Graph.graphList;
        //console.log(Graph.graphList);

        //var graph = {nodes: Graph.nodes, edges: Graph.edges};

        console.log($scope.graph);
        var s = new sigma({
          graph: $scope.graph,
          renderer: {
            container: document.getElementById('container'),
            type: 'canvas'
          },
          settings: {
            edgeLabelSize: 'proportional'
          }
        });
     });  
    }]
  };
}]);

/**<script>
    //initialize sigma
    //add some information
    var a = {id: 'n0', label: 'hello', color: '#f00', x: 0, y: 0, size: 1};
    var b = {id: 'n1', label: 'world', color: '#00f', x: 1, y: 1, size: 1};
    var edge = {id: 'e0', source: 'n0', target: 'n1', size: 1, label: 'worlf!'};
    var g = {
      nodes: [],
      edges: []
    };
    g.nodes.push(a);
    g.nodes.push(b);
    g.edges.push(edge);

    var s = new sigma({
      graph: g,
      renderer: {
        container: document.getElementById('container'),
        type: 'canvas'
      },
      settings: {
        edgeLabelSize: 'proportional'
      }
    });
    //s.refresh();
  </script>

**/
