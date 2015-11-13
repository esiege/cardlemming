app.factory('grid_swings', function (grid_body) {
	//#region helpers
	var startAngle =
			{
				left:
						{
							N: Math.PI * 1.5,
							E: 0,
							S: Math.PI * 0.5,
							W: Math.PI
						},
				right:
						{
							N: Math.PI * 1.5,
							E: Math.PI,
							S: Math.PI * 0.5,
							W: 0
						}
			}
	var startPos =
			{
				left:
						{
							x: 30
						},
				right:
						{
							x: 30
						}
			}
	var reverseArmRotation =
			{
				left: 1,
				right: -1
			}

	var forward =
			{
				N: { x: 0, y: -1 },
				E: { x: 1, y: 0 },
				S: { x: 0, y: 1 },
				W: { x: -1, y: 0 }
			}
	var left =
			{
				W: { x: 0, y: -1 },
				N: { x: 1, y: 0 },
				E: { x: 0, y: 1 },
				S: { x: -1, y: 0 }
			}
	var forwardCalc = function (val) {
		return {
			N: { x: 0, y: -val },
			E: { x: val, y: 0 },
			S: { x: 0, y: val },
			W: { x: -val, y: 0 }
		}
	}
	var offset = function (x, y) {
		return {
			N: { x: -x, y: -y },
			E: { x: y, y: -x },
			S: { x: x, y: y },
			W: { x: -y, y: x }
		}
	}
	var getVertHorz = function (rotation) {
		if (rotation == "N" || rotation == "S")
			return -1;
		else
			return 1;
	}
	var getHorzSwap = function (rotation) {
		if (rotation == "S" || rotation == "E")
			return -1;
		else
			return 1;
	}
	var setGlobals = function (swing, user, arm) {
		SWING_BODY = swing;
		USER_BODY = user.details.parent.parent.body;

		if (arm == "left") {
			ARM_BODY = USER_BODY.details.connectedBodies["leftArm"].body;
			SHOULDER_BODY = USER_BODY.details.connectedBodies["leftShoulder"].body;
			ITEM_BODY = USER_BODY.details.connectedBodies["leftItem"].body;
			REV_ARM_BODY = USER_BODY.details.connectedBodies["rightArm"].body;
			REV_SHOULDER_BODY = USER_BODY.details.connectedBodies["rightShoulder"].body;
			REV_ITEM_BODY = USER_BODY.details.connectedBodies["rightItem"].body;
		}
		else {
			ARM_BODY = USER_BODY.details.connectedBodies["rightArm"].body;
			SHOULDER_BODY = USER_BODY.details.connectedBodies["rightShoulder"].body;
			ITEM_BODY = USER_BODY.details.connectedBodies["rightItem"].body;
			REV_ARM_BODY = USER_BODY.details.connectedBodies["leftArm"].body;
			REV_SHOULDER_BODY = USER_BODY.details.connectedBodies["leftShoulder"].body;
			REV_ITEM_BODY = USER_BODY.details.connectedBodies["leftItem"].body;
		}
		HEAD_BODY = USER_BODY.details.connectedBodies["head"].body;
	}
	var setAllBodyDetails = function (prop, val, set, onlyActionRelated) {
		SWING_BODY.details[prop] = val;

		if (!onlyActionRelated) {
			USER_BODY.details[prop] = val;
			HEAD_BODY.details[prop] = val;
		}

		if (set == "main") {
			ITEM_BODY.details[prop] = val;
			if (!onlyActionRelated) {
				ARM_BODY.details[prop] = val;
				SHOULDER_BODY.details[prop] = val;
			}
		}
		else if (set == "rev") {
			REV_ITEM_BODY.details[prop] = val;
			if (!onlyActionRelated) {
				REV_ARM_BODY.details[prop] = val;
				REV_SHOULDER_BODY.details[prop] = val;
			}
		}
		else if (set == "all") {
			ITEM_BODY.details[prop] = val;
			REV_ITEM_BODY.details[prop] = val;
			if (!onlyActionRelated) {
				ARM_BODY.details[prop] = val;
				SHOULDER_BODY.details[prop] = val;
				REV_ARM_BODY.details[prop] = val;
				REV_SHOULDER_BODY.details[prop] = val;
			}
		}
		else
			console.log("set all properties requires set type ('main', 'rev', or 'all')");

	}
	var setBusy = function (set, bool) {
		setAllBodyDetails("busy", bool, set, true);
	}

	var swing_rotate = function (deg) {
		var rad = deg / 360 * 2 * Math.PI;
		ITEM_BODY.addRotation(reverseArmRotation[SWING_BODY.details.arm] * deg);
	}
	var swing_forwardForce = function (force) {
		var rot = USER_BODY.details.rotation;
		SWING_BODY.addForce(forward[rot], force);
	}
	var swing_arcForce = function (force) {
		var rot = USER_BODY.details.rotation;
		SWING_BODY.addForce(left[rot], reverseArmRotation[SWING_BODY.details.arm] * force);
	}
	var swing_setJoints = function (arm) {
		//USER_BODY.details.shoulderJoint = new Joint( USER_BODY, SHOULDER_BODY, { type: "revolute", x: 0, y: 0 } );
		//USER_BODY.details.armJoint = new Joint( SHOULDER_BODY, ARM_BODY, { type: "revolute", x: 0, y: 0 } );
		//USER_BODY.details.actionJoint = new Joint( ARM_BODY, ITEM_BODY, { type: "distance", x: 0, y: 0 } );

		USER_BODY.details.shoulderJoint = new Joint(USER_BODY, SHOULDER_BODY, { type: "distance", dampingRatio: 30, frequencyHz: 1, bodyA_Anchor: { x: 0, y: 0 } });
		USER_BODY.details.armJoint = new Joint(SHOULDER_BODY, ARM_BODY, { type: "distance", dampingRatio: 130, frequencyHz: 30, bodyA_Anchor: { x: 0, y: 0 } });
		USER_BODY.details.actionJoint = new Joint(ARM_BODY, SWING_BODY, { type: "distance", dampingRatio: 1, frequencyHz: 30, bodyA_Anchor: { x: 0, y: 0 } });
		USER_BODY.details.itemJoint = new Joint(SWING_BODY, ITEM_BODY, { type: "weld", x: 0, y: 0 });
	}
	var setBodyDependentOffset = function (offsetBody, dependentBody, targetBody, multiplier) {
		var rot = USER_BODY.details.rotation;
		var off;

		if (multiplier > 1)
			return "Multiplier must be < 1";

		if (rot == "N" || rot == "S")
			off = {
				x: offset(offsetBody.details.startOffsets.x, offsetBody.details.startOffsets.y)[rot].x,
				y: offsetBody.details.startOffsets.y - ((targetBody.getPos().y - dependentBody.getPos().y) * multiplier)
			};
		else
			off = {
				x: -(offsetBody.details.startOffsets.y - ((targetBody.getPos().x - dependentBody.getPos().x) * multiplier)),
				y: offset(-offsetBody.details.startOffsets.x, offsetBody.details.startOffsets.y)[rot].y,
			};

		offsetBody.details.offsets = offset(off.x, off.y)[rot];
	}
	var deleteJoints = function (arm) {
		if (USER_BODY.details.shoulderJoint)
			box.world.DestroyJoint(USER_BODY.details.shoulderJoint);
		if (USER_BODY.details.armJoint)
			box.world.DestroyJoint(USER_BODY.details.armJoint);
		if (USER_BODY.details.actionJoint)
			box.world.DestroyJoint(USER_BODY.details.actionJoint);
		if (USER_BODY.details.itemJoint)
			box.world.DestroyJoint(USER_BODY.details.itemJoint);


		delete USER_BODY.details.shoulderJoint;
		delete USER_BODY.details.armJoint;
		delete USER_BODY.details.actionJoint;
		delete USER_BODY.details.itemJoint;

	}
	var resetRotations = function (resetDetails) {
		var arc = Math.PI / 2;
		var rot = USER_BODY.details.rotation;

		if (!resetDetails.startAngle) {
			if (!resetDetails.reverse)
				rot = rotPlus(rotPlus(rot));
			if (resetDetails.arm == "left")
				rot = rotPlus(rotPlus(rot));
			if (resetDetails.arm == "right" && (rot == "E" || rot == "W"))
				rot = rotPlus(rotPlus(rot));

			resetDetails.startAngle = startAngle[resetDetails.arm][rot];
		}

		SWING_BODY.setAngle(resetDetails.startAngle);
		SWING_BODY.setRotation(0);
		ITEM_BODY.setAngle(resetDetails.startAngle);
		ITEM_BODY.setRotation(0);
	}

	var resetForce = function (resetDetails) {
		USER_BODY.setForce({ x: 0, y: 0 });
		SWING_BODY.setForce({ x: 0, y: 0 });
		ARM_BODY.setForce({ x: 0, y: 0 });
		SHOULDER_BODY.setForce({ x: 0, y: 0 });
		ITEM_BODY.setForce({ x: 0, y: 0 });
	}
	var resetOffsets = function (resetDetails) {
		SHOULDER_BODY.details.offsets = SHOULDER_BODY.details.startOffsets;
		ARM_BODY.details.offsets = ARM_BODY.details.startOffsets;
		ITEM_BODY.details.offsets = ITEM_BODY.details.startOffsets;
	};
	var setStartPositions = function (resetDetails) {
		var rev = reverseArmRotation[resetDetails.arm];

		if (resetDetails.reverse)
			rev *= -1;

		var pos = USER_BODY.getPos();
		var armOffsets;

		if (!resetDetails.reverse)
			armOffsets = offset(REV_ARM_BODY.details.offsets.x, REV_ARM_BODY.details.offsets.y)[resetDetails.rot];
		else
			armOffsets = offset(ARM_BODY.details.offsets.x, ARM_BODY.details.offsets.y)[resetDetails.rot];

		ARM_BODY.setPos({ x: pos.x + armOffsets.x, y: pos.y + armOffsets.y });
		SWING_BODY.setPos({ x: ARM_BODY.getPos().x, y: ARM_BODY.getPos().y });
		ITEM_BODY.setPos({
			x: ARM_BODY.getPos().x + (rev * forwardCalc(ITEM_BODY.details.height/2)[rotMinus(resetDetails.rot)].x),
			y: ARM_BODY.getPos().y + (rev * forwardCalc(ITEM_BODY.details.height/2)[rotMinus(resetDetails.rot)].y)
		});

		SHOULDER_BODY.setCenter({ x: 0, y: 0 });
		SWING_BODY.setCenter({ x: 0, y: 0 });
		ARM_BODY.setCenter({ x: 0, y: 0 });
	}

	var reset = function (resetDetails) {
		if (!resetDetails)
			resetDetails = {};

		resetDetails.rot = USER_BODY.details.rotation;
		var arc = Math.PI / 2;

		setStartPositions(resetDetails);

		resetForce(resetDetails);
		resetRotations(resetDetails);
		resetOffsets(resetDetails);

		if (resetDetails.joints)
			swing_setJoints(resetDetails);
	}
	var rotPlus = function (rot) {
		if (rot == "N")
			return "E";
		if (rot == "E")
			return "S";
		if (rot == "S")
			return "W";
		if (rot == "W")
			return "N";
	}
	var rotMinus = function (rot) {
		if (rot == "N")
			return "W";
		if (rot == "W")
			return "S";
		if (rot == "S")
			return "E";
		if (rot == "E")
			return "N";
	}
	var notArm = function (arm) {
		if (arm == "left")
			return "right";
		else
			return "left";
	}
	var createTrailIncrement = function (cnt) {
		var trail = clone(ITEM_BODY.details);

		trail.x = trail.body.getPos().x;
		trail.y = trail.body.getPos().y;
		trail.density = 0;

		trail.name = ITEM_BODY.details.name + "-trail-" + cnt;
		trail.tags.objectType = "trail";

		if (!ITEM_BODY.trails)
			ITEM_BODY.trails = [];

		var TRAIL_BODY = ITEM_BODY.trails[ITEM_BODY.trails.push(grid_body.init(trail)) - 1].body;

		TRAIL_BODY.setAngle(ITEM_BODY.getAngle());

		//TRAIL_BODY.details.trailJoint = new Joint(TRAIL_BODY, ITEM_BODY, { type: "revolute", dampingRatio: 30, frequencyHz: 1, bodyA_Anchor: { x: 0, y: 0 } });
	}
	var destroyTrail = function () {
		if (!ITEM_BODY.trails)
			return;

		for (var i = 0; i < ITEM_BODY.trails.length; i++) {
			ITEM_BODY.trails[i].body.destroy();
		}
		ITEM_BODY.trails = [];
	}
	var enableSwingCollision = function () {
		SWING_BODY.details.maskBits = SWING_BODY.details.parent.details.maskBits;
	}
	var disableSwingCollision = function () {
		SWING_BODY.details.maskBits = 2;
	}
	//#endregion

	var SWING_BODY;
	var USER_BODY;
	var ARM_BODY;
	var SHOULDER_BODY;
	var REV_ARM_BODY;
	var REV_SHOULDER_BODY;
	var HEAD_BODY;
	var ITEM_BODY;
	var REV_ITEM_BODY;

	return {
		quickForwardArc: function (cnt, body, userBody, prevRet, swingPrivate) {
			var arm = body.details.arm;
			var ret = {};
			var arc = Math.PI / 2;
			var rot = userBody.details.rotation;
			var arcAngle = 1;

			var reverse = false;
			if (swingPrivate) {
				reverse = swingPrivate.reverse;
				arcAngle = -1;
			}



			setGlobals(body, userBody, arm);
			setBusy("main", true);
			enableSwingCollision();

			//console.log(cnt);
			//createTrailIncrement(cnt);
			//console.log(cnt);
			switch (true) {
				case (cnt == 1):
					reset({ arm: notArm(arm), reverse: reverse, joints: true });
					reset({ arm: arm, reverse: reverse, joints: true });
				case (cnt < 5):

					swing_forwardForce(-450);
					swing_arcForce(arcAngle * -200);
					swing_rotate(arcAngle * -3.5);
					break;
				case (cnt < 14):
					USER_BODY.addForce(forward[rot], -2000);

					swing_rotate(arcAngle * 3);
					swing_forwardForce(510);
					break;
				case (cnt < 18):
					USER_BODY.addForce(forward[rot], 10000);

					swing_forwardForce(-300);
					swing_arcForce(arcAngle * 1025);
					swing_rotate(arcAngle * 1);
					break;
				case (cnt < 22):
					swing_forwardForce(-220);
					swing_arcForce(arcAngle * -250);
					swing_rotate(arcAngle * .6);
					break;
				case (cnt < 26):
					swing_forwardForce(-100);
					swing_arcForce(arcAngle * -260);
					swing_rotate(arcAngle * -4.5);
					break;
				case (cnt < 50):
					swing_rotate(0);
					ret.linkable = true;
					break;
				case (cnt == "Link"):
					ret.bypassReset = true;
					setBusy("main", false);
					destroyTrail();
					disableSwingCollision();
					return false;
					break;
				default: //Ended without link
					ret.linkable = true;
					setBusy("main", false);
					reset({ arm: arm, joints: false });
					disableSwingCollision();
					deleteJoints();
					destroyTrail();
					//terminate
					return false;
					break;
			}

			ret.SWING_BODY = SWING_BODY;
			ret.USER_BODY = USER_BODY;
			ret.ARM_BODY = ARM_BODY;
			ret.SHOULDER_BODY = SHOULDER_BODY;
			ret.HEAD_BODY = HEAD_BODY;
			return ret;
		},
		quickForwardArcReverse: function (cnt, body, userBody, prevRet, swingPrivate) {
			return this[0](cnt, body, userBody, prevRet, { reverse: true });
		},
	}


});