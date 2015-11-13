'use strict';

app.service('canvasService', function ()
{
	var canvas = {};
	var mouse = {};

	function getMousePos(canvas, evt)
	{
		var rect = canvas.element.getBoundingClientRect();
		mouse = {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
		return mouse;
	}
	return {
		getCanvas: function() {
			return canvas;
		},
		getMouse: function() {
			return mouse;
		},
		getAdjustedMouse: function () {
			if (!mouse.x)
				return { x: 0, y: 0 };

			return {
				x: (mouse.x / canvas.element.clientHeight) * canvas.element.height,
				y: (mouse.y / canvas.element.clientWidth) * canvas.element.width
			}
		},
		init: function (dets)
		{
			canvas = initBox(dets);
			canvas.element.addEventListener('mousemove', function (evt){getMousePos(canvas, evt);}, false);
			return canvas;
		}
	}

});