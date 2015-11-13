
'use strict';


var sendBodyWarning = false;
var sendBodyToDraw = function () { if ( !sendBodyWarning ) { sendBodyWarning = true; console.log( "no sendBodyToDraw function found" ); } };

var gl_drawWarning = false;
var gl_draw = function () { if ( !gl_drawWarning ) { gl_drawWarning = true; console.log( "no gl_draw function found" ); } };
var gl_destroy = function () { if ( !gl_drawWarning ) { gl_drawWarning = true; console.log( "no gl_destroy function found" ); } };


app.service( 'bab_draw', function ()
{

    var bodyList = {};
    var sceneLoaded = false;
    var canvas;
    var engine;
    var scene;
    var checkDrawBody = function (body, shape) {
        return !(!sceneLoaded || !body || !body.body || !shape || (body.details.tags && body.details.tags.objectType && body.details.tags.objectType == 'action'))
    }

    gl_destroy = function ( body )
    {
        if (checkDrawBody(body.m_userData, true) && bodyList[body.m_userData.details.name].shape) {
            bodyList[body.m_userData.details.name].shape.dispose();

            delete bodyList[body.m_userData.details.name];
        }
    }


    sendBodyToDraw = function ( body )
    {
        if (!checkDrawBody(body, true))
            return


        if ( !bodyList[body.details.name] )
        {
            bodyList[body.details.name] = {};
            bodyList[body.details.name].shape = BABYLON.Mesh.CreateBox( "body", 1.0, scene );
            bodyList[body.details.name].body = body;
        }



        updateBody( bodyList[body.details.name].body, bodyList[body.details.name].shape );


    }

    var updateBody = function ( body, shape )
    {
        if (!checkDrawBody(body, shape)) 
            return
        
            
            var posX = body.body.m_xf.position.x / 100;
            var posZ = 0;

            if (body.details.layer)
            posZ = body.details.layer / 100;

            var posY = body.body.m_xf.position.y / 100;

            var scaleY = body.details.width / 100;
            var scaleZ = 0.01;
            var scaleX = body.details.height / 100;
        
            var rotZ = body.getAngle();
            var rotX = 0;
            var rotY = 0;//body.body.m_xf.R.col1.x;

            shape.position = new BABYLON.Vector3( posY, posZ, posX );
            shape.scaling = new BABYLON.Vector3( scaleX, scaleZ, scaleY );
            shape.rotation = new BABYLON.Vector3( rotX, rotZ, rotY );
        

    }


    return {
        init: function ()
        {
            canvas = document.getElementById( "center-canvas" );
            engine = new BABYLON.Engine( canvas, true );
            scene = new BABYLON.Scene( engine );


            //camera vector top left offset == 16:9 == %56.25 == 1.6875/3 == {x:1.6875 y:2 z:3} 
            var camera = new BABYLON.ArcRotateCamera( "Camera", 0, 0, 2, new BABYLON.Vector3( 1.6875, 2, 3 ), scene );
            //var camera = new BABYLON.ArcRotateCamera( "Camera", 0, 0, 2, new BABYLON.Vector3(0, 0, 0 ), scene );

            var light0 = new BABYLON.PointLight( "Omni", new BABYLON.Vector3( 10, 10, 0 ), scene );
            scene.activeCamera.attachControl( canvas );

            gl_draw = function ()
            {
                scene.render();
            }

            sceneLoaded = true;
        }
    }

} );