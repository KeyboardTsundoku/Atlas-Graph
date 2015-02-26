angular.module('search', [])
.directive('agSearch', ['queryService', function(Query) {
  return {
    restrict: 'E',
    controller: ['$scope', '$http',function($scope, $http) {
      $scope.query = 'Australia';
      $scope.detail = '';

      $scope.search = function() {
        console.log($scope.query);
        var url = 'http://api.geonames.org/searchJSON?featureCode=PCLI&username=sytheris&name=' + $scope.query;
        $http.get(url)
        .success(function(data) {
          console.log(data);
          if (data.geonames.length == 0) {
            $scope.detail = "nothing to see here...";
          }
          else {
            $scope.detail = data.geonames[0];
          }
          Query.addQuery($scope.query, $scope.detail);
          //query.getDetail($scope.query);
        })
        .error(function(json) {
          detail = 'I am sorry but the query is not valid';
          Query.addQuery($scope.query, $scope.detail);
          console.log("this isn't the right way");
        });
      };
 
    }],
    templateUrl: 'partials/search.html'
  };
}])
.service('queryService', ['$rootScope', function($rootScope) {
  var service = {
    details: {},
    queries: [],
    
    addQuery: function(query, detail) {
      service.queries.push(query);
      service.details[query] = detail;
      $rootScope.$broadcast('query.update');
    },
    
    getRecentQuery: function() {
      return service.queries[service.queries.length - 1];
    },
    
    getDetail: function(query) {
      return service.details[query];
    }
  };
  
  return service;
}]);
/*
.controller('agSearchCtrl', ['$scope', '$http', 'query', function($scope, $http, query) {
  $scope.query ='Australia';
  $scope.detail= '';

  $scope.search = function() {
    console.log(query);
    var url = 'http://api.geonames.org/searchJSON?featureCode=PCLI&username=sytheris&name=' + $scope.query;
    query.setDetail("Australia", url); 
    $http.get(url)
    .success(function(data) {
      console.log(data);
      if (data.geonames.length == 0) {
        $scope.detail = "nothing to see here...";
      }
      else {
        $scope.detail = JSON.stringify(data.geonames[0]);
      }
      query.setDetail($scope.query, $scope.detail);
      //query.getDetail($scope.query);
    })
    .error(function(json) {
      detail = 'I am sorry but the query is not valid';
      query.setDetail($scope.query, $scope.detail);
      console.log("this isn't the right way");
    });
  };
  
}]);
*/
