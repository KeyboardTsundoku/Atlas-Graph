angular.module('graph.process', ['search'])
.controller('graph',['$scope', 'Query', 'graphService', function($scope, Query, graphService) {
  $scope.$on('query.update', function(event) {
    var term = Query.getRecentQuery();
    $scope.data = Query.getDetail(term);
    //console.log($scope.data);
    //$scope.$apply();
    $scope.flag = false;
    graphService.addData($scope.data);
  });

  $scope.sigma = new sigma({
    graph: {nodes: [], edges: []},
    renderer: {
      container: document.getElementById('container'),
      type: 'canvas'
    },
    settings: {
      edgeLabelSize: 'proportional',
      edgeColor: 'default',
      defaultEdgeColor: 'red'
    }
  });
   
  $scope.flag = false;

  $scope.$on('graph.update', function(event) {
    console.log(graphService.graphList.nodes);
    console.log(graphService.graphList.edges);
    console.log($scope.sigma.graph.clear());
    var g = {'nodes': graphService.graphList.nodes, 'edges': graphService.graphList.edges};
    console.log($scope.sigma.graph.read(g));
    console.log($scope.sigma.refresh());
    $scope.flag = true;
  });
  
  //$scope.data = Query.getDetail("Australia");
}])
.service('graphService', ['$rootScope', function($rootScope) {
  
  var service = {
    graphList: {},

    addData: function(data) {
      var nodes = [];
      var edges = [];
      
      //var keyList = [];
      //var valList = [];
      
      /*
      for (var key in data) {
        keyList.push(key);
      }

      for (var index in keyList) {
        valList.push(data[keyList[index]]);
      }
      
      console.log(keyList);
      console.log(valList);
      for (var index in keyList) {
        service.graphList[keyList[index]] = valList[index];
      }
      */

      // put name at the center
      nodes.push({'id': data["geonameId"], 'label': data["name"], 'color': '#fff', 'x': 500, 'y': 200, 'size': 2});

      // put everything else around it
      for (var key in data) {
        if (key != "name" && key != "countryName" && key != "geonameId") {
          nodes.push({'id': (data["geonameId"] + ":" + data[key]), 'label': data[key], 'color': '#000', 'x': (Math.random() * 1000 + 1), 'y': (Math.random() * 400 + 1), 'size': 1 });
          edges.push({'id': (data["geonameId"] + key), 'source': data["geonameId"], 'target': (data["geonameId"] + ":" + data[key]), 'label': key});
        }
      }
            service.graphList['nodes'] = nodes;
      service.graphList['edges'] =  edges;
      $rootScope.$broadcast('graph.update');
    }
  };
  
  return service;
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
