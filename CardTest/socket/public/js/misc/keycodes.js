

var mouseLeftClickEvents = [];
var mouseMiddleClickEvents = [];
var mouseRightClickEvents = [];
var mouse = {};
var key = [];


app.service('key', function ($rootScope, card_body) {

	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	if (document.addEventListener) {
		document.addEventListener("mousewheel", MouseWheelHandler, false);
		// Firefox
		document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	}
		// IE 6/7/8
	else document.attachEvent("onmousewheel", MouseWheelHandler);

	function MouseWheelHandler(e) {

		// cross-browser wheel delta
		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

		if (typeof three_draw != "undefined" && three_draw.scroll)
			three_draw.scroll(delta);
	}

	$(document).bind('contextmenu', function () { return false });

	function GetBodyAtMouse(includeStatic) {
		if (!box)
			return;

		var widthScaling = $('#' + box.context.canvas.id).width() / box.context.canvas.width;
		var heightScaling = $('#' + box.context.canvas.id).height() / box.context.canvas.height;
		var mouse_p = new b2Vec2(parseInt(mouse.x / widthScaling), parseInt(mouse.y / heightScaling));

		var aabb = new b2AABB();
		aabb.lowerBound.Set(mouse_p.x - 0.001, mouse_p.y - 0.001);
		aabb.upperBound.Set(mouse_p.x + 0.001, mouse_p.y + 0.001);

		var bodies = [];

		// Query the world for overlapping shapes.
		function GetBodyCallback(fixture) {
			var shape = fixture.GetShape();
			if (fixture.GetBody().GetType() != b2Body.b2_staticBody || includeStatic) {
				var inside = shape.TestPoint(fixture.GetBody().GetTransform(), mouse_p);

				if (inside) {
					bodies.push(fixture.GetBody());
					return true;
				}
			}
			return true;
		}

		box.world.QueryAABB(GetBodyCallback, aabb);
		return bodies;
	}


	$(document).mousedown(function (event) {
		var activatedBodies = GetBodyAtMouse(false);

		for (var j = 0; activatedBodies && j < activatedBodies.length; j++) {
			var activatedBody = activatedBodies[j];
			if (activatedBody && activatedBody.m_userData.details.clickFunction) {
				for (var i = 0; i < activatedBody.m_userData.details.clickFunction.length; i++) {
					activatedBody.m_userData.details.clickFunction[i](activatedBody.m_userData.details);
				}
			}
		}

		switch (event.which) {
			case 1:
				//('Left mouse button pressed');
				for (var i = 0; i < mouseLeftClickEvents.length; i++) {
					if (isFunction(mouseLeftClickEvents[i].func))
						mouseLeftClickEvents[i].func(mouseLeftClickEvents[i].param);
				}
				break;
			case 2:
				//('Middle mouse button pressed');
				for (var i = 0; i < mouseMiddleClickEvents.length; i++) {
					if (isFunction(mouseMiddleClickEvents[i].func))
						mouseMiddleClickEvents[i].func(mouseMiddleClickEvents[i].param);
				}
				break;
			case 3:
				//('Right mouse button pressed');
				for (var i = 0; i < mouseRightClickEvents.length; i++) {
					if (isFunction(mouseRightClickEvents[i].func))
						mouseRightClickEvents[i].func(mouseRightClickEvents[i].param);
				}
				break;
			default:
				//('You have a strange mouse');
		}
	});


	lockDefaultKeys = false;
	
	$(window).mousemove(function (event) {
		var activatedBodies = GetBodyAtMouse(false);
		
		for (var j = 0; activatedBodies && j < activatedBodies.length; j++) {
			var activatedBody = activatedBodies[j];

			if (activatedBody.m_userData.details.hoverFunction) {
				for (var i = 0; i < activatedBody.m_userData.details.hoverFunction.length; i++) {
					activatedBody.m_userData.details.hoverFunction[i](activatedBody.m_userData.details);
				}
			}
		}

		mouse.x = event.pageX;
		mouse.y = event.pageY;
	});


	document.onkeydown = setKey;
	document.onkeyup = dropKey;


	$(window).resize(function () {
		if (typeof three_draw != "undefined" && three_draw.resize)
			three_draw.resize();
	});


	function setKey(e) {
		e = e || window.event;

		if (lockDefaultKeys)
			e.preventDefault();

		key[e.keyCode] = true;

		//non-generic checkers needed here - todo make into injections
		if (typeof gridActionDefinitions != "undefined" && gridActionDefinitions.keyPress)
			gridActionDefinitions.keyPress(e.keyCode);
		if (typeof engagedActionDefinitions != "undefined" && engagedActionDefinitions.keyPress)
			engagedActionDefinitions.keyPress(e.keyCode);
	}
	function dropKey(e) {
		e = e || window.event;
		key[e.keyCode] = false;
	}


});

var keycode_backspace = 8;
var keycode_tab = 9;
var keycode_enter = 13;
var keycode_shift = 16;
var keycode_ctrl = 17;
var keycode_alt = 18;
var keycode_pause = 19;
var keycode_capsLock = 20;
var keycode_escape = 27;
var keycode_space = 32;
var keycode_pageUp = 33;
var keycode_pageDown = 34;
var keycode_end = 35;
var keycode_home = 36;
var keycode_left = 37;
var keycode_up = 38;
var keycode_right = 39;
var keycode_down = 40;
var keycode_insert = 45;
var keycode_delete = 46;
var keycode_0 = 48;
var keycode_1 = 49;
var keycode_2 = 50;
var keycode_3 = 51;
var keycode_4 = 52;
var keycode_5 = 53;
var keycode_6 = 54;
var keycode_7 = 55;
var keycode_8 = 56;
var keycode_9 = 57;
var keycode_a = 65;
var keycode_b = 66;
var keycode_c = 67;
var keycode_d = 68;
var keycode_e = 69;
var keycode_f = 70;
var keycode_g = 71;
var keycode_h = 72;
var keycode_i = 73;
var keycode_j = 74;
var keycode_k = 75;
var keycode_l = 76;
var keycode_m = 77;
var keycode_n = 78;
var keycode_o = 79;
var keycode_p = 80;
var keycode_q = 81;
var keycode_r = 82;
var keycode_s = 83;
var keycode_t = 84;
var keycode_u = 85;
var keycode_v = 86;
var keycode_w = 87;
var keycode_x = 88;
var keycode_y = 89;
var keycode_z = 90;
var keycode_leftWindow = 91;
var keycode_rightWindow = 92;
var keycode_select = 93;
var keycode_numpad0 = 96;
var keycode_numpad1 = 97;
var keycode_numpad2 = 98;
var keycode_numpad3 = 99;
var keycode_numpad4 = 100;
var keycode_numpad5 = 101;
var keycode_numpad6 = 102;
var keycode_numpad7 = 103;
var keycode_numpad8 = 104;
var keycode_numpad9 = 105;
var keycode_multiply = 106;
var keycode_add = 107;
var keycode_subtract = 109;
var keycode_decimalPoint = 110;
var keycode_divide = 111;
var keycode_f1 = 112;
var keycode_f2 = 113;
var keycode_f3 = 114;
var keycode_f4 = 115;
var keycode_f5 = 116;
var keycode_f6 = 117;
var keycode_f7 = 118;
var keycode_f8 = 119;
var keycode_f9 = 120;
var keycode_f10 = 121;
var keycode_f11 = 122;
var keycode_f12 = 123;
var keycode_numLock = 144;
var keycode_scrollLock = 145;
var keycode_semiColon = 186;
var keycode_equals = 187;
var keycode_comma = 188;
var keycode_dash = 189;
var keycode_period = 190;
var keycode_forwardSlash = 191;
var keycode_grave = 192;
var keycode_openBracket = 219;
var keycode_backSlash = 220;
var keycode_closeBraket = 221;
var keycode_singleQuote = 222;