'use strict';

app.service('equippables_resource', function ($rootScope, grid_swings, grid_body, gridActionDefinitions, grid_socket_send) {

	var setStandardVarsAndInit = function (arm, mainBody, initDefs) {
		initDefs.reverseImage = false;
		initDefs.offsets = { x: 0, y: 0 };
		initDefs.bullet = true;
		initDefs.actionTimer = 0;
		initDefs.maskBits = 0x0001;
		initDefs.syncInterval = 100;
		initDefs.density = 0.002;
		initDefs.tags = { objectType: "item" };
		initDefs.setSizeToImageScale = function () {
			this.height /= 30;
			this.width /= 30;
		};
		initDefs.update = function (body) {
			if (!body.details.busy) {
				body.details.getUserRotVars();
				body.addPos({
					x: body.details.parent.body.getPos().x - body.details.body.getPos().x + body.details.xOffset,
					y: body.details.parent.body.getPos().y - body.details.body.getPos().y + body.details.yOffset
				});
				body.body.SetActive(true);
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
		initDefs.setSizeToImageScale();

		if (arm == "right") {
			initDefs.parent = mainBody.connectedBodies["rightArm"];
			initDefs.layer = 2.1;
			initDefs.name = mainBody.name + "-rightItem";
			mainBody.connectedBodies["rightItem"] = grid_body.init(initDefs);
			mainBody.connectedBodies["rightItem"].actionService = gridActionDefinitions.actionDefinition(mainBody.connectedBodies["rightItem"].body);

			if (mainBody.controllable)
				mouseRightClickEvents.push({
					func: function (param) {
						param.body.actionService.init("right");
						grid_socket_send.sendFunctionCall("mainBody.connectedBodies.rightItem.actionService.init", ["right"]);
					},
					param: {
						body: mainBody.connectedBodies["rightItem"]
					}
				});
		}
		else if (arm == "left") {
			initDefs.parent = mainBody.connectedBodies["leftArm"];
			initDefs.layer = 2;
			initDefs.name = mainBody.name + "-leftItem";
			mainBody.connectedBodies["leftItem"] = grid_body.init(initDefs);
			mainBody.connectedBodies["leftItem"].actionService = gridActionDefinitions.actionDefinition(mainBody.connectedBodies["leftItem"].body);

			if (mainBody.controllable)
				mouseLeftClickEvents.push({
					func: function (param) {
						param.body.actionService.init("left");
						grid_socket_send.sendFunctionCall("mainBody.connectedBodies.leftItem.actionService.init", ["left"]);
					},
					param: {
						body: mainBody.connectedBodies["leftItem"]
					}
				});
		}
		else
			console.error("E35235 - Arm not defined");
	};

	return {
		init_sword: function (arm, body) {
			var initDefs = {};
			initDefs.actionChain = [
				grid_swings.quickForwardArc,
				grid_swings.quickForwardArcReverse,
				grid_swings.quickForwardArc,
				grid_swings.quickForwardArcReverse
			];
			initDefs.image = "images/misc/testSprite/sword.png";
			initDefs.color = "rgb(200,100,0)";
			initDefs.width = 256;
			initDefs.height = 1600;
			setStandardVarsAndInit(arm, body, initDefs);
		}
	}

});