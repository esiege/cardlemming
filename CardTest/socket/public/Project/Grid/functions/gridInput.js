'use strict';

app.service('grid_input', function ($rootScope, grid_def, grid_movePc, grid_socket_send) {
	return {
		moveBodyASDW: function (body) {
			if (key[keycode_a]) {
				grid_socket_send.sendFunctionCall("grid_movePc.moveBodyAStep", ["W"]);
				grid_movePc.moveBodyAStep(body, 'W');
			}
			if (key[keycode_s]) {
				grid_socket_send.sendFunctionCall("grid_movePc.moveBodyAStep", ["S"]);
				grid_movePc.moveBodyAStep(body, 'S');
			}
			if (key[keycode_d]) {
				grid_socket_send.sendFunctionCall("grid_movePc.moveBodyAStep", ["E"]);
				grid_movePc.moveBodyAStep(body, 'E');
			}
			if (key[keycode_w]) {
				grid_socket_send.sendFunctionCall("grid_movePc.moveBodyAStep", ["N"]);
				grid_movePc.moveBodyAStep(body, 'N');
			}
		},

		mouseBodyRotation: function (body) {

			if (body.details.moving)
				return;

			var mouseDif = {};

			mouseDif.x = mouse.x / 2 - body.getPos().x;
			mouseDif.y = mouse.y / 2 - body.getPos().y;


			//if ( mouseDif.x > 0 && Math.abs( mouseDif.x ) > Math.abs( mouseDif.y ) )
			//{
			//    body.details.rotation = 'E';
			//}
			//if ( mouseDif.x < 0 && Math.abs( mouseDif.x ) > Math.abs( mouseDif.y ) )
			//{
			//    body.details.rotation = 'W';
			//}
			//if ( mouseDif.y > 0 && Math.abs( mouseDif.x ) < Math.abs( mouseDif.y ) )
			//{
			//    body.details.rotation = 'S';
			//}
			//if ( mouseDif.y < 0 && Math.abs( mouseDif.x ) < Math.abs( mouseDif.y ) )
			//{
			//    body.details.rotation = 'N';
			//}
		}
	}


});