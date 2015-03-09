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
.directive('agTraversal', ['graphService', function(Graph) {
  return {
    restrict: 'E',
    controller: function($scope) {
      $scope.breadCrumbs = [];
      $scope.$on('graph.update', function(event) {
        $scope.breadCrumbs = Graph.breadCrumbs;
        //$scope.$apply()
        //console.log($scope.breadCrumbs);
      });

      $scope.select = function(element) {
        console.log("this ought to do stuff");
        console.log(element);

        if (element.mode == Graph.childrenTag) {
          $scope.$root.$broadcast('graph.getChildren', {'label': element.label, 'id': element.node});  
        }
        else if (element.mode == Graph.detaisTag) {
          $scope.$root.$broadcast('graph.showDetails', {'label': element.label, 'id': element.node});
        }
        else {
          Graph.showCountry({'name': element.label, 'id': element.node});
        }
      };
    },
    templateUrl: 'partials/traversal.html'
  };
}])
.controller('graphController',['$scope', 'queryService', 'graphService', function($scope, Query, Graph) {

    $scope.sigma = new sigma({
    graph: {nodes: [], edges: []},
    renderer: {
      container: document.getElementById('graph-container'),
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
      edgeHoverExtremities: true,
      minEdgeSize: 0.5,
      maxEdgeSize: 4,
      doubleClickEnabled: false
    }
  });
   
  var dragListener = sigma.plugins.dragNodes($scope.sigma, $scope.sigma.renderers[0]);

  // double click event triggers action on enabled nodes
  $scope.sigma.bind('doubleClickNode', function(e) {
    //console.log(e);
    //console.log(Graph.enabledNode(e.data.node));

    if (Graph.enabledNode(e.data.node)) {
      //console.log("double click event to grab children");
      $scope.$root.$broadcast('graph.getChildren', e.data.node); //show children
    }
  });

  $scope.sigma.bind('clickStage', function(e) {
    //console.log(e.data.node);
    //console.log();

    if (Graph.graphList.nodes == null) {
      return;
    }

    var node = Graph.graphList.nodes[0];
    console.log(node);
    console.log(Graph.centerNode(node));
    console.log(Graph.inDetailsMode(node));
    // only show details for the center node
    if (Graph.centerNode(node)) {
      if (Graph.inDetailsMode(node)) {
        $scope.$root.$broadcast('graph.getChildren', node); // show children
      }
      else {
        //console.log("left click event to show details");
        $scope.$root.$broadcast('graph.showDetails', node); // show details
      }
    }
  });

  // update the graph 
  $scope.$on('graph.update', function(event) {
    //console.log(Graph.graphList.nodes);
    //console.log(Graph.graphList.edges);
    $scope.sigma.graph.clear();
    var g = {'nodes': Graph.graphList.nodes, 'edges': Graph.graphList.edges};
    $scope.sigma.graph.read(g);
    $scope.sigma.refresh();
    //console.log(Graph.breadCrumbs); //show breadcrumbs on console
  });
  
  //$scope.data = Query.getDetail("Australia");
}])
.service('graphService', ['$rootScope', function($rootScope) {
  var activeNodeColor = 'green';
  var inactiveNodeColor = '#000';
  var centerNodeSize = 5;
  var endNodeSize = 2;
  var edgeColor = '';
  var xCenter = 400;
  var yCenter = 200;

  var service = {
    graphList: {},
    breadCrumbs: [],

    homeTag: 'first',
    detailsTag: 'information',
    childrenTag: 'subdivision',


    enabledNode: function(node) {
      if (node.color == activeNodeColor) {
        return true;
      }
      return false;
    },

    centerNode: function(node) {
      if (node.x == xCenter && node.y == yCenter) {
        return true;
      }
      return false;
    },

    inDetailsMode: function(node) {
      //console.log(node);
      var recent = service.breadCrumbs[0];
      if (node.id == recent.node && recent.mode == service.detailsTag) {
        return true;
      }
      return false;
    },

    showChildren: function(guardian, children) {
      var nodes = [];
      var edges = [];
      
      var keyList = [];
      var valList = [];

      console.log(guardian);
      console.log(children);
      // make center node guardian
      nodes.push({'id': guardian['id'], 'label': guardian['name'], 'color': activeNodeColor, 'x': xCenter, 'y': yCenter, 'size': centerNodeSize});

      for (var index in children) {
        var child = children[index];
        var xPosition = Math.floor((Math.random() * xCenter * 2) + 1);
        var yPosition = Math.floor((Math.random() * yCenter * 2) + 1);
        nodes.push({'id': child['id'], 'label': child['name'], 'color': activeNodeColor, 'x': xPosition, 'y': yPosition, 'size': endNodeSize});
        edges.push({'id': (guardian['id'] + '-' + child['id']), 'source': guardian['id'], 'target': child['id'], 'label': child['relationship'], 'size': 2});
      }
        
      service.breadCrumbs.unshift({'node': guardian.id, 'label': guardian.name, 'mode': service.childrenTag});
      
      // render the graph 
      service.graphList['nodes'] = nodes;
      service.graphList['edges'] =  edges;
      $rootScope.$broadcast('graph.update');
    },
    
    showDetails: function(guardian, details) {
      var nodes = [];
      var edges = [];
      
      var detailKeys = [
        {
          'key': 'countryCode',
          'x': 286,
          'y': 131
        },
        {
          'key': 'toponymName',
          'x': 700,
          'y': 131
        },
        {
          'key': 'population',
          'x': 266,
          'y': 313
        },
        {
          'key': 'lat',
          'x': 230,
          'y': 205
        },
        {
          'key': 'lng',
          'x': 509,
          'y': 350
        },
        {
          'key': 'fcodeName',
          'x': 677,
          'y': 339
        },
        {
          'key': 'name',
          'x': 450,
          'y': 90
        }
      ];

      //console.log(guardian);
      // put guardian at the center
      nodes.push({'id': guardian.id, 'label': guardian.name, 'color': activeNodeColor, 'x': xCenter, 'y': yCenter, 'size': centerNodeSize});

      for (var index in detailKeys) {
        //console.log(detailKeys[index]);
        var key = detailKeys[index].key;
        nodes.push({
          'id': (guardian.id + ':'+ key),
          'label': details[key] + '',
          'color': inactiveNodeColor,
          'x': detailKeys[index].x,
          'y': detailKeys[index].y,
          'size': 1
        });
        edges.push({
          'id': key,
          'source': guardian.id,
          'target': (guardian.id + ':' + key),
          'label': key,
          'size': 2
        });
      }

      // render the graph 
      service.graphList['nodes'] = nodes;
      service.graphList['edges'] =  edges;

      service.breadCrumbs.unshift({'node': guardian.id, 'label': guardian.name, 'mode': service.detailsTag});

      console.log(nodes);
      console.log(edges);
      $rootScope.$broadcast('graph.update');
    },

    focusNode: function(node) {
      var nodes = [];
      var edges = [];

      node.x = '500';
      node.y = '200';
      nodes.push(node);
      service.graphList['nodes'] = nodes;
      service.graphList['edges'] = edges;
    },
    
    showCountry: function(node) {
        var nodes = [];  
        nodes.push({'id': node.id, 'label': node.name, 'color': activeNodeColor, 'x': xCenter, 'y': yCenter, 'size': centerNodeSize});
        
        service.graphList['nodes'] = nodes;
        service.graphList['edges'] = [];
        
        service.breadCrumbs.unshift({'node': node.id, 'label': node.name, 'mode': service.homeTag});
        $rootScope.$broadcast('graph.update');
    }

  };

   
  return service;
}]);


