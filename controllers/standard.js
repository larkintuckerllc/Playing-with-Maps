var standardControllers = angular.module('standardControllers', []);

standardControllers.controller('ErrorCtrl', ['$scope', '$window', function ($scope, $window) {
	$scope.reloadApplication = function() {
		$window.location.href = '/';
	}
}]);
