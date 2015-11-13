'use strict';

var grid = [];
app.service('grid_socket_get', function ($rootScope, socket, grid_movePc) {

	socket.on('grid:getFunctionCallFromServer', function (data) {
		var functionName = data.data.functionName;
		var parameters = data.data.parameters;
		var gridbody = otherUsers[data.data.session.localPos];

		switch (functionName) {
			case "grid_movePc.moveBodyAStep":
				grid_movePc.moveBodyAStep(gridbody.body, parameters[0]);
				break
			case "mainBody.connectedBodies.leftItem.actionService.init":
				gridbody.connectedBodies.leftItem.actionService.init(parameters[0]);
				break
			case "mainBody.connectedBodies.rightItem.actionService.init":
				gridbody.connectedBodies.rightItem.actionService.init(parameters[0]);
				break
			default:
				console.error("X0235: " + functionName + " not found.");
				break
		}
	});

	
	socket.on('grid:syncLocalDataInterval', function (data) {
		var user = otherUsers[data.localPos + ""];

		user.body.setPos(data.position);
	});



});