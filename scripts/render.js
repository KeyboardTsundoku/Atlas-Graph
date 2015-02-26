angular.module('render', ['process'])
.directive('resize', ['$window', function($window) {
  return function(scope, element) {
    
    scope.getWindowDimensions = function() {
      return {'h': $window.innerHeight, 'w': $window.innerWidth};
      //console.log(win.height());
      //return {'h': 1000, 'w': 800};
    };

    scope.$watch(scope.getWindowDimensions, function(newVal, oldVal) {
      scope.windowHeight = newVal.h;
      scope.windowWidth = newVal.w;

      scope.style = function () {
        //console.log(newVal.h);
        //console.log(newVal.w);
        //console.log(newVal.h - 100);
        //console.log(newVal.w - 100);
        
        return {
          'height': newVal.h - 100 + 'px',
          'width': newVal.w - 100 + 'px'
        };
      };
    }, true);

    return angular.element($window).bind('resize', function() {
      scope.$apply();
    });
  };
}])
.directive('agGraph',['graphService', function(Graph) {
  return {
    restrict: 'E',
    templateUrl: 'partials/graph.html'
  };
}])
.controller('graphController',['$scope', 'queryService', 'graphService', function($scope, Query, graphService) {

  /*
  $scope.$on('query.update', function(event) {
    var term = Query.getRecentQuery();
    $scope.data = Query.getDetail(term);
    //console.log($scope.data);
    //$scope.$apply();
    $scope.flag = false;
    graphService.addData($scope.data);
  });
  */

  $scope.sigma = new sigma({
    graph: {nodes: [], edges: []},
    renderer: {
      container: document.getElementById('container'),
      type: 'canvas'
    },
    settings: {
      edgeLabelSize: 'proportional',
      edgeColor: 'default',
      defaultEdgeColor: 'red',
      scalingMode: 'inside',
      sideMargin: 100,
      enableEdgeHovering: true,
      edgeHoverPrecision: 20,
      edgeHoverColor:'default',
      defaultEdgeHoverColor: '#000',
      edgeHoverSizeRatio: 1,
      //edgeHoverExtremities: true,
      minEdgeSize: 0.5,
      maxEdgeSize: 4,
      doubleClickEnabled: false
    }
  });
   
  var dragListener = sigma.plugins.dragNodes($scope.sigma, $scope.sigma.renderers[0]);

  $scope.sigma.bind('doubleClickNode', function(e) {
    console.log(e);
    console.log(graphService.enabledNode(e.data.node));
  });
  //$scope.flag = false;

  $scope.$on('graph.update', function(event) {
    console.log(graphService.graphList.nodes);
    console.log(graphService.graphList.edges);
    $scope.sigma.graph.clear();
    var g = {'nodes': graphService.graphList.nodes, 'edges': graphService.graphList.edges};
    $scope.sigma.graph.read(g);
    $scope.sigma.refresh();
    $scope.flag = true;
  });
  
  //$scope.data = Query.getDetail("Australia");
}])
.service('graphService', ['$rootScope', function($rootScope) {
  var activeNodeColor = '#fff';
  var inactiveNodeColor = '#000';
  var edgeColor = '';

  var service = {
    graphList: {},

    enabledNode: function(node) {
      if (node.color == activeNodeColor) {
        return true;
      }
      return false;
    },

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

      var source = 'geonameId';
      // put name at the center
      nodes.push({'id': data[source], 'label': data['name'], 'color': activeNodeColor, 'x': 500, 'y': 200, 'size': 2});
      
      //countryCode
      var key = 'countryCode';
      nodes.push({'id': (data[source] + ':' + data[key]), 'label': data[key], 'color': inactiveNodeColor, 'x': 286, 'y': 131, 'size': 1 });
      edges.push({'id': (data[source] + '-' + key), 'source': data[source], 'target': (data[source] + ':' + data[key]), 'label': key, 'size': 2});
      
      //toponymName
      key = 'toponymName';
      nodes.push({'id': (data[source] + ':' + data[key]), 'label': data[key], 'color': inactiveNodeColor, 'x': 700, 'y': 131, 'size': 1 });
      edges.push({'id': (data[source] + '-' + key), 'source': data[source], 'target': (data[source] + ':' + data[key]), 'label': key, 'size': 2});

      //population
      key = 'population';
      nodes.push({'id': (data[source] + ':' + data[key]), 'label': '' + data[key], 'color': inactiveNodeColor, 'x': 266, 'y': 313, 'size': 1 });
      edges.push({'id': (data[source] + '-' + key), 'source': data[source], 'target': (data[source] + ':' + data[key]), 'label': key, 'size': 2});

      //lat
      key = 'lat';
      nodes.push({'id': (data[source] + ':' + data[key]), 'label': data[key], 'color': inactiveNodeColor, 'x': 230, 'y': 205, 'size': 1 });
      edges.push({'id': (data[source] + '-' + key), 'source': data[source], 'target': (data[source] + ':' + data[key]), 'label': key, 'size': 2});

      //lng
      key = 'lng';
      nodes.push({'id': (data[source] + ':' + data[key]), 'label': data[key], 'color': inactiveNodeColor, 'x': 509, 'y': 350, 'size': 1 });
      edges.push({'id': (data[source] + '-' + key), 'source': data[source], 'target': (data[source] + ':' + data[key]), 'label': key, 'size': 2});

      //fcodeName
      key = 'fcodeName';
      nodes.push({'id': (data[source] + ":" + data[key]), 'label': data[key], 'color': inactiveNodeColor, 'x': 677, 'y': 339, 'size': 1 });
      edges.push({'id': (data[source] + '-' + key), 'source': data[source], 'target': (data[source] + ":" + data[key]), 'label': key, 'size': 2});

      //name
      key = 'name';
      nodes.push({'id': (data[source] + ":" + data[key]), 'label': data[key], 'color': inactiveNodeColor, 'x': 450, 'y': 90, 'size': 1 });
      edges.push({'id': (data[source] + '-' + key), 'source': data[source], 'target': (data[source] + ":" + data[key]), 'label': key, 'size': 2});

      // put everything else around it
      service.graphList['nodes'] = nodes;
      service.graphList['edges'] =  edges;
      $rootScope.$broadcast('graph.update');
    }
  };
  
  return service;
}]);
