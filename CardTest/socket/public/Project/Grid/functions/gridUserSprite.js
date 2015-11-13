'use strict';

app.service('grid_userSprite', function ($rootScope, grid_input, grid_swings, gridActionDefinitions, grid_body, grid_movePc, grid_socket_send) {

	this.createUser = function (initDetails) {

		//main defs
		var initDefs = {
			image: "images/misc/testSprite/body.png",
			color: "rgb(0,255,0)",
			name: initDetails.name,
			groupIndex: get_GROUP_ID_INCREMENT(),
			layer: 0,
			x: initDetails.x,
			y: initDetails.y,
			maskBits: 0x0003,
			syncInterval: 100,
			controllable: initDetails.controllable,
			update: function (body, steps) {

				if (body.details.controllable && !body.details.busy) {
					grid_input.mouseBodyRotation(body);
					grid_input.moveBodyASDW(body);
					body.details.getUserRotVars();
				}

				//autocorrection position sync

				if (steps % body.details.syncInterval == 0 && body.details.controllable) {
					grid_socket_send.syncLocalDataInterval();
				}


				//move to position (eg cutscene tool)
				if (body.details.autoMoveTarget && body.details.autoMoveTarget.x && body.details.autoMoveTarget.y) {
					grid_movePc.moveBodyToPosition(body, body.details.autoMoveTarget, body.details.autoMoveRotation);
				}

			},
			getUserRotVars: function () {

				switch (this.rotation) {
					case 'N':
						var angle = 0;
						this.body.setAngle(angle);
						break;
					case 'E':
						var angle = Math.PI * 0.5;
						this.body.setAngle(angle);
						break;
					case 'S':
						var angle = Math.PI * 1.0;
						this.body.setAngle(angle);
						break;
					case 'W':
						var angle = Math.PI * 1.5;
						this.body.setAngle(angle);
						break;
				}
			},
			destroyEvent: function (body) { gl_destroy(body); },
			bindBody: [],
			tags:
		{
			objectType: 'player'
		},
			move: function (loc) {
				this.moving = true;
				this.body.addForce(loc, this.stats.speed);
			},
			isMoving: function () {
				return (!this.arrived.x && !this.arrived.y)
			},
			getGridPos: function () {
				return this.gridPos;
			},
			hit: function () {

				if (this.activity != "hit") {

				}
				this.activity = "hit";
			},
			recover: function () {

				this.activity = "idle";

			},
			stats: {
				speed: 40,
				sideSpeed: 1,
				backSpeed: 1
			},
			connectedBodies: {}
		};

		initDefs.width = 432;
		initDefs.height = 432;
		initDefs.setSizeToImageScale = function () {
			this.height /= 30;
			this.width /= 30;
		}
		initDefs.setSizeToImageScale();

		var mainBody = grid_body.init(initDefs);

		//global connected defs
		initDefs.color = null;
		initDefs.image = null;
		initDefs.density = 0.0000001;
		initDefs.parent = mainBody;
		initDefs.color = null;
		initDefs.move = null;
		initDefs.update = function (body) {
			if (!body.details.busy) {
				body.details.getUserRotVars();
				body.addPos({
					x: body.details.parent.body.getPos().x - body.details.body.getPos().x + body.details.xOffset,
					y: body.details.parent.body.getPos().y - body.details.body.getPos().y + body.details.yOffset
				});
			}
		};
		initDefs.getUserRotVars = function () {
			this.rotation = this.parent.rotation;
			switch (this.rotation) {
				case 'N':
					this.xOffset = this.offsets.x;
					this.yOffset = this.offsets.y;
					break;
				case 'E':
					this.xOffset = -this.offsets.y;
					this.yOffset = this.offsets.x;
					break;
				case 'S':
					this.xOffset = -this.offsets.x;
					this.yOffset = -this.offsets.y;
					break;
				case 'W':
					this.xOffset = this.offsets.y;
					this.yOffset = -this.offsets.x;
					break;
			}
			var angle;
			switch (this.rotation) {
				case 'N':
					angle = 0;
					break;
				case 'E':
					angle = Math.PI * 0.5;
					break;
				case 'S':
					angle = Math.PI * 1.0;
					break;
				case 'W':
					angle = Math.PI * 1.5;
					break;
			}
			if (this.reverseImage)
				angle += Math.PI;
			this.body.setAngle(angle);
		};

		//rightArm
		initDefs.offsets = { x: 15, y: -6 };
		initDefs.layer = 1.1;
		initDefs.image = "images/misc/testSprite/hand.png";
		initDefs.color = "rgb(255,0,0)";
		initDefs.width = 160;
		initDefs.height = 160;
		initDefs.name = initDetails.name + "-rightArm";
		initDefs.setSizeToImageScale();
		mainBody.connectedBodies["rightArm"] = grid_body.init(initDefs);

		//leftArm
		initDefs.offsets = { x: -15, y: -6 };
		initDefs.layer = 1;
		initDefs.image = "images/misc/testSprite/hand.png";
		initDefs.color = "rgb(255,0,0)";
		initDefs.width = 160;
		initDefs.height = 160;
		initDefs.name = initDetails.name + "-leftArm";
		initDefs.setSizeToImageScale();
		mainBody.connectedBodies["leftArm"] = grid_body.init(initDefs);

		//rightShoulder
		initDefs.offsets = { x: 10, y: 0 };
		initDefs.layer = -1.1;
		initDefs.reverseImage = true;
		initDefs.image = "images/misc/testSprite/shoulder.png";
		initDefs.color = "rgb(255,0,0)";
		initDefs.width = 208;
		initDefs.height = 320;
		initDefs.name = initDetails.name + "-rightShoulder";
		initDefs.setSizeToImageScale();
		mainBody.connectedBodies["rightShoulder"] = grid_body.init(initDefs);

		//leftShoulder
		initDefs.offsets = { x: -10, y: 0 };
		initDefs.layer = -1;
		initDefs.reverseImage = false;
		initDefs.image = "images/misc/testSprite/shoulder.png";
		initDefs.color = "rgb(255,0,0)";
		initDefs.width = 208;
		initDefs.height = 320;
		initDefs.name = initDetails.name + "-leftShoulder";
		initDefs.setSizeToImageScale();
		mainBody.connectedBodies["leftShoulder"] = grid_body.init(initDefs);


		//head
		initDefs.parent = mainBody;
		initDefs.offsets = { x: 0, y: 0 };
		initDefs.layer = -2;
		initDefs.reverseImage = false;
		initDefs.image = "images/misc/testSprite/head.png";
		initDefs.color = "rgb(255,0,0)";
		initDefs.width = 304;
		initDefs.height = 304;
		initDefs.tags = { objectType: "player" };
		initDefs.name = initDetails.name + "-head";
		initDefs.setSizeToImageScale();
		mainBody.connectedBodies["head"] = grid_body.init(initDefs);


		return mainBody;
	}





});