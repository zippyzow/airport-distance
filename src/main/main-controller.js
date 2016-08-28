airModule.controller('mainCtrl', function($scope, airports) {

  //Google maps setup

  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(40.0000, -98.0000),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  //map layer
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  //marker layer
  var markerFrom = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP
  });

  //marker layer
  var markerTo = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP
  });

  var flightPlanCoordinates = null;

  var flightPath = null;

  //search function to match airport data against user input
  this.getMatches = function(searchText, otherAirport) {
    var filteredAirports = airports.filter(function(airport) {
      //prevents searching the same from and to airport
      if (airport === otherAirport) {
        return false;
      } else {
        return airport.code.indexOf(searchText.toUpperCase()) === 0 ||
        airport.name.toLowerCase().indexOf(searchText.toLowerCase()) === 0 ||
        airport.city.toLowerCase().indexOf(searchText.toLowerCase()) === 0;
      }
    });
    return filteredAirports;
  };

  //function used in main.html to format data in autocomplete
  this.getSearchText = function(airport) {
    return airport.code + ' - ' + airport.city + ' - ' + airport.name;
  };

  //this function is called when the user changes the 'from' field
  this.handleSelectedFromAirportChange = function() {
    updateDistanceAndFlightPath();
    updateMarker($scope.selectedFromAirport, markerFrom);
    updateZoom();
  };

  //this function is called when the user changes the 'to' field
  this.handleSelectedToAirportChange = function() {
    updateDistanceAndFlightPath();
    updateMarker($scope.selectedToAirport, markerTo);
    updateZoom();
  };

  //configure marker based on whether the airport has been selected or not
  function updateMarker(airport, marker) {
    if (airport !== null) {
      marker.setPosition({lat: parseFloat(airport.lat), lng: parseFloat(airport.lng)});
      marker.setTitle(airport.name);
      marker.setMap(map);
    } else {
      marker.setMap(null);
      marker.setPosition(null);
      marker.setTitle(null);
    }
  }

  //configure zoom position based on the number of airports selected
  function updateZoom() {
    if (markerFrom.getPosition() && markerTo.getPosition()) {
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(markerTo.getPosition());
      bounds.extend(markerFrom.getPosition());
      map.fitBounds(bounds);
    } else {
      var center = markerFrom.getPosition() || markerTo.getPosition();
      if (center) {
        map.setCenter(center);
      } else {
        map.setCenter(new google.maps.LatLng(40.0000, -98.0000));
      }
      map.setZoom(4);
    }
  }

  //if both airports are selected calculate distance and render flight path
  //else hide the distance and remove the flight path
  function updateDistanceAndFlightPath() {
    if ($scope.selectedFromAirport && $scope.selectedToAirport) {
      $scope.distance = calculateDistanceInMiles(
          parseFloat($scope.selectedFromAirport.lat),
          parseFloat($scope.selectedFromAirport.lng),
          parseFloat($scope.selectedToAirport.lat),
          parseFloat($scope.selectedToAirport.lng));

      $scope.showDistance = true;

      flightPlanCoordinates = [{lat: parseFloat($scope.selectedFromAirport.lat), lng: parseFloat($scope.selectedFromAirport.lng)},
                               {lat: parseFloat($scope.selectedToAirport.lat), lng: parseFloat($scope.selectedToAirport.lng)}];

      flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#3F51B5',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      flightPath.setMap(map);
    } else {
      $scope.showDistance = false;
      if (flightPath) {
        flightPath.setMap(null);
      }
    }
  }

  // http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
  function calculateDistanceInMiles(lat1, lng1, lat2, lng2) {
    var earthRadiusKm = 6371;
    var lat1Rad = toRad(lat1);
    var lng1Rad = toRad(lng1);
    var lat2Rad = toRad(lat2);
    var lng2Rad = toRad(lng2);

    var latDiff = lat2Rad - lat1Rad;
    var lngDiff = lng2Rad - lng1Rad;
    var a = hav(latDiff) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * hav(lngDiff);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distanceKm = earthRadiusKm * c;
      return distanceKm * 0.621371;
  }

  function toRad(deg) {
    return Math.PI * deg / 180;
  }

  // https://en.wikipedia.org/wiki/Haversine_formula
  function hav(rad) {
    return Math.pow(Math.sin(rad / 2), 2);
  }


});