var app = angular.module('search', []);

app.directive('agSearch', ['queryService', function(Query) {
  return {
    restrict: 'E',
    controller: ['$scope', '$http',function($scope, $http) {
      $scope.query = '';
      $scope.countries = [];

      $scope.$on('query.countryLoading', function() {
        $scope.countries = Query.names;
      });

      $scope.select = function(name) {
        $scope.query = name;
      };
      
      $scope.search = function() {
        if ($scope.query) { 
          Query.addQuery($scope.query);
        }
      };
 
    }],
    templateUrl: 'partials/search.html'
  };
}]);

app.service('queryService', ['$rootScope', function($rootScope) {
  var service = {
    queries: [],
    names: [],
    details: {},

    addCountries: function(names, details) {
      service.names = names;
      service.details = details;
    },

    addQuery: function(query) {
      service.queries.push(query);
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


