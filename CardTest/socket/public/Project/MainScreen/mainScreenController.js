var incog;

function MainCtrl($scope, $rootScope, socket, update, pageFactory, three_draw) {

	incog = false;
	$scope.incognito = incog;
	$scope.screenType = pageFactory.getPage();
	$rootScope.spriteList = [];
	$scope.showDebug = false;

	$scope.setScreen = function (screenType) {
		pageFactory.setPage(screenType);
		$scope.screenType = screenType;
	};

	$scope.quick = function () {
		//$scope.setScreen('Grid');
		$scope.setScreen('Login');
	};

	if ($scope.incognito) {
		$scope.opacIncog = .05;
		$scope.BGIncog = "background-image: url('images/bg.png');";
		$scope.opacIncog = "opacity:0.1;"
		//$scope.quick();
	};
	$scope.quick();

	$scope.setScreen('Card');
}

