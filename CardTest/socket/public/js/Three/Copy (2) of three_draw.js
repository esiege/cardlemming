
'use strict';


var sendBodyWarning = false;
var sendBodyToDraw = function () { if ( !sendBodyWarning ) { sendBodyWarning = true; console.log( "no sendBodyToDraw function found" ); } };

var gl_drawWarning = false;
var gl_draw = function () { if ( !gl_drawWarning ) { gl_drawWarning = true; console.log( "no gl_draw function found" ); } };
var gl_destroy = function () { if ( !gl_drawWarning ) { gl_drawWarning = true; console.log( "no gl_destroy function found" ); } };


app.service( 'three_draw', function ( webgl_textures, $timeout )
{
    var scene;
    var camera;
    var canvas;
    var renderer;
    var cameraTarget = new THREE.Vector3(0,0,0);


    var bodyList = {};
    var sceneLoaded = false;
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
                updateShape( bodyList[body.details.name].body.shape, bodyList[body.details.name].shapeList[shape], .3 );
                //updateShapeTexture( bodyList[body.details.name].body, bodyList[body.details.name].shapetextureList[shape], .3 );
            }
        }
        else if ( bodyList[body.details.name].shape )
        {
            updateShape( bodyList[body.details.name].body, bodyList[body.details.name].shape.mesh, .3 );
            //updateShapeTexture( bodyList[body.details.name].body, bodyList[body.details.name].shapetexture, .3 );
        }


    }

    var pushPixel = function ( geometry, mod, corners )
    {
        //var size = .5;
        //geometry.vertices.push(
        //    new THREE.Vector3( -size + mod.x, size + mod.y, 0 ),
        //    new THREE.Vector3( -size + mod.x, -size + mod.y, 0 ),
        //    new THREE.Vector3( size + mod.x, -size + mod.y, 0 ),
        //    new THREE.Vector3( size + mod.x, size + mod.y, 0 )
        //);

        geometry.vertices.push(
            new THREE.Vector3( mod.x, mod.y, 0 )
        );

        if ( !corners )
            return;

        if ( corners.N )
            geometry.vertices.push(
            new THREE.Vector3( -size + mod.x, size + mod.y, 0 ),
            new THREE.Vector3( size + mod.x, size + mod.y, 0 ),
            new THREE.Vector3( size + mod.x, size + mod.y, -size ),
            new THREE.Vector3( -size + mod.x, size + mod.y, -size )
            );
        if ( corners.S )
            geometry.vertices.push(
            new THREE.Vector3( size + mod.x, -size + mod.y, 0 ),
            new THREE.Vector3( -size + mod.x, -size + mod.y, 0 ),
            new THREE.Vector3( -size + mod.x, -size + mod.y, -size ),
            new THREE.Vector3( size + mod.x, -size + mod.y, -size )
            );
        if ( corners.E )
            geometry.vertices.push(
                new THREE.Vector3( size + mod.x, size + mod.y, 0 ),
                new THREE.Vector3( size + mod.x, -size + mod.y, 0 ),
                new THREE.Vector3( size + mod.x, -size + mod.y, -size ),
                new THREE.Vector3( size + mod.x, size + mod.y, -size )
            );
        if ( corners.W )
            geometry.vertices.push(
                new THREE.Vector3( -size + mod.x, size + mod.y, 0 ),
                new THREE.Vector3( -size + mod.x, size + mod.y, -size ),
                new THREE.Vector3( -size + mod.x, -size + mod.y, -size ),
                new THREE.Vector3( -size + mod.x, -size + mod.y, 0 )
            );

    };
    var updatePixelFaces = function ( geometry, imageDataPreProcess )
    {
        for ( var i = 0; i < geometry.vertices.length / 4; i++ )
        {
            var step = 4 * i;
            var indexA = geometry.faces.push( new THREE.Face3( 0 + step, 1 + step, 2 + step ) ) - 1;
            var indexB = geometry.faces.push( new THREE.Face3( 2 + step, 3 + step, 0 + step ) ) - 1;

            //updateFaceColor( geometry.faces[indexA], imageDataPreProcess[i] )
            //updateFaceColor( geometry.faces[indexB], imageDataPreProcess[i] )
        }
    };
    var updateFaceColor = function ( face, color )
    {
        face.color.setRGB( color.r / 255, color.g / 255, color.b / 255 );

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

                return new THREE.Vector3( x - w / 2, y - h / 2, zpos );
            }

            var shapeList = []; //shapelist["r0g0b0"]
            var imageDataPreProcess = [];
            for ( var imgDataX = 1; imgDataX <= body.image.width; imgDataX++ )
            {
                for ( var imgDataY = 1; imgDataY <= body.image.height; imgDataY++ )
                {
                    if ( body.imgData[imgDataX][imgDataY].a )
                    {
                        body.imgData[imgDataX][imgDataY].midPos = getMidPos( imgDataX, imgDataY, body.image.width, body.image.height, body.imgData[imgDataX][imgDataY].a, body.body.details );


                        imageDataPreProcess.push( body.imgData[imgDataX][imgDataY] );














                        //var size = .01;

                        //var geometry = new THREE.Geometry();

                        //geometry.vertices.push(
                        //    new THREE.Vector3( -size, size, 0 ),
                        //    new THREE.Vector3( -size, -size, 0 ),
                        //    new THREE.Vector3( size, -size, 0 )
                        //);

                        //geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );


                        //var midPos = getMidPos( imgDataX, imgDataY, body.image.width, body.image.height, body.imgData[imgDataX][imgDataY].a, body.body.details );

                        //for ( var i = 0; i < geometry.vertices.length; i++ )
                        //{
                        //    geometry.vertices[i].z += midPos.z * size;
                        //    geometry.vertices[i].x += midPos.x * size;
                        //}


                        //var geometry_bsp = new ThreeBSP( geometry );
                        //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
                        //var mesh = new THREE.Mesh( geometry, material );


                        //shapeList.push( { geometry: geometry, geometry_bsp: geometry_bsp, material: material, mesh: mesh } );
                    }
                }
            }


            var geometry = new THREE.Geometry();
            for ( var i = 0; i < imageDataPreProcess.length; i++ )
            {
                pushPixel( geometry, imageDataPreProcess[i].midPos )
            }

            var colors = [];
            for ( var i = 0; i < geometry.vertices.length; i++ )
            {

                // random color
                colors[i] = new THREE.Color();
                colors[i].setHSL( Math.random(), 1.0, 0.5 );

            }
            geometry.colors = colors;

            //updatePixelFaces( geometry, imageDataPreProcess );

            var material = new THREE.PointCloudMaterial( {
                size: 10,
                transparent: true,
                opacity: 0.7,
                vertexColors: true
            } );

            var mesh = new THREE.PointCloud( geometry, material );
            bodyList[body.body.details.name].shape = { mesh: mesh };

            scene.add( mesh );

            //bodyList[body.body.details.name].shape = mergeMeshes( "body", shapeList, scene );

            //var merged_geometry_bsp;
            //var merged_mesh;


            //for ( var i = 1; i < shapeList.length; i++ )
            //{
            //    if ( i == 1 )
            //        merged_geometry_bsp = shapeList[i - 1].geometry_bsp.union( shapeList[i].geometry_bsp );
            //    else
            //        merged_geometry_bsp = merged_geometry_bsp.union( shapeList[i].geometry_bsp );

            //    console.log( "Merged mesh for (" + body.body.details.image + "): " + i + " of " + shapeList.length );
            //}

            //merged_mesh = merged_geometry_bsp.toMesh( new THREE.MeshLambertMaterial( { shading: THREE.SmoothShading, map: THREE.ImageUtils.loadTexture( 'images/texture.png' ) } ) );

            //merged_mesh.geometry.computeVertexNormals();

            //bodyList[body.body.details.name].shape = { mesh: merged_mesh };
            ////bodyList[body.body.details.name].shape = shapeList[0];

            //scene.add( bodyList[body.body.details.name].shape.mesh );

            //bodyList[body.body.details.name].shapeList = [];

            //var plane = new THREE.Mesh( new THREE.PlaneGeometry( 5, 20 ), new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} ));
            //bodyList[body.body.details.name].shapetexture = plane; 
            //scene.add( plane );


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
    var asdfg = 0;
    var updateShape = function ( body, shape, smoothing )
    {
        if ( !checkDrawBody( body, shape ) )
            return

        var posX = body.body.m_xf.position.x / 100;
        var posY = -body.body.m_xf.position.y / 100;
        var posZ = 0;
        //if ( body.details.layer )
        //    posZ = -body.details.layer / 30;

        var scaleX = .04;
        var scaleY = .2;
        var scaleZ = .04;


        //body.getAngle()
        var rotZ = 0 * 2;
        var rotX = 0 * 2;
        var rotY = 0;//body.body.m_xf.R.col1.x;

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




        shape.position.x = tmp_posX;
        shape.position.y = tmp_posY;
        shape.position.z = posZ;

        shape.scaling = new THREE.Vector3( scaleX, scaleY, scaleZ );
        shape.rotation.x = rotX;
        shape.rotation.y = rotY;
        shape.rotation.z = rotZ;
    }
    //var updateShapeTexture = function ( body, shapetexture, smoothing )
    //{
    //    if ( !checkDrawBody( body, shapetexture ) )
    //        return

    //    var posX = body.body.m_xf.position.x / 100;
    //    var posY = -body.body.m_xf.position.y / 100;
    //    var posZ = 0;
    //    if ( body.details.layer )
    //        posZ = -body.details.layer / 30;

    //    posZ -= .1;
    //    var scaleX = 2;
    //    var scaleY = 2;
    //    var scaleZ = 0.1;

    //    //body.getAngle()
    //    var rotZ = 2 * rot;
    //    var rotX = body.getAngle() + rot + rot;
    //    var rotY = rot;//body.body.m_xf.R.col1.x;

    //    var smoothingReady = ( smoothing && !( shapetexture.position.x == 0 && shapetexture.position.y == 0 && shapetexture.position.z == 0 && shapetexture.rotation.z == 0 ) );

    //    var tmp_posX = posX;
    //    var tmp_posY = posY;
    //    var tmp_rotZ = rotZ;

    //    if ( !( smoothing && ( smoothing <= 0 || smoothing >= 1 ) ) && smoothingReady )
    //    {
    //        tmp_posX = ( posX * ( 1 - smoothing ) ) + ( shapetexture.position.x * smoothing );
    //        tmp_posY = ( posY * ( 1 - smoothing ) ) + ( shapetexture.position.y * smoothing );


    //        //NEEDS TO BE FIXED when rotation W -> N -- rollover to 0 degrees
    //        //tmp_rotZ = ( rotZ * ( 1 - smoothing ) ) + ( shapetexture.rotation.y * smoothing );
    //    }


    //    shapetexture.position = new BABYLON.Vector3( tmp_posX, tmp_posY, posZ );
    //    shapetexture.scaling = new BABYLON.Vector3( scaleX, scaleY, scaleZ );
    //    shapetexture.rotation = new BABYLON.Vector3( rotX, tmp_rotZ, rotY );
    //}



    var PointObject = function ()
    {
        var geometry = new THREE.Geometry();

        return {
            geometry: geometry,
            add: function ()
            {
                // vertex colors
                var colors = [];
                for ( var i = 0; i < this.geometry.vertices.length; i++ )
                {
                    // random color
                    colors[i] = new THREE.Color();
                    colors[i].setHSL( i / 20000 + .2, 1.0, 0.5 );

                }
                this.geometry.colors = colors;

                material = new THREE.PointCloudMaterial( {
                    size: 1.1,
                    transparent: true,
                    opacity: 0.2,
                    vertexColors: true
                } );

                particleSystem = new THREE.PointCloud( this.geometry, material );

                var material2 = new THREE.PointCloudMaterial( {
                    size: 2.1,
                    transparent: true,
                    opacity: .2,
                    vertexColors: true
                } );

                var particleSystem2 = new THREE.PointCloud( this.geometry, material2 );

                var material3 = new THREE.PointCloudMaterial( {
                    color: 0x000000,
                    size: 3,
                } );

                var particleSystem3 = new THREE.PointCloud( this.geometry, material3 );

                scene.add( particleSystem );
                scene.add( particleSystem2 );
                scene.add( particleSystem3 );
            }
        }

    }

    
    var createPointArray = function (w,h,x,y,z)
    {
        // particle system geometry
        var land = new PointObject();

        for ( var i = -w; i <= w; i++ )
        {
            for ( var j = -h; j <= h; j++ )
            {
                land.geometry.vertices.push(
                    new THREE.Vector3( i+x, j+y, 0+z )
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
        init: function ()
        {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.2, 1000 );

            canvas = $( "#center-canvas" );
            renderer = new THREE.WebGLRenderer( { canvas: canvas.get( 0 ) } );
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );

            //camera.position.z = 65;

            //createPointArray( 50, 30, 0, 0, 0 );

            //for ( var i = 1; i < 10; i++ )
            //{
            //    createPointArray( 10, 10, 0, -20, i );
            //}
            //for ( var i = 1; i < 30; i++ )
            //{
            //    createPointArray( 4, 4, 10, 10, i );
            //}

            //camera.rotation.y = rot * 2;
            //camera.rotation.x = rot * 2;
            //camera.rotation.z = rot * 2;
            //renderer.setSize( window.innerWidth - 1, window.innerHeight - 1 );


            //camera
            camera.position.z = 75;
            camera.position.y = -75;
            camera.rotation.x = .85;
            //camera.rotation.z = .15;

            var render = function ()
            {
                requestAnimationFrame( render );

                renderer.render( scene, camera );
                //particleSystem.rotation.x += 0.005;
                //particleSystem.rotation.y += 0.005;
            };

            sceneLoaded = true;
            render();

        },
        resize: function ()
        {
            camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.2, 1000 );
            camera.position.z = 75;
            camera.position.y = -75;
            camera.rotation.x = .85;
            renderer = new THREE.WebGLRenderer( { canvas: canvas.get( 0 ) } );
            renderer.setSize( window.innerWidth, window.innerHeight );
        },
        scroll: function (val)
        {
            camera.position.z -= 2 * val;;
            camera.position.y += 1.4 * val;;
            camera.rotation.x += .01 * val;
        }
    }

} );