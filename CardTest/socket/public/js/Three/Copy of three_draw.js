
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


    return {
        scene: scene,
        camera: camera,
        canvas: canvas,
        renderer: renderer,
        init: function ()
        {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

            canvas = $( "#center-canvas" );
            renderer = new THREE.CanvasRenderer( { canvas: canvas.get( 0 ) } );
            document.body.appendChild( renderer.domElement );
            

            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            var cube = new THREE.Mesh( geometry, material );
            scene.add( cube );

            camera.position.z = 5;
            renderer.setSize( window.innerWidth-1, window.innerHeight-1 );
            

            var render = function ()
            {
                requestAnimationFrame( render );
                renderer.render( scene, camera );
            };

            render();

        },
        resize: function ()
        {
            renderer.setSize( window.innerWidth-1, window.innerHeight-1 );
        }
    }

} );