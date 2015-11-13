'use strict';

var grid = [];
app.service('grid_socket_send', function ($rootScope, socket, queryFactory) {

	return {
		sendFunctionCall: function (functionName, parameters) {
			queryFactory.query('grid:sendFunctionCallToServer', {
				session: $rootScope.session,
				functionName: functionName,
				parameters: parameters
			}, function (results) {

			});
		},
		syncLocalDataInterval: function () {
			queryFactory.query('grid:syncLocalDataInterval', {
				sid: $rootScope.roomData.room.sid, localPos: $rootScope.roomData.localPos,
				user: {
					sid: $rootScope.roomData.room.sid,
					localPos: $rootScope.roomData.localPos,
					position: { x: userBody.body.getPos().x, y: userBody.body.getPos().y }
				}
			}, function (results) {

			})

		}
	}

});