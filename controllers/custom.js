var customControllers = angular.module('customControllers', []);

customControllers.controller('HomeCtrl', ['$scope', 'navigator', 'myFirebase', '$window', '$timeout',  function ($scope, navigator, myFirebase, $window, $timeout) {
	$scope.navigate = navigator.navigate;
	$scope.sliderContainerOpen = false;
	$scope.sliderOpen = false; 
	$scope.sliderTitle;
	$scope.sliderContent;
	$scope.openSlider = function() {
		$scope.sliderContainerOpen = true;
		$timeout(function() {
			$scope.sliderOpen = true;
		}, 200);
	};
	$scope.closeSlider = function() {
		$scope.sliderOpen = false;
		$timeout(function() {
			$scope.sliderContainerOpen = false;
		}, 1000);
	};
	var center = {lat: 29.6254423, lng: -82.4373587};
	var radius = 2;
	var markers = {};
	var searchArea;	
        var mapOptions = {
		center: center,
		zoom: 13,
		disableDefaultUI: true,
		zoomControl: true,
		zoomControlOptions: {
			style: $window.google.maps.ZoomControlStyle.DEFAULT,
			position: $window.google.maps.ControlPosition.BOTTOM_LEFT
		},
		scaleControl: true
        };
	var map;
	var geoFire;
	var geoQuery;
	var cleanUp = function() {
		for (marker in markers) {
			$window.google.maps.event.clearInstanceListeners(marker);
		}
		$window.google.maps.event.clearInstanceListeners(searchArea);
	};
        map = new $window.google.maps.Map($window.document.getElementById('map_container'),
            mapOptions);	
	searchArea = new $window.google.maps.Circle({
		center: center,
		draggable: true,
		radius: radius * 1000,
		fillColor: '#00FF00',
		fillOpacity: 0.2,
		map: map,
		strokeColor: '#00FF00',
		strokeOpacity: '1',
		strokeWeight: 2	
	});	
	$window.google.maps.event.addListener(searchArea, 'center_changed', function() {
		geoQuery.updateCriteria({
			center: [searchArea.center.lat(), searchArea.center.lng()],
			radius: radius 
		});
	});
	geoFire = new $window.GeoFire(myFirebase.ref.child('lots_geo'));	
	geoQuery = geoFire.query({
		center: [center.lat, center.lng],
		radius: radius 
	});
	geoQuery.on('key_entered', function(key, location, distance) {
		markers.key = new $window.google.maps.Marker({
			position: {lat: location[0], lng: location[1]},
			map: map
		});
	        $window.google.maps.event.addListener(markers.key, 'click', function() {
			myFirebase.onceValue(myFirebase.ref.child('lots').child(key), function(snapshot) {
				var lot = snapshot.val();
				if (lot) {
					$scope.sliderTitle = lot.description;
					$scope.sliderContent = 'detail';
					$scope.openSlider();
				}
			}, function() {
				cleanUp();
				navigator.navigate('/error');
			});
                });
	});
	geoQuery.on('key_exited', function(key, location, distance) {
		$window.google.maps.event.clearInstanceListeners(markers.key);
		markers.key.setMap(null);
		delete markers.key;
	});
}]);
