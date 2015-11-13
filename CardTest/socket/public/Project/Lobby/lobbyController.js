function LobbyCtrl($scope, $rootScope, $http, userFactory, queryFactory, socket, update) {

	$rootScope.user = userFactory.user;


	$scope.match = function () {

		$http.post(app.userConfigs.apiPath + "Lobby/Match", userFactory.baseModel()).success(function (results) {
			userFactory.updateUser(results);
			console.log('Started Sessions Search');
			checkForSessions();
		});

	};

	function checkForSessions() {

		console.log('Searching...');

		$http.post(app.userConfigs.apiPath + "Lobby/AttemptPairing", userFactory.baseModel()).success(function (results) {
			userFactory.updateUser(results);

			if (userFactory.user.sessionId) {
				console.log('matchFound!');
				createRoomAndEnter(userFactory.user.sessionId);
			}
			else
				window.setTimeout(function () { checkForSessions(); }, 3000);

		});

	};


	function createRoomAndEnter(sid) {
		queryFactory.query('login:joinRoom', { sid: sid, playerStatus: 'playing', user: userFactory.user }, function (results) { });
	}

	socket.on('login:connectRoom', function (results) {
		userFactory.updateUser(results.room.users[results.localPos]);
		$rootScope.opponent = results.room.users[results.opponentPos];
		$rootScope.roomData = results;
		$rootScope.session = { sid: results.room.sid, localPos: results.localPos };

		console.log("connected");
		console.log(results);
		$scope.setScreen("Card");
	});



}
