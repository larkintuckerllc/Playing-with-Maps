angular.module('myApp').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
      	  		templateUrl: 'views/home.html',
       			controller: 'HomeCtrl'
      		}).
		when('/error', {
      	  		templateUrl: 'views/error.html',
       			controller: 'ErrorCtrl'
      		}).
      		otherwise({
       			redirectTo: '/'
      		});
}]);
