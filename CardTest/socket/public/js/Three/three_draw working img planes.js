
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

            setupImage(bodyList[body.details.name]);
        }
        updateMesh(bodyList[body.details.name].body, bodyList[body.details.name].mesh, .75);
    }



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


    var setupImage = function (body, callback) {


        loadImage(body, function (image, body, pt) {
            body.image = image;

            body.shape = new THREE.PlaneGeometry(image.width/16, image.height/16);

            body.texture = new THREE.ImageUtils.loadTexture(body.body.details.image);
            body.material = new THREE.MeshBasicMaterial({ map: body.texture, transparent: true, alphaTest: 0.5 });
            body.mesh = new THREE.Mesh(body.shape.clone(), body.material);
            scene.add(body.mesh);

            if (pt.callback)
                pt.callback(body);


        }, { callback: callback });
    }

    var updateMesh = function (body, mesh, smoothing) {
        if (!checkDrawBody(body, mesh))
            return

        if (body.details.staticBody)
            body.details.staticUpdated = true;

        var posX = body.body.m_xf.position.x;
        var posY = -body.body.m_xf.position.y;
        var posZ = 0;
        if (body.details.layer)
            posZ = -body.details.layer * .2;

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

        var smoothingReady = (smoothing && !(mesh.position.x == 0 && mesh.position.y == 0 && mesh.position.z == 0 && mesh.rotation.z == 0));

        smoothingReady = false;
        var tmp_posX = posX;
        var tmp_posY = posY;
        var tmp_rotZ = rotZ;

        if (!(smoothing && (smoothing <= 0 || smoothing >= 1)) && smoothingReady) {
            tmp_posX = (posX * (1 - smoothing)) + (mesh.position.x * smoothing);
            tmp_posY = (posY * (1 - smoothing)) + (mesh.position.y * smoothing);

            //NEEDS TO BE FIXED when rotation W -> N -- rollover to 0 degrees
            //tmp_rotZ = ( rotZ * ( 1 - smoothing ) ) + ( mesh.rotation.y * smoothing );
        }

        mesh.position.x = tmp_posX;
        mesh.position.y = tmp_posY;
        mesh.position.z = posZ;

        mesh.scaling = new THREE.Vector3(scaleX, scaleY, scaleZ);
        mesh.rotation.x = rotX;
        mesh.rotation.y = rotY;
        mesh.rotation.z = rotZ;
    }




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
            renderer.sortObjects = false;
            document.body.appendChild(renderer.domElement);

            //camera
            camera.position.z = 900;
            camera.position.y = -900;
            camera.rotation.x = .85;

            var render = function () {
                requestAnimationFrame(render);

                renderer.render(scene, camera);
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