var app = angular.module('Atlas-Graph', ['ui.bootstrap', 'search', 'process', 'render', 'map']);

app.controller('init', ['$scope', '$http', 'queryService', function($scope, $http, Query) {
    url = 'data/countries.json';
    $http.get(url)
    .success(function(data) {
      $scope.json = data;
      console.log(data)
      var countries = $scope.json.geonames;
      var names = []
      var details = {};
      for (index in countries) {
        names.push(countries[index].name);
        details[countries[index].name] = countries[index];
      }
      //console.log(names);
      //console.log(names.length);
      //console.log(details);
      names.sort();
      Query.addCountries(names, details);
      $scope.$root.$broadcast('query.countryLoading');
    })
    .error(function(json) {
      console.log("abort! no countries");
    });
}]);

app.controller('helpController', ['$modal', '$scope', function($modal, $scope) {
  $scope.dialog = function() {
    $modal.open({templateUrl: 'partials/help.html'});
  };
}]);

app.controller('loadingController', ['$timeout', '$modal', '$scope', function($timeout, $modal, $scope) {
  $scope.$on('loading', function(event) {
    console.log("loading gif is supposed to happen, rawr");
    $scope.dialog = $modal.open({
      templateUrl: 'partials/loading.html'
    });
    $timeout(function() {$scope.dialog.close()}, 2000); // 2 second of loading
  });
}]);

