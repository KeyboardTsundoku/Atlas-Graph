var app = angular.module('process', ['search']);

app.controller('processController', ['$http', '$scope', 'queryService', 'graphService', 'processService', function($http, $scope, Query, Graph, Process) {
  $scope.$on('query.update', function(event) {
    var term = Query.getRecentQuery();
    var details = Query.getDetail(term);

    Process.newCountry(details.geonameId, details);
    Graph.showCountry({'name': term, 'id': details.geonameId});
  });

  $scope.$on('graph.getChildren', function(event, node) {
    console.log("get children has been hit");
    //console.log(node);
    var children = Process.getChildren(node.id);
    if (children != null) {
      console.log("it already exists");
      Graph.showChildren({'name': node.label, 'id': node.id}, children);
    }
    else {
      $scope.$root.$broadcast('loading');
      var url = "http://api.geonames.org/childrenJSON?username=sytheris&geonameId=" + node.id;       

      $http.get(url)
        .success(function(data) {
          console.log(data);
          Process.addChildren(node.id, data.geonames);
          //console.log(Process.places);
          Graph.showChildren({'name': node.label, 'id': node.id}, Process.getChildren(node.id));
        })
        .error(function(data) {
          children = "no more children";
          console.log("there were no more children here....");
        });
      }
  });

  $scope.$on('graph.showDetails', function(event, node) {
    Graph.showDetails({'name': node.label, 'id': node.id}, Process.getDetails(node.id)); 
  });

}]);

app.service('processService',['$rootScope', '$http', function($rootScope, $http) {
  var service = {
    places: {}, // location object made out of location id keys

    newCountry: function(id, details) {
      service.places[id] = {};
      service.places[id].details = details;
      var guardian = {
        'name': service.places[id].details.name,
        'lat': service.places[id].details.lat,
        'lng': service.places[id].details.lng
      };
      $rootScope.$broadcast('map.update', guardian); // show guardian in map
    },

    addChildren: function(id, children) {
      service.places[id].children = [];
      for (var index in children) {
        var child = children[index];
        var mini = {'name': child.name, 'id': child.geonameId, 'relationship': child.fcode};
        //console.log(id);
        //console.log(mini);
        //console.log(service.places[id].children);
        service.places[id].children.push(mini);
        service.places[mini.id] = {};
        service.places[mini.id].details = child;
      }
    },

    getDetails: function(id) {
      return service.places[id].details;
    },

    getChildren: function(id) {
      var guardian = {
        'name': service.places[id].details.name,
        'lat': service.places[id].details.lat,
        'lng': service.places[id].details.lng
      };
      $rootScope.$broadcast('map.update', guardian); // show guardian in map
      return service.places[id].children;
    }
  };

  return service;
}]);
