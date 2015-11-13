
var normalSpeed = 15;
var currentSpeed = normalSpeed;

var images = [];
var TIMER = new Date().getTime();

//shift frames faster if client lags
var standardizeFrameCorrection = false;

//replace with webgl-utils after 2d back in TODO
window.requestAnimFrame = function (callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function (callback) {
		window.setTimeout(callback, 300);
	};
}();

window.requestUpdateFrame = (function (callback) {
	return function (callback) {
		var actualSpeed = currentSpeed;

		if (standardizeFrameCorrection) {
			var frameTime = new Date().getTime();

			TIMER += currentSpeed;

			while (frameTime - TIMER > 0 && actualSpeed > 1) {
				TIMER++;
				actualSpeed--;
			}

			if (actualSpeed == 1)
				console.log("frames lagging: " + (frameTime - TIMER))
		}

		window.setTimeout(callback, actualSpeed);
	};
})();

function addIconImage(canvas, x, y, w, h, clipx, clipy, image, moving, scale, flip) {
	var i = {};
	i.canvas = canvas;
	i.category = "static";
	i.width = w;
	i.height = h;
	i.x = x;
	i.y = y;
	i.clipx = clipx;
	i.clipy = clipy;
	i.moving = moving;
	i.scale = scale;
	i.flip = flip;
	i.moveSpeed = (Math.random() - .5) / 10;
	i.texturePath = 'images/icons/' + image + '.png'
	images.push(i);
	return images.length - 1;

}

function addStaticImage(canvas, x, y, w, h, clipx, clipy, image, moving, scale, flip, centerPoint) {
	var i = {};
	i.canvas = canvas;
	i.category = "static";
	i.width = w;
	i.height = h;

	if (centerPoint) {
		i.x = x;
		i.y = 100 - y - (h / 2);
	}
	else {
		i.x = x + (h / 2);
		i.y = y + (w / 2);
	}
	i.clipx = clipx;
	i.clipy = clipy;
	i.moving = moving;
	i.scale = scale;
	i.flip = flip;
	i.moveSpeed = (Math.random() - .5) / 10;
	i.texturePath = 'images/sprites/' + image + '.png'
	images.push(i);
	return images.length - 1;

}

function addActionImage(canvas, x, y, w, h, clipx, clipy, image, moving, scale, flip, centerPoint) {
	var i = {};
	i.canvas = canvas;
	i.category = "action";
	i.width = w;
	i.height = h;

	if (centerPoint) {
		i.x = x;
		i.y = 100 - y - (h / 2);
	}
	else {
		i.x = x + (h / 2);
		i.y = y + (w / 2);
	}
	i.clipx = clipx;
	i.clipy = clipy;
	i.moving = moving;
	i.scale = scale;
	i.flip = flip;
	i.moveSpeed = (Math.random() - .5) / 10;
	i.texturePath = 'images/sprites/' + image + '.png'
	images.push(i);
	return images.length - 1;

}

function addPlayerAnimationState(animationName, index, width, height, texturePath, frameStart, frameEnd, playReverse, framesPerRow, animationSpeed, condtionsMet, scale, flip) {
	for (a in images[index].animations) {
		anim = images[index].animations[a];
		anim.enabled = false;
	}
	images[index].animations[animationName] =
	{
		texturePath: texturePath,
		frameStart: frameStart,
		frameEnd: frameEnd,
		playReverse: playReverse,
		isReversing: false,
		currentFrame: 0,
		framesPerRow: framesPerRow,
		animationSpeed: animationSpeed,
		condtionsMet: condtionsMet,
		width: width,
		height: height,
		scale: scale,
		flip: flip,
		enabled: true
	}

}

function addPlayerImage() {
	var i = {};
	i.canvas = 'center';
	i.name = "theMan";
	i.category = "player";
	i.animations = {};
	images.push(i);
	return images.length - 1;
}

function startAnimation(index, animation) {
	var anim = images[index].animations[animation];



	if (!anim.playReverse) {
		anim.currentFrame++;
		if (anim.currentFrame >= anim.frameEnd)
			anim.currentFrame = anim.frameStart;
	}
	else {
		if (!anim.isReversing) {
			anim.currentFrame++;
			if (anim.currentFrame > anim.frameEnd) {
				anim.isReversing = true;
			}
		}
		else {
			anim.currentFrame--;
			if (anim.currentFrame <= 0) {
				anim.isReversing = false;
			}
		}
	}

	anim.clipx = anim.currentFrame % anim.framesPerRow * anim.width;
	anim.clipy = Math.floor(anim.currentFrame / anim.framesPerRow) * anim.height;

	images[index].animations[animation] = anim;

	if (anim.enabled)
		window.setTimeout(function () { startAnimation(index, animation); }, anim.animationSpeed);
}


function stopAnimation(index) {
	for (a in images[index].animations) {
		anim = images[index].animations[a];
		anim.enabled = false;
	}
}