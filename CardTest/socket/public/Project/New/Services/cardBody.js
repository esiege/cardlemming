'use strict';

var updateCalls = [];

app.service('card_body', function () {

	this.init = function (dets) {
		this.details = {
			shape: "block",
			activity: "idle",
			name: "unnamed",
            color: "red",
			height: 30,
			width: 30,
			radius: 5,
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			density: 1,
			rotation: 'N',
			fixedRotation: true,
			doubleHeight: false,
			controllable: false,
			visible: true,
			groupIndex: 1,
			layer: 0,
			update: function () { },
			destroyEvent: function (body) { gl_destroy(body) },
			bindBody: [],
			actionChain: [],
			tags: {},
			targetPos: {},
			gridPos: { x: 0, y: 0 },
			arrived: { x: true, y: true },
			stats: {},
			forward: function (val) {

				if (!val)
					val = 1;

				var forwardVal = {
					N: { x: 0, y: -val },
					E: { x: val, y: 0 },
					S: { x: 0, y: val },
					W: { x: -val, y: 0 }
				}
				return forwardVal[this.rotation];
			}
		}

		for (var det in dets)
			this.details[det] = dets[det];

		if (this.details.offsets)
			this.details.startOffsets = this.details.offsets;

		this.body = new Body(this.details);
		this.details.body = this.body;

		if (!this.details.getUserRotVars)
			this.details.getUserRotVars = function () {

				var rot;
				if (!this.parent)
					rot = this.rotation;
				else
					rot = this.parent.body.details.rotation;

				if (this.offsets)
					switch (rot) {
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

				switch (rot) {
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
			};

		if (this.details.update)
			updateCalls.push(
				{
					update: this.details.update,
					body: this.body
				});

		return this.details;

	}

});