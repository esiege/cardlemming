'use strict';

var canvasDetails = { gravity: new b2Vec2(0, 0) };
var bindToMouse = [];
var canvasInit = false;

var userBody;
var otherUsers = {};

function GridCtrl($scope, $rootScope, socket, key, queryFactory,
		gridActionDefinitions,
    grid_def,
    grid_userSprite,
    grid_objects,
		grid_movePc,
		grid_socket_get,
		grid_socket_send,
		equippables_resource
    ) {

	initBoard({ border: false });

	var listen = new Listener();

	//mouseLeftClickEvents.push({
	//	func: function (param) {
	//		userBody.actionService.init("left");
	//		grid_socket_send.sendFunctionCall("userBody.actionService.init", ["left"]);
	//	},
	//	param: {
	//		body:userBody
	//	}
	//});
	//mouseRightClickEvents.push(function () {
	//	userBody.actionService.init("right");
	//	grid_socket_send.sendFunctionCall("userBody.actionService.init", ["right"]);
	//});


	queryFactory.query('grid:getUserFromServer', { sid: $rootScope.roomData.room.sid, localPos: $rootScope.roomData.localPos }, function (results) {
		userBody = grid_userSprite.createUser({ x: results.position.x, y: results.position.y, controllable: true, groupIndex: -2, name: 'user' });
		equippables_resource.init_sword("left", userBody);
		equippables_resource.init_sword("right", userBody);
	});

	socket.on('grid:sendUserFromServer', function (results) {
		otherUsers[results.slot_id + ""] = grid_userSprite.createUser({ x: results.position.x, y: results.position.y, controllable: false, groupIndex: -2, name: 'other' });
		equippables_resource.init_sword("left", otherUsers[results.slot_id + ""]);
		equippables_resource.init_sword("right", otherUsers[results.slot_id + ""]);
	});

	canvasInit = true;
	beginUpdate($rootScope);

};
