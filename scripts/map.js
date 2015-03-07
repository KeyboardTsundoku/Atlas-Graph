var app = angular.module('map', []);

app.directive('agMap', function() {
  return {
    restrict: 'E',
    controller: ['$scope', '$timeout', function($scope, $timeout) {
      var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
      var mapOptions = {
        zoom: 4,
        center: myLatlng
      };
      
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      
      $scope.marker = new google.maps.Marker({
        position: myLatlng,
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
        $scope.marker.setPosition(latLng);
        $scope.marker.setTitle(region.name);
      });
      /*
      $scope.openInfoWindow = function(e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
      };
      */
    }],
    templateUrl: 'partials/map.html'
  };
});
