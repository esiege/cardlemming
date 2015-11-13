'use strict';

var updateCalls = [];

app.service('card_body', function (canvasService) {

	var active = [];

	this.init = function (dets) {
		var details = {
			shape: "block",
			activity: "idle",
			name: "unnamed" + active.length,
			color: 'rgb(250,250,250)',
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
			canvas: dets.canvas,
			clickFunction: dets.clickFunction || [],
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
			details[det] = dets[det];

		if (details.offsets)
			details.startOffsets = details.offsets;

		if (details.image) {
			loadImage(details, function (img, details) {
				details.img = img;

				if (!details.scale)
					details.scale = 1;

				if (!dets.width)
					details.width = img.width * 4 * details.scale;
				if (!dets.height)
					details.height = img.height * 4 * details.scale;

				createBody(details);
				return details;
			}, {});
		} else {
			createBody(details);
			return details;
		}
	}

	var createBody = function (details) {
		var body = new Body(details);
		details.body = body;
		active.push(body);

		if (details.update)
			updateCalls.push({
				update: details.update,
				body: body
			});
	}

	var loadImage = function (details, callback, passthrough) {
		var img = new Image();

		var imageSrc;

		if (!passthrough.cnt)
			imageSrc = details.image;
		else
			imageSrc = details.image.substring(0, details.image.length - 4) + "_" + passthrough.cnt + details.image.substring(details.image.length - 4, details.image.length);

		$(img)
			.load(function () { callback(this, details, passthrough); })
			.attr({ src: imageSrc })
			.error(function () { console.log(imageSrc + " not found."); });
	}
});