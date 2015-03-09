var app = angular.module('map', []);

app.directive('agMap', function() {
  return {
    restrict: 'E',
    controller: ['$scope', '$timeout', function($scope, $timeout) {
      var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
      var mapOptions = {
        zoom: 1,
        center: myLatlng
      };
      
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      
      $scope.marker = new google.maps.Marker({
        position: null,
        map: $scope.map,
        title: 'default'
      });

      $scope.infoWindow = new google.maps.InfoWindow();      

      google.maps.event.addListener($scope.marker, 'click', function() {
        $scope.infoWindow.setContent('<b>' + $scope.marker.title + '</b>');
        $scope.infoWindow.open($scope.map, $scope.marker);
        $timeout(function() {$scope.infoWindow.close()}, 2000);
      });

      $scope.$on('map.update', function(event, region) {
        console.log("center of the map!");
        console.log(region); 
        var latLng = new google.maps.LatLng(region.lat, region.lng);
        $scope.map.setCenter(latLng);
        $scope.map.setZoom(4);
        $scope.marker.setPosition(latLng);
        $scope.marker.setTitle(region.name);
      });
    }],
    templateUrl: 'partials/map.html'
  };
});
