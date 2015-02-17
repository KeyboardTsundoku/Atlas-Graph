angular.module('search', [])
.directive('agSearch', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/search.html'
  };
})
.service('query', ['$http', function($http) {
  var details = {};
  var list = [];
  var setDetail= function(key, detail) {
    details[key] = detail;
    console.log(details);
  };

  var getDetail = function(key) {
    console.log(key);
    console.log(details[key]);
    console.log(details);
    return details[key];
  };

  return {
    setDetail: setDetail,
    getDetail: getDetail
  };
}])
.controller('agSearchCtrl', ['$scope', '$http', 'query', function($scope, $http, query) {
  $scope.query ='Australia';
  $scope.detail= '';

  $scope.search = function() {
    console.log(query);
    var url = 'http://api.geonames.org/searchJSON?featureCode=PCLI&username=sytheris&name=' + $scope.query;
    query.setDetail("Australia", url); 
    /*
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
    */
  };
  
}]);
