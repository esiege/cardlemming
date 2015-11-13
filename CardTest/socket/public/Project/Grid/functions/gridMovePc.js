'use strict';

app.service('grid_movePc', function ($rootScope, grid_def) {
	return {
		moveBodyToPosition: function (body, targetPos, targetRot) {
			body.details.moving = false;
			body.details.animation = "idle";

			var currentPosition = body.getPos();

			var xDiff = targetPos.x - currentPosition.x;
			var yDiff = targetPos.y - currentPosition.y;
			var totalDiff = Math.abs(xDiff) + Math.abs(yDiff);
			console.log(totalDiff);

			if (xDiff < 0) {
				if (body.details.autoMoveRotation != 'E') {
					body.details.moving = true;
					body.details.animation = "active";
					body.details.rotation = 'W'
				}
			}
			if (yDiff > 0) {
				if (body.details.autoMoveRotation != 'N')
				{
					body.details.moving = true;
					body.details.animation = "active";
					body.details.rotation = 'S'
				}
			}
			if (xDiff > 0) {
				if (body.details.autoMoveRotation != 'W') {
					body.details.moving = true;
					body.details.animation = "active";
					body.details.rotation = 'E'
				}
			}
			if (yDiff < 0) {
				if (body.details.autoMoveRotation != 'S') {
					body.details.moving = true;
					body.details.animation = "active";
					body.details.rotation = 'N'
				}
			}

			if (Math.abs(xDiff) < 2) {
				body.setPos({ x: targetPos.x, y: currentPosition.y });
			}
			if (Math.abs(yDiff) < 2) {
				body.setPos({ x: currentPosition.x, y: targetPos.y });
			}
			if (Math.abs(totalDiff) < 2) {
				body.setPos({ x: targetPos.x, y: targetPos.y });
				body.setForce({x:0, y:0});
			}

			if (!body.details.autoMoveRotation) {
				body.details.autoMoveRotation = body.details.rotation;
			}

			if (!body.details.moving) {
				body.details.rotation = body.details.autoMoveRotation;
				body.details.autoMoveTarget = null;
				body.details.autoMoveRotation = null;
				return;
			}
			this.moveBodyAStep(body, body.details.rotation);

		},
		
		moveBodyAStep: function (body, direction) {

			if (direction == 'W') {
				body.details.moving = true;
				body.details.animation = "active";
				body.details.rotation = 'W';
				var s;
				switch (body.details.rotation) {

					case 'W':
						s = body.details.stats.speed;
						body.details.animation = "walk";
						break;
					case 'N':
					case 'S':
						s = body.details.stats.speed * body.details.stats.sideSpeed;
						body.details.animation = "sidestep";
						break;
					case 'E':
						s = body.details.stats.speed * body.details.stats.backSpeed;
						body.details.animation = "backstep";
						break;
				}
				body.details.move({ x: -1 * s, y: 0 });

			}
			if (direction == 'S') {
				body.details.moving = true;
				body.details.animation = "active";
				body.details.rotation = 'S';
				var s;
				switch (body.details.rotation) {

					case 'N':
						s = body.details.stats.speed;
						body.details.animation = "walk";
						break;
					case 'E':
					case 'W':
						s = body.details.stats.speed * body.details.stats.sideSpeed;
						body.details.animation = "sidestep";
						break;
					case 'S':
						s = body.details.stats.speed * body.details.stats.backSpeed;
						body.details.animation = "backstep";
						break;
				}
				body.details.move({ x: 0, y: 1 * s });
			}
			if (direction == 'E') {
				body.details.moving = true;
				body.details.animation = "active";
				body.details.rotation = 'E';
				var s;
				switch (body.details.rotation) {

					case 'E':
						s = body.details.stats.speed;
						body.details.animation = "walk";
						break;
					case 'N':
					case 'S':
						s = body.details.stats.speed * body.details.stats.sideSpeed;
						body.details.animation = "sidestep";
						break;
					case 'W':
						s = body.details.stats.speed * body.details.stats.backSpeed;
						body.details.animation = "backstep";
						break;
				}
				body.details.move({ x: 1 * s, y: 0 });
			}
			if (direction == 'N') {
				body.details.moving = true;
				body.details.animation = "active";
				body.details.rotation = 'N';
				var s;
				switch (body.details.rotation) {

					case 'S':
						s = body.details.stats.speed;
						body.details.animation = "walk";
						break;
					case 'E':
					case 'W':
						s = body.details.stats.speed * body.details.stats.sideSpeed;
						body.details.animation = "sidestep";
						break;
					case 'N':
						s = body.details.stats.speed * body.details.stats.backSpeed;
						body.details.animation = "backstep";
						break;
				}
				body.details.move({ x: 0, y: -1 * s });
			}
		}
	}


});