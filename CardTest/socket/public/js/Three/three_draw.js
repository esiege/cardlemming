
'use strict';


var sendBodyWarning = false;
var sendBodyToDraw = function () { if (!sendBodyWarning) { sendBodyWarning = true; console.log("no sendBodyToDraw function found"); } };

var gl_drawWarning = false;
var gl_destroyWarning = false;
var gl_draw = function () { if (!gl_drawWarning) { gl_drawWarning = true; console.log("no gl_draw function found"); } };
var gl_destroy = function () { if (!gl_destroyWarning) { gl_destroyWarning = true; console.log("no gl_destroy function found"); } };


app.service('three_draw', function ($timeout, key, canvasService)
{
	var loader = new THREE.JSONLoader(), scene, camera, renderer, widthUnit, heightUnit, bodyList = {}, cursorPosition = {}, sceneLoaded = false;

	var checkDrawBody = function (body, shape)
	{
		return !(!sceneLoaded || !body || !body.body || !shape || body.details.hidden || (!!body.details.tags && !!body.details.tags.objectType && body.details.tags.objectType == 'action'))
	}

	sendBodyToDraw = function (body)
	{
		if (!checkDrawBody(body, true))
			return;

		if (!bodyList[body.details.name])
		{
			bodyList[body.details.name] = {};
			bodyList[body.details.name].body = body;

			if (bodyList[body.details.name].body.details.objPath)
				setup3dObject(bodyList[body.details.name]);
			else if (bodyList[body.details.name].body.details.image || bodyList[body.details.name].body.details.color)
				setupImage(bodyList[body.details.name]);
		}
		updateMesh(bodyList[body.details.name], bodyList[body.details.name].mesh, .75);
	}
	var setup3dObject = function (body)
	{

		loader.load(body.objPath, function (geometry)
		{

			if (body.texturePath)
				var material = new THREE.MeshLambertMaterial({
					map: THREE.ImageUtils.loadTexture(body.texturePath),  // specify and load the texture
					colorAmbient: [0.480000026226044, 0.480000026226044, 0.480000026226044],
					colorDiffuse: [0.480000026226044, 0.480000026226044, 0.480000026226044],
					colorSpecular: [0.8999999761581421, 0.8999999761581421, 0.8999999761581421]
				});
			else if (true)
				var material = new THREE.MeshPhongMaterial({
					color: "red"
				});

			// create a mesh with models geometry and material
			var mesh = new THREE.Mesh(
				geometry,
				material
			);

			mesh.rotation.y = -Math.PI / 5;

			scene.add(mesh);
		});
	}
	gl_destroy = function (body)
	{
		if (checkDrawBody(body.m_userData, true) && bodyList[body.m_userData.details.name].shape)
		{
			bodyList[body.m_userData.details.name].shape.dispose();

			delete bodyList[body.m_userData.details.name];
		}
	}
	var getPixelColor = function (body, x, y)
	{
		if (!body.canvas)
		{
			body.canvas = $('<canvas />')[0];
			body.canvas.width = body.image.width;
			body.canvas.height = body.image.height;
			body.canvas.getContext('2d').drawImage(body.image, 0, 0, body.image.width, body.image.height);
		}

		return body.canvas.getContext('2d').getImageData(x, y, 1, 1).data;
	}
	var addParticlesFromPixels = function (body)
	{

		var centralPosition = { x: 0, y: 0, z: 0 };
		var w, h;

		if (body.image)
		{
			w = body.image.width;
			h = body.image.height;
		} else
		{
			w = body.body.details.width;
			h = body.body.details.height;
		}

		centralPosition.x -= w / 4;
		centralPosition.y -= h / 4;


		var particles = w * h;
		var geometry = new THREE.BufferGeometry();

		var positions = new Float32Array(particles * 3);
		var colors = new Float32Array(particles * 3);

		var color = new THREE.Color();

		var i = 0;
		for (var x = 0; x < w; x++)
		{
			for (var y = 0; y < h; y++)
			{


				var r, g, b, a;
				if (body.image)
				{
					var imagePixelColor = getPixelColor(body, x, y);
					r = imagePixelColor[0] / 255;
					g = imagePixelColor[1] / 255;
					b = imagePixelColor[2] / 255;
					a = imagePixelColor[3] / 255;
				}
				else if (body.body.details.color.r)
				{
					r = body.body.details.color.r / 255;
					g = body.body.details.color.g / 255;
					b = body.body.details.color.b / 255;
					a = body.body.details.color.a ? body.body.details.color.a / 255 : 1;
				} else
				{
					console.warn('Body needs rgb(r,g,b,a) || image path to render.');
				}

				if (a != 0)
				{
					positions[i] = x + centralPosition.x;
					positions[i + 1] = y + centralPosition.y;
					positions[i + 2] = 0;

					console.log("x:" + x, "y:" + y, "r:" + r, "g:" + g, "b:" + b);

					color.setRGB(r, g, b);

					colors[i] = r;
					colors[i + 1] = g;
					colors[i + 2] = b;


				}
				i += 3;

			}
		}

		geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

		geometry.computeBoundingBox();

		var material = new THREE.PointCloudMaterial({ size: 3.2, vertexColors: THREE.VertexColors });

		var particleSystem = new THREE.PointCloud(geometry, material);
		body.mesh = particleSystem;
		scene.add(particleSystem);

	};
	var addCubesFromPixels = function (body)
	{

		var centralPosition = { x: 0, y: 0, z: 0 };
		var color = new THREE.Color();
		var w, h;

		if (body.image)
		{
			w = body.image.width;
			h = body.image.height;
		} else
		{
			w = body.body.details.width;
			h = body.body.details.height;
		}
		centralPosition.x -= w / 2;
		centralPosition.y -= h / 2;


		var i = 0;
		for (var x = 1; x <= w; x++)
		{
			for (var y = 1; y <= h; y++)
			{

				var r, g, b, a;
				if (body.image)
				{
					var imagePixelColor = getPixelColor(body, x, y);
					r = imagePixelColor[0] / 255;
					g = imagePixelColor[1] / 255;
					b = imagePixelColor[2] / 255;
					a = imagePixelColor[3] / 255;
				}
				else if (body.body.details.color.r)
				{
					r = body.body.details.color.r / 255;
					g = body.body.details.color.g / 255;
					b = body.body.details.color.b / 255;
					a = body.body.details.color.a ? body.body.details.color.a / 255 : 1;
				} else
				{
					console.warn('Body needs rgb(r,g,b,a) || image path to render.');
				}

				if (a != 0)
				{
					var localX = x + centralPosition.x;
					var localY = -y + centralPosition.y;
					var localZ = -(r + b + g);

					console.log("x:" + x, "y:" + y, "r:" + r, "g:" + g, "b:" + b);

					color.setRGB(r, g, b);

					var boxGeometry = new THREE.BoxGeometry(.9, .9, .9);


					var geometry = new THREE.Geometry();
					geometry.merge(boxGeometry);


					for (var j = 0; j < geometry.vertices.length; j++)
					{
						geometry.vertices[j].x += localX;
						geometry.vertices[j].y += localY;
					}

					if (!body.geometry)
						body.geometry = geometry;
					else
					{
						body.geometry.merge(geometry);
					}
				}
				i += 3;

			}
		}
		var material = new THREE.MeshPhongMaterial({ color: color });
		body.mesh = new THREE.Mesh(body.geometry, material);
		scene.add(body.mesh);

	};
	var addImagePlane = function (body)
	{

		var imagePath = body.body.details.image;
		var loadedImage = body.image;

		if (imagePath && loadedImage)
		{
			body.shape = new THREE.PlaneGeometry((loadedImage.width / 2) * body.body.details.scale, (loadedImage.height / 2) * body.body.details.scale);
			body.texture = THREE.ImageUtils.loadTexture(imagePath);
			body.texture.magFilter = THREE.NearestFilter;
			body.texture.minFilter = THREE.LinearMipMapLinearFilter;
			body.material = new THREE.MeshPhongMaterial({ map: body.texture, transparent: true, alphaTest: 0.5 });
		} else
		{
			body.shape = new THREE.PlaneGeometry(body.body.details.width / 8, body.body.details.height / 8);
			body.material = new THREE.MeshPhongMaterial({ color: body.body.details.color, transparent: true, alphaTest: 0.5 });
		}

		body.mesh = new THREE.Mesh(body.shape.clone(), body.material);
		body.mesh.name = body.body.details.name;
		scene.add(body.mesh);
	}
	var addColorPlane = function (body)
	{
		body.material = new THREE.MeshPhongMaterial({ color: body.body.details.color });
		body.shape = new THREE.PlaneGeometry((body.body.details.width / 8), (body.body.details.height / 8));
		body.mesh = new THREE.Mesh(body.shape.clone(), body.material);
		body.mesh.name = body.body.details.name;
		scene.add(body.mesh);
	}
	var testRender = function (body)
	{
		var geometry = new THREE.Geometry();

		// Make the simplest shape possible: a triangle.
		geometry.vertices.push(
				new THREE.Vector3(-1, 1, 0),
				new THREE.Vector3(-1, -1, 0),
				new THREE.Vector3(1, -1, 0)
		);

		// Note that I'm assigning the face to a variable
		// I'm not just shoving it into the geometry.
		var face = new THREE.Face3(0, 1, 2);

		// Assign the colors to the vertices of the face.
		face.vertexColors[0] = new THREE.Color(0xff0000); // red
		face.vertexColors[1] = new THREE.Color(0x00ff00); // green
		face.vertexColors[2] = new THREE.Color(0x0000ff); // blue

		// Now the face gets added to the geometry.
		geometry.faces.push(face);

		// Using this material is important.
		var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });

		var mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
	}
	var setupImage = function (body, callback)
	{
		body.image = body.body.details.img;

		if (body.image)
			addImagePlane(body);
		else
			addColorPlane(body);

		body.body.details.mesh = body.mesh;
		console.log(body.body.details.name + ":");
		console.log(body);
	}
	var updateMesh = function (bodyRef, mesh)
	{


		if (!mesh && bodyRef.meshList)
		{
			for (var i = 0; i < bodyRef.meshList.length; i++)
			{
				updateMesh(bodyRef, bodyRef.meshList[i]);
			}
		}


		if (!checkDrawBody(bodyRef.body, mesh))
			return;



		if (bodyRef.body.details.staticBody)
			bodyRef.body.details.staticUpdated = true;

		var posX = bodyRef.body.body.m_xf.position.x / 8.7;
		var posY = -bodyRef.body.body.m_xf.position.y / 8.7;
		var posZ = bodyRef.body.details.z || 0;
		if (bodyRef.body.details.layer)
			posZ = -bodyRef.body.details.layer * .2;

		mesh.position.x = posX;
		mesh.position.y = posY;
		mesh.position.z = posZ;

		if (mesh.localPositionValues)
		{
			mesh.position.x += mesh.localPositionValues.x;
			mesh.position.y += mesh.localPositionValues.y;
			mesh.position.z += mesh.localPositionValues.z;
		}

	}
	return {
		scene: scene,
		camera: camera,
		renderer: renderer,
		init: function () {
			var c = canvasService.getCanvas();
			if (c.initialDetails.canvType != "webgl")
			{
				console.warn("WebGL attempted initiation without a 'webgl' type canvas.");
				return;
			}

			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(45, c.context.canvas.width / c.context.canvas.height, 1, 9999999999);
			renderer = new THREE.WebGLRenderer({ canvas: c.context.canvas, alpha: true, antialias: false });
			renderer.sortObjects = false;

			widthUnit = c.context.canvas.width * 0.0575;
			heightUnit = -c.context.canvas.height * 0.0575;

			//camera
			camera.position.x = widthUnit;
			camera.position.y = heightUnit;
			camera.position.z = 150;

			var light = new THREE.PointLight(0xffffff, .9, 0);
			light.position.set(5, 5, 50);
			scene.add(light);

			var geometry = new THREE.BoxGeometry(1, 1, 1);
			var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
			cursorPosition = new THREE.Mesh(geometry, material);
			scene.add(cursorPosition);

			var render = function ()
			{
				var m = canvasService.getAdjustedMouse();
				cursorPosition.position.set(m.x / 8.7, -m.y / 8.7, 0);
				light.position.set(m.x / 8.7, -m.y / 8.7, 50);
				
				requestAnimationFrame(render);
				renderer.render(scene, camera);
			};

			sceneLoaded = true;
			render();

		},
		resize: function ()
		{
			renderer.setSize(window.innerWidth, window.innerHeight);
			//if (canvType != "webgl")
			//    return;

			//camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.2, 1000);
			//camera.position.z = 900;
			//camera.position.y = -900;
			//camera.rotation.x = .85;
			//renderer = new THREE.WebGLRenderer({ canvas: canvas.get(0) });
			//renderer.setSize(window.innerWidth, window.innerHeight);
		},
		scroll: function (val)
		{
			if (canvType != "webgl")
				return;

			camera.position.z -= 20 * val;;
			camera.position.y += 14 * val;;
			//camera.rotation.x += .01 * val;
		}
	}

});