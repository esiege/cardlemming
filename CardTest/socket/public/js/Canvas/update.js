
//window.setInterval( function () { update( canvas, context ); }, 1/600 );


var stepSyncDifference = 0;
var updateFunctions = [];


function beginUpdate(rootScope) {

	var background = new Image();
	var refresh = true;
	var darknessLevel = 1;

	//requires texturePath
	if (images.length > 0)
		loadImages(0);

	update(rootScope);

}

var update_steps = 0;
var runProcAtStep = [];

var addUpdate = function (func, completeCallback) {
	var i = runProcAtStep.push({}) - 1;
	runProcAtStep[i].intervals = 0;
	runProcAtStep[i].func = func; -z7m
	runProcAtStep[i].step = update_steps;
	runProcAtStep[i].completeCallback = completeCallback;
	return i;
};


function update(rootScope) {


	if (!canvasInit) {
		return;
	}
	if (hitTimer && hitTimer > 0)
		hitTimer--;

	for (var i in destroy_list) {
		box.world.DestroyBody(destroy_list[i]);
		destroy_list[i] = null;
	}
	destroy_list = [];

	//if ( images.length > 0 )
	//    updateImages();


	for (var i = 0; i < updateCalls.length; i++) {
		updateCalls[i].update(updateCalls[i].body, update_steps);
	}

	box.step(rootScope, function () {
		requestUpdateFrame(function () {
			update(rootScope);


			for (var j = 0; j < updateFunctions.length; j++) {
				var func = updateFunctions.splice(0, 1)[0];

				if (func.execute)
					func.execute(func.param1, func.param2);
			}

		});
	});
	//box.debug();

	gl_draw();

	update_steps += 1;


};

function updateImages() {
	centerContext.clearRect(0, 0, centerCanvas.width, centerCanvas.height);
	for (var index = 0; index < images.length; index++) {
		drawImage(index);
	}
	for (var index = 0; index < activeActionList.length; index++) {
		drawAction(index);
	}
}

function drawAction(index) {
	if (activeActionList[index].TLoaded)
		drawImageToCanvas('center', activeActionList[index].textureImg, activeActionList[index].position.x, activeActionList[index].position.y, 0, activeActionList[index].image.width, activeActionList[index].image.height, activeActionList[index].clipx, activeActionList[index].clipy, activeActionList[index].scale, activeActionList[index].flip);
	else if (!activeActionList[index].loading) {
		activeActionList[index].loading = true;
		activeActionList[index].textureImg = loadImage(activeActionList[index].texturePath, function () {
			activeActionList[index].TLoaded = true;
		});
	}


	//if ( images[index].category == 'player' )
	//{
	//    for ( a in images[index].animations )
	//    {
	//        anim = images[index].animations[a];
	//        if ( anim.enabled && anim.TLoaded && anim.condtionsMet() )
	//            drawImageToCanvas( images[index].canvas, anim.textureImg, player.x, player.y, 0, anim.width, anim.height, anim.clipx, anim.clipy, anim.scale, anim.flip );
	//    }
	//}
}

function drawImage(index) {
	if (images[index].category == 'static') {
		if (images[index].moving) {
			images[index].x += images[index].moveSpeed;
		}

		if (images[index].TLoaded)
			drawImageToCanvas(images[index].canvas, images[index].static_textureImg, images[index].x, images[index].y, 0, images[index].width, images[index].height, images[index].clipx, images[index].clipy, images[index].scale, images[index].flip);
	}



	if (images[index].category == 'player') {
		for (a in images[index].animations) {
			anim = images[index].animations[a];
			if (anim.enabled && anim.TLoaded && anim.condtionsMet())
				drawImageToCanvas(images[index].canvas, anim.textureImg, player.x, player.y, 0, anim.width, anim.height, anim.clipx, anim.clipy, anim.scale, anim.flip);
		}
	}
}

function loadImages(index) {
	if (images[index].category == 'static') {
		images[index].static_textureImg = loadImage(images[index].texturePath, function () {
			images[index].TLoaded = true;
		});
	}


	for (a in images[index].animations) {
		anim = images[index].animations[a];
		anim.textureImg = loadImage(anim.texturePath, function () {
			anim.TLoaded = true;
		});
	}


	if (index < images.length - 1) {
		loadImages(index + 1);
	}
}

function drawImageToCanvas(canvas, img, x, y, r, w, h, clipx, clipy, scale, flip) {
	var context;
	if (canvas == 'center')
		context = centerContext;

	context.save();
	context.translate(x, y);

	if (r > 0)
		context.rotate(Math.PI / 180 * (r - 90));

	if (flip) {
		context.translate(w, 0);
		context.scale(-1, 1);
	}


	context.scale(scale, scale);

	context.drawImage(img, clipx, clipy, w, h, -h / 2, -w / 2, w, h);
	context.restore(); //restore the state of canvas
}
function loadImage(src, callback) {
	var img = document.createElement('img');
	img.onload = callback;
	img.src = src;
	return img;
}



function clamp(x, min, max) {
	if (x < min) return min;
	if (x > max) return max - 1;
	return x;
}
