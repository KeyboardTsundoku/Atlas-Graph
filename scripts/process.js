var app = angular.module('process', ['search']);

app.controller('processController', ['$scope', 'queryService', 'graphService', function($scope, Query, Graph) {
  $scope.$on('query.update', function(event) {
    var term = Query.getRecentQuery();
    $scope.data = Query.getDetail(term);
    console.log($scope.data);
    //$scope.$apply();
    $scope.flag = false;
    Graph.addData($scope.data);
  });

}]);
