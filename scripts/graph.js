angular.module('graph', ['search'])
.directive('agGraph',[function () {
  return {
    restrict: 'E',
    templateUrl: 'partials/graph.html'
  };
}])
.controller('graph',['$scope', 'query', function($scope, query) {
  console.log("HEY IS THERE ANYONE HERE?");
  $scope.data = query.getDetail("Australia");
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
