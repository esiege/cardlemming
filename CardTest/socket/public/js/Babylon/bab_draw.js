
'use strict';


var sendBodyWarning = false;
var sendBodyToDraw = function () { if ( !sendBodyWarning ) { sendBodyWarning = true; console.log( "no sendBodyToDraw function found" ); } };

var gl_drawWarning = false;
var gl_draw = function () { if ( !gl_drawWarning ) { gl_drawWarning = true; console.log( "no gl_draw function found" ); } };
var gl_destroy = function () { if ( !gl_drawWarning ) { gl_drawWarning = true; console.log( "no gl_destroy function found" ); } };


app.service( 'bab_draw', function ( webgl_textures, $timeout )
{

    var bodyList = {};
    var sceneLoaded = false;
    var canvas;
    var engine;
    var scene;
    var material = {};
    var rot = Math.PI / 2;
    var checkDrawBody = function ( body, shape )
    {
        return !( !sceneLoaded || !body || !body.body || !shape || ( body.details.tags && body.details.tags.objectType && body.details.tags.objectType == 'action' ) )
    }

    gl_destroy = function ( body )
    {
        if ( checkDrawBody( body.m_userData, true ) && bodyList[body.m_userData.details.name].shape )
        {
            bodyList[body.m_userData.details.name].shape.dispose();

            delete bodyList[body.m_userData.details.name];
        }
    }


    sendBodyToDraw = function ( body )
    {
        if ( !checkDrawBody( body, true ) )
            return


        if ( !bodyList[body.details.name] )
        {
            bodyList[body.details.name] = {};
            bodyList[body.details.name].body = body;
            createMeshFromImage( bodyList[body.details.name] );
        }

        if ( bodyList[body.details.name].shapeList.length )
        {
            for ( var shape in bodyList[body.details.name].shapeList )
            {
                //.76 smoothing looks nice
                updateShape( bodyList[body.details.name].body, bodyList[body.details.name].shapeList[shape], .3 );
                updateShapeTexture( bodyList[body.details.name].body, bodyList[body.details.name].shapetextureList[shape], .3 );
            }
        }
        else
        {
            updateShape( bodyList[body.details.name].body, bodyList[body.details.name].shape, .3 );
            updateShapeTexture( bodyList[body.details.name].body, bodyList[body.details.name].shapetexture, .3 );
        }


    }
    var createMeshFromImage = function ( body )
    {
        bodyList[body.body.details.name].shapeList = [];

        loadImgdata( body, function ( body )
        {
            var getMidPos = function ( x, y, w, h, a, details )
            {
                var zpos = 0;

                if ( details.nocenter )
                    zpos = a / 510;

                return new BABYLON.Vector3( x - w / 2, zpos, y - h / 2 );
            }

            var shapeList = []; //shapelist["r0g0b0"]
            for ( var imgDataX = 1; imgDataX <= body.image.width; imgDataX++ )
            {
                for ( var imgDataY = 1; imgDataY <= body.image.height; imgDataY++ )
                {
                    if ( body.imgData[imgDataX][imgDataY].a )
                    {
                        var shape = BABYLON.Mesh.CreateBox( "shape", 1.0, scene );

                        shape.position = getMidPos( imgDataX, imgDataY, body.image.width, body.image.height, body.imgData[imgDataX][imgDataY].a, body.body.details );


                        shape.scaling = new BABYLON.Vector3( 1, 1, .2 );
                        shape.rotation = new BABYLON.Vector3( -rot, 0, 0 );

                        shapeList.push( shape );
                    }
                }
            }

                bodyList[body.body.details.name].shape = mergeMeshes( "body", shapeList, scene );

                var mat = new BABYLON.StandardMaterial( "pixel", scene );
                mat.diffuseColor = new BABYLON.Color3( 0, 0,  0 );

                bodyList[body.body.details.name].shape.material = mat;
                bodyList[body.body.details.name].shapeList = [];
            


                bodyList[body.body.details.name].shapetexture = BABYLON.Mesh.CreatePlane( "shape", 1.0, scene );


                var mat2 = new BABYLON.StandardMaterial( "tex", scene );
                mat2.diffuseTexture = new BABYLON.Texture( body.body.details.image, scene );

                bodyList[body.body.details.name].shapetexture.material = mat2;
        } );


    }

    var loadImage = function ( body, callback, passthrough )
    {
        var img = new Image();

        $( img ).load( function ()
        {
            body.image = this;
            callback( body, passthrough );

        } )
        .attr( { src: body.body.details.image } )
        .error( function () { console.log( body.body.details.image + " not found." ) } );
    }

    var loadImgdata = function ( body, callback )
    {
        loadImage( body, function ( body, pt )
        {
            var cv = document.createElement( "canvas" );
            var ct = cv.getContext( '2d' );
            ct.drawImage( body.image, 0, 0 );

            var imgdata = ct.getImageData( 0, 0, body.image.width, body.image.height );

            var d = imgdata.data;
            var p = {}; //[x][y]
            var xInd = 1;
            var yInd = 1;

            //converts imgdata to p[x][y] = {r,g,b,a}
            for ( var i = 0; i < d.length; i += 0 )
            {
                if ( !p[xInd + ""] )
                    p[xInd + ""] = {};
                if ( !p[xInd + ""][yInd + ""] )
                    p[xInd + ""][yInd + ""] = {};

                p[xInd + ""][yInd + ""].r = d[i];
                i++;
                p[xInd + ""][yInd + ""].g = d[i];
                i++;
                p[xInd + ""][yInd + ""].b = d[i];
                i++;
                p[xInd + ""][yInd + ""].a = d[i];
                i++;

                if ( xInd < body.image.width )
                    xInd++;
                else
                {
                    yInd++;
                    xInd = 1;
                }
            }
            body.imgData = p;
            pt.callback( body );
        }, { callback: callback } );
    }

    var updateShape = function ( body, shape, smoothing )
    {
        if ( !checkDrawBody( body, shape ) )
            return

        var posX = body.body.m_xf.position.x / 100;
        var posY = -body.body.m_xf.position.y / 100;
        var posZ = 0;
        if ( body.details.layer )
            posZ = -body.details.layer / 30;

        var scaleX = .04;
        var scaleY = .2;
        var scaleZ = .04;
        //body.getAngle()
        var rotZ = rot;
        var rotX = body.getAngle() + rot + rot;
        var rotY = rot;//body.body.m_xf.R.col1.x;

        var smoothingReady = ( smoothing && !( shape.position.x == 0 && shape.position.y == 0 && shape.position.z == 0 && shape.rotation.z == 0 ) );

        var tmp_posX = posX;
        var tmp_posY = posY;
        var tmp_rotZ = rotZ;

        if ( !( smoothing && ( smoothing <= 0 || smoothing >= 1 ) ) && smoothingReady )
        {
            tmp_posX = ( posX * ( 1 - smoothing ) ) + ( shape.position.x * smoothing );
            tmp_posY = ( posY * ( 1 - smoothing ) ) + ( shape.position.y * smoothing );


            //NEEDS TO BE FIXED when rotation W -> N -- rollover to 0 degrees
            //tmp_rotZ = ( rotZ * ( 1 - smoothing ) ) + ( shape.rotation.y * smoothing );
        }


        shape.position = new BABYLON.Vector3( tmp_posX, tmp_posY, posZ );
        shape.scaling = new BABYLON.Vector3( scaleX, scaleY, scaleZ );
        shape.rotation = new BABYLON.Vector3( rotX, tmp_rotZ, rotY );
    }
    var updateShapeTexture = function ( body, shapetexture, smoothing )
    {
        if ( !checkDrawBody( body, shapetexture ) )
            return

        var posX = body.body.m_xf.position.x / 100;
        var posY = -body.body.m_xf.position.y / 100;
        var posZ = 0;
        if ( body.details.layer )
            posZ = -body.details.layer / 30;

        posZ-=.1;
        var scaleX = 2;
        var scaleY = 2;
        var scaleZ = 0.1;

        //body.getAngle()
        var rotZ = 2*rot;
        var rotX = body.getAngle() + rot + rot;
        var rotY = rot;//body.body.m_xf.R.col1.x;

        var smoothingReady = ( smoothing && !( shapetexture.position.x == 0 && shapetexture.position.y == 0 && shapetexture.position.z == 0 && shapetexture.rotation.z == 0 ) );

        var tmp_posX = posX;
        var tmp_posY = posY;
        var tmp_rotZ = rotZ;

        if ( !( smoothing && ( smoothing <= 0 || smoothing >= 1 ) ) && smoothingReady )
        {
            tmp_posX = ( posX * ( 1 - smoothing ) ) + ( shapetexture.position.x * smoothing );
            tmp_posY = ( posY * ( 1 - smoothing ) ) + ( shapetexture.position.y * smoothing );


            //NEEDS TO BE FIXED when rotation W -> N -- rollover to 0 degrees
            //tmp_rotZ = ( rotZ * ( 1 - smoothing ) ) + ( shapetexture.rotation.y * smoothing );
        }


        shapetexture.position = new BABYLON.Vector3( tmp_posX, tmp_posY, posZ );
        shapetexture.scaling = new BABYLON.Vector3( scaleX, scaleY, scaleZ );
        shapetexture.rotation = new BABYLON.Vector3( rotX, tmp_rotZ, rotY );
    }


    return {
        init: function ()
        {
            canvas = document.getElementById( "center-canvas" );
            engine = new BABYLON.Engine( canvas, true );
            scene = new BABYLON.Scene( engine );


            //camera vector top left offset == 16:9 == %56.25 == 1.6875/3 == {x:1.6875 y:2 z:3} 
            var camera = new BABYLON.FreeCamera( "Camera", new BABYLON.Vector3( 4.2, -1.6875 - 3, -4 ), scene );
            //var camera = new BABYLON.ArcRotateCamera( "Camera", 0, 0, 2, new BABYLON.Vector3( 0, 0, 0 ), scene );

            var light0 = new BABYLON.PointLight( "Omni", new BABYLON.Vector3( 10, 10, -10 ), scene );
            //scene.activeCamera.attachControl( canvas );

            camera.rotation = new BABYLON.Vector3( -.49, 0, 0 );

            gl_draw = function ()
            {
                scene.render();
            }

            sceneLoaded = true;
        }
    }

} );