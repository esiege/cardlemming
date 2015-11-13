function LoginCtrl($scope, $rootScope, $http, userFactory, queryFactory, socket, update) {
	$scope.loginScreen = 'login';
	$scope.validationErrors = {};
	$scope.validationErrors.userName = "";
	var userList = null;
	$rootScope.user = userFactory.user;

	$scope.getValidationError = function (type) {
		if ($scope.validationErrors[type])
			return "has-error";
		else
			return null;
	}

	$scope.login = function () {
		if (!userFactory.user.userName) {
			$scope.validationErrors.login = "Enter Username";
			return;
		}

		$http.post(app.userConfigs.apiPath + "Account/Login", userFactory.baseModel()).success(function (results) {
			if (results.error) { $scope.validationErrors = results.error; return; } else {

				userFactory.updateUser(results);
				$scope.setScreen("Lobby");

			}
		});
	}

	$scope.addNewUser = function () {
		if (!userFactory.user.userName) {
			$scope.validationErrors.userName = "Enter Username";
			return;
		}


		$http.post(app.userConfigs.apiPath + "Account/AddNewUser", userFactory.baseModel()).success(function (results) {
			if (results.error) { $scope.validationErrors = results.error; return; } else {

				$scope.message = "New Account Created";
				$scope.loginScreen = 'login';

			}
		});
	}

	$scope.setLogin = function (screenType) {
		$scope.validationErrors = {};
		$scope.loginScreen = screenType;
	};
}
