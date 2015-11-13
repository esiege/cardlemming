
'use strict';


var sendBodyWarning = false;
var sendBodyToDraw = function () { if (!sendBodyWarning) { sendBodyWarning = true; console.log("no sendBodyToDraw function found"); } };

var gl_drawWarning = false;
var gl_draw = function () { if (!gl_drawWarning) { gl_drawWarning = true; console.log("no gl_draw function found"); } };
var gl_destroy = function () { if (!gl_drawWarning) { gl_drawWarning = true; console.log("no gl_destroy function found"); } };


app.service('three_draw', function (webgl_textures, $timeout) {
    var scene;
    var camera;
    var canvas;
    var renderer;
    var cameraTarget = new THREE.Vector3(0, 0, 0);


    var bodyList = {};
    var sceneLoaded = false;
    var material = {};
    var rot = Math.PI / 2;
    var checkDrawBody = function (body, shape) {
        return !(!sceneLoaded || !body || !body.body || !shape || (body.details.tags && body.details.tags.objectType && body.details.tags.objectType == 'action'))
    }

    gl_destroy = function (body) {
        if (checkDrawBody(body.m_userData, true) && bodyList[body.m_userData.details.name].shape) {
            bodyList[body.m_userData.details.name].shape.dispose();

            delete bodyList[body.m_userData.details.name];
        }
    }


    sendBodyToDraw = function (body) {
        if (!checkDrawBody(body, true))
            return


        if (!bodyList[body.details.name]) {
            bodyList[body.details.name] = {};
            bodyList[body.details.name].body = body;

            if (!body.details.imgData)
                createMeshFromImage(bodyList[body.details.name]);
            else if (body.details.imgData)
                createMeshFromImgData(bodyList[body.details.name]);
        }

        for (var shape in bodyList[body.details.name].shapeList) {
            //.76 smoothing looks nice
            if (!bodyList[body.details.name].body.details.staticUpdated)
                updateShape(bodyList[body.details.name].body, bodyList[body.details.name].shapeList[shape], .3);
        }
    }


    var pushPixel = function (geometry, mod, corners) {
        geometry.vertices.push(
            new THREE.Vector3(mod.x, mod.y, 0)
        );

        if (!corners)
            return;

        if (corners.N)
            geometry.vertices.push(
            new THREE.Vector3(-size + mod.x, size + mod.y, 0),
            new THREE.Vector3(size + mod.x, size + mod.y, 0),
            new THREE.Vector3(size + mod.x, size + mod.y, -size),
            new THREE.Vector3(-size + mod.x, size + mod.y, -size)
            );
        if (corners.S)
            geometry.vertices.push(
            new THREE.Vector3(size + mod.x, -size + mod.y, 0),
            new THREE.Vector3(-size + mod.x, -size + mod.y, 0),
            new THREE.Vector3(-size + mod.x, -size + mod.y, -size),
            new THREE.Vector3(size + mod.x, -size + mod.y, -size)
            );
        if (corners.E)
            geometry.vertices.push(
                new THREE.Vector3(size + mod.x, size + mod.y, 0),
                new THREE.Vector3(size + mod.x, -size + mod.y, 0),
                new THREE.Vector3(size + mod.x, -size + mod.y, -size),
                new THREE.Vector3(size + mod.x, size + mod.y, -size)
            );
        if (corners.W)
            geometry.vertices.push(
                new THREE.Vector3(-size + mod.x, size + mod.y, 0),
                new THREE.Vector3(-size + mod.x, size + mod.y, -size),
                new THREE.Vector3(-size + mod.x, -size + mod.y, -size),
                new THREE.Vector3(-size + mod.x, -size + mod.y, 0)
            );

    };

    var renderImgData = function (body, bodyImageIteration) {
        body.shapeList = {};

        var getMidPos = function (x, y, w, h, a, details) {
            var zpos = 0;

            if (details.nocenter)
                zpos = a / 510;

            return new THREE.Vector3(x - w / 2, y - h / 2, zpos);
        }

        var imageDataPreProcess = [];
        for (var imgDataX = 1; imgDataX <= body.image.width; imgDataX++) {
            for (var imgDataY = 1; imgDataY <= body.image.height; imgDataY++) {
                if (body.imgData[imgDataX][imgDataY].a) {
                    body.imgData[imgDataX][imgDataY].pos = getMidPos(imgDataX, imgDataY, body.image.width, body.image.height, body.imgData[imgDataX][imgDataY].a, body.body.details);
                    imageDataPreProcess.push(body.imgData[imgDataX][imgDataY]);
                }
            }
        }

        var sprite = new PointObject();
        for (var i = 0; i < imageDataPreProcess.length; i++) {
            sprite.geometry.vertices.push(
                new THREE.Vector3(imageDataPreProcess[i].pos.x, imageDataPreProcess[i].pos.y, imageDataPreProcess[i].pos.z)
            );
            delete imageDataPreProcess[i].pos;
            sprite.rgbColors.push(
                imageDataPreProcess[i]
            );
        }

        if (bodyImageIteration)
            bodyList[body.body.details.name].shapeList[bodyImageIteration] = sprite.add()[0];
        else
            bodyList[body.body.details.name].shapeList[body.body.details.name] = sprite.add()[0];
    }

    var createMeshFromImage = function (body) {
        bodyList[body.body.details.name].shapeList = {};


        loadImgdata(body, function (body, bodyImageIteration) {
            renderImgData(body, bodyImageIteration);
        });
    };

    var createMeshFromImgData = function (body) {
        body.imgData = body.body.details.imgData;
        body.image = body.body.details.image;
        renderImgData(body);
    };


    function UrlExists(url, callback) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();


        http.onload = function () {
            callback();
        };
        http.ontimeout = function () {
            console.log('Timeout...');
        };
        http.onerror = function () {
            console.log('There was an error!');
        };

    }

    var loadImage = function (body, callback, passthrough) {
        var img = new Image();

        var imageSrc;

        if (!passthrough.cnt)
            imageSrc = body.body.details.image;
        else
            imageSrc = body.body.details.image.substring(0, body.body.details.image.length - 4) + "_" + passthrough.cnt + body.body.details.image.substring(body.body.details.image.length - 4, body.body.details.image.length);

        //UrlExists( imageSrc, function (){
        $(img).load(function () {
            callback(this, body, passthrough);
        })
        .attr({
            src: imageSrc
        })
        .error(function () {
            console.log(imageSrc + " not found.");
        });

        //} )

    }

    var loadConnectedImgdata = function (body, callback, cnt) {
        loadImage(body, function (image, body, pt) {
            var bodyImageIteration = body.body.details.image.substring(0, body.body.details.image.length - 4) + "_" + pt.cnt + body.body.details.image.substring(body.body.details.image.length - 4, body.body.details.image.length);

            if (!body.connectedImages)
                body.connectedImages = {};

            body.connectedImages[bodyImageIteration] = image;

            var cv = document.createElement("canvas");
            cv.height = body.image.height;
            cv.width = body.image.width;

            var ct = cv.getContext('2d');
            body.connectedImgData = {};

            ct.drawImage(body.connectedImages[bodyImageIteration], 0, 0);

            var imgdata = ct.getImageData(0, 0, body.image.width, body.image.height);

            var d = imgdata.data;
            var p = {}; //[x][y]
            var xInd = 1;
            var yInd = 1;

            //converts imgdata to p[x][y] = {r,g,b,a}
            for (var i = 0; i < d.length; i += 0) {
                if (!p[xInd + ""])
                    p[xInd + ""] = {};
                if (!p[xInd + ""][yInd + ""])
                    p[xInd + ""][yInd + ""] = {};

                p[xInd + ""][yInd + ""].r = d[i];
                i++;
                p[xInd + ""][yInd + ""].g = d[i];
                i++;
                p[xInd + ""][yInd + ""].b = d[i];
                i++;
                p[xInd + ""][yInd + ""].a = d[i];
                i++;

                if (xInd < body.image.width)
                    xInd++;
                else {
                    yInd++;
                    xInd = 1;
                }
            }
            body.connectedImgData[bodyImageIteration] = p;
            loadConnectedImgdata(body, callback, pt.cnt + 1);
            pt.callback(body, bodyImageIteration);


        }, { callback: callback, cnt: cnt });
    }

    var loadImgdata = function (body, callback) {
        loadImage(body, function (image, body, pt) {
            body.image = image;

            var cv = document.createElement("canvas");
            cv.height = body.image.height;
            cv.width = body.image.width;

            var ct = cv.getContext('2d');
            ct.drawImage(body.image, 0, 0);

            var imgdata = ct.getImageData(0, 0, body.image.width, body.image.height);

            var d = imgdata.data;
            var p = {}; //[x][y]
            var xInd = 1;
            var yInd = 1;

            //converts imgdata to p[x][y] = {r,g,b,a}
            for (var i = 0; i < d.length; i += 0) {
                if (!p[xInd + ""])
                    p[xInd + ""] = {};
                if (!p[xInd + ""][yInd + ""])
                    p[xInd + ""][yInd + ""] = {};

                p[xInd + ""][yInd + ""].r = d[i];
                i++;
                p[xInd + ""][yInd + ""].g = d[i];
                i++;
                p[xInd + ""][yInd + ""].b = d[i];
                i++;
                p[xInd + ""][yInd + ""].a = d[i];
                i++;

                if (xInd < body.image.width)
                    xInd++;
                else {
                    yInd++;
                    xInd = 1;
                }
            }
            body.imgData = p;
            loadConnectedImgdata(body, callback, 2);
            pt.callback(body);


        }, { callback: callback });
    }

    var updateShape = function (body, shape, smoothing) {
        if (!checkDrawBody(body, shape))
            return

        if (body.details.staticBody)
            body.details.staticUpdated = true;

        var posX = body.body.m_xf.position.x;
        var posY = -body.body.m_xf.position.y;
        var posZ = 0;
        if (body.details.layer)
            posZ = -body.details.layer * 2;

        var scaleX = .04;
        var scaleY = .2;
        var scaleZ = .04;


        //body.getAngle()
        var rotZ = -body.getAngle() - Math.PI / 2;;
        var rotX = 0;
        var rotY = 0;//body.body.m_xf.R.col1.x;

        //if (rotZ == Math.PI || rotZ == 0) {
        //    rotZ += Math.PI;    
        //}

        //if (body.details.name == "userLeftItem" && body.details.busy)
        //    rotZ += Math.PI;

        var smoothingReady = (smoothing && !(shape.position.x == 0 && shape.position.y == 0 && shape.position.z == 0 && shape.rotation.z == 0));

        smoothingReady = false;
        var tmp_posX = posX;
        var tmp_posY = posY;
        var tmp_rotZ = rotZ;

        if (!(smoothing && (smoothing <= 0 || smoothing >= 1)) && smoothingReady) {
            tmp_posX = (posX * (1 - smoothing)) + (shape.position.x * smoothing);
            tmp_posY = (posY * (1 - smoothing)) + (shape.position.y * smoothing);

            //NEEDS TO BE FIXED when rotation W -> N -- rollover to 0 degrees
            //tmp_rotZ = ( rotZ * ( 1 - smoothing ) ) + ( shape.rotation.y * smoothing );
        }




        shape.position.x = tmp_posX;
        shape.position.y = tmp_posY;
        shape.position.z = posZ;

        shape.scaling = new THREE.Vector3(scaleX, scaleY, scaleZ);
        shape.rotation.x = rotX;
        shape.rotation.y = rotY;
        shape.rotation.z = rotZ;
    }

    var PointObject = function () {
        var geometry = new THREE.Geometry();
        var rgbColors = [];

        return {
            geometry: geometry,
            rgbColors: rgbColors,
            add: function () {
                var discTexture = THREE.ImageUtils.loadTexture('images/disc.png');
                var customUniforms = { texture: { type: "t", value: discTexture } };
                var customAttributes = { customColor: { type: "c", value: [] } };

                for (var v = 0; v < this.geometry.vertices.length; v++) {
                    customAttributes.customColor.value[v] = new THREE.Color();
                    if (this.rgbColors[v])
                        customAttributes.customColor.value[v].setRGB(this.rgbColors[v].r / 255, this.rgbColors[v].g / 255, this.rgbColors[v].b / 255);
                    else {
                        var vmod = v / this.geometry.vertices.length;
                        customAttributes.customColor.value[v].setRGB(vmod - vmod / 2, vmod - vmod / 3, vmod - vmod / 4);
                    }
                }

                var shaderMaterial = new THREE.ShaderMaterial({
                    uniforms: customUniforms,
                    attributes: customAttributes,
                    vertexShader: document.getElementById('vertexshader').textContent,
                    fragmentShader: document.getElementById('fragmentshader').textContent,
                    transparent: true,
                    alphaTest: 0.5
                });

                var particleSystem = new THREE.PointCloud(this.geometry, shaderMaterial);
                particleSystem.dynamic = false;
                particleSystem.sortParticles = false;
                scene.add(particleSystem);

                var shapeList = [particleSystem];

                return shapeList;
            }
        }

    }


    var createPointArray = function (w, h, x, y, z) {
        var land = new PointObject();

        for (var i = -w; i <= w; i++) {
            for (var j = -h; j <= h; j++) {
                land.geometry.vertices.push(
                    new THREE.Vector3(i + x, j + y, 0 + z)
                );
            }
        }
        land.add();
    }

    var particleSystem;
    return {
        scene: scene,
        camera: camera,
        canvas: canvas,
        renderer: renderer,
        init: function () {
            if (canvType != "webgl")
                return;

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.2, 9999999999);

            canvas = $("#center-canvas");
            renderer = new THREE.WebGLRenderer({ canvas: canvas.get(0) });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            //camera.position.z = 65;

            //createPointArray( 200, 200, 0, 0, 0 - 5 );

            //for ( var i = 1; i < 100; i++ )
            //{
            //    createPointArray( 10, 10, 0, -20, i - 5 );
            //}
            //for ( var i = 1; i < 300; i++ )
            //{
            //    createPointArray( 4, 4, 10, 10, i - 5 );
            //}

            //camera.rotation.y = rot * 2;
            //camera.rotation.x = rot * 2;
            //camera.rotation.z = rot * 2;
            //renderer.setSize( window.innerWidth - 1, window.innerHeight - 1 );


            //camera
            camera.position.z = 900;
            camera.position.y = -900;
            camera.rotation.x = .85;
            //camera.rotation.z = .15;

            var render = function () {
                requestAnimationFrame(render);

                renderer.render(scene, camera);
                //particleSystem.rotation.x += 0.005;
                //particleSystem.rotation.y += 0.005;
            };

            sceneLoaded = true;
            render();

        },
        resize: function () {
            //if (canvType != "webgl")
            //    return;

            //camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.2, 1000);
            //camera.position.z = 900;
            //camera.position.y = -900;
            //camera.rotation.x = .85;
            //renderer = new THREE.WebGLRenderer({ canvas: canvas.get(0) });
            //renderer.setSize(window.innerWidth, window.innerHeight);
        },
        scroll: function (val) {
            if (canvType != "webgl")
                return;

            camera.position.z -= 20 * val;;
            camera.position.y += 14 * val;;
            //camera.rotation.x += .01 * val;
        }
    }

});