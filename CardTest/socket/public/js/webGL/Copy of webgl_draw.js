
'use strict';


var sendBodyWarning = false;
var sendBodyToDraw = function () { if ( !sendBodyWarning ) { sendBodyWarning = true; console.log( "no sendBodyToDraw function found" ); } };

var gl_drawWarning = false;
var gl_draw = function () { if ( !gl_drawWarning ) { gl_drawWarning = true; console.log( "no gl_draw function found" ); } };

app.service( 'webgl_draw', function ()
{
    var drawObjects = {};
    var bodyScaling = 0.1;

    sendBodyToDraw = function ( body )
    {
        if ( !gl || !gl.viewport )
            return;

        if ( !drawObjects[body.details.name] )
        {
            initBody( body );
            updateBody( body );
            initTexture( drawObjects[body.details.name] );
        }
        else
            updateBody( body );
    };


    function initTexture( drawObject )
    {
        drawObject.texture = gl.createTexture();
        drawObject.texture.image = new Image();
        drawObject.texture.image.onload = function ()
        {
            handleLoadedTexture( drawObject.texture )
        }

        drawObject.texture.image.src = drawObject.body.details.image;
    }
    function handleLoadedTexture( texture )
    {
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        gl.bindTexture( gl.TEXTURE_2D, null );
    }

    var initBody = function ( body )
    {
        drawObjects[body.details.name] = {};
        drawObjects[body.details.name].type = "square";
    }
    var updateBody = function ( body )
    {
        drawObjects[body.details.name].body = body;
    }

    gl_draw = function ()
    {
        if ( !gl || !gl.viewport )
            return;

        drawScene();

        for ( var b in drawObjects )
        {
            draw.imageSquare( drawObjects[b] );
        }



    };


    var gl;

    function initGL( canvas )
    {
        try
        {
            gl = canvas.getContext( "webgl" );
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch ( e )
        {
        }
        if ( !gl )
        {
            alert( "Could not initialise WebGL, sorry :-(" );
        }
    }


    function getShader( gl, id )
    {
        var shaderScript = document.getElementById( id );
        if ( !shaderScript )
        {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while ( k )
        {
            if ( k.nodeType == 3 )
            {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if ( shaderScript.type == "x-shader/x-fragment" )
        {
            shader = gl.createShader( gl.FRAGMENT_SHADER );
        } else if ( shaderScript.type == "x-shader/x-vertex" )
        {
            shader = gl.createShader( gl.VERTEX_SHADER );
        } else
        {
            return null;
        }

        gl.shaderSource( shader, str );
        gl.compileShader( shader );

        if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
        {
            alert( gl.getShaderInfoLog( shader ) );
            return null;
        }

        return shader;
    }


    var shaderProgram;

    function initShaders()
    {
        var fragmentShader = getShader( gl, "shader-fs" );
        var vertexShader = getShader( gl, "shader-vs" );

        shaderProgram = gl.createProgram();
        gl.attachShader( shaderProgram, vertexShader );
        gl.attachShader( shaderProgram, fragmentShader );
        gl.linkProgram( shaderProgram );

        if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) )
        {
            alert( "Could not initialise shaders" );
        }

        gl.useProgram( shaderProgram );

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
        gl.enableVertexAttribArray( shaderProgram.vertexPositionAttribute );

        shaderProgram.textureCoordAttribute = gl.getAttribLocation( shaderProgram, "aTextureCoord" );
        gl.enableVertexAttribArray( shaderProgram.textureCoordAttribute );

        shaderProgram.pMatrixUniform = gl.getUniformLocation( shaderProgram, "uPMatrix" );
        shaderProgram.mvMatrixUniform = gl.getUniformLocation( shaderProgram, "uMVMatrix" );
        shaderProgram.samplerUniform = gl.getUniformLocation( shaderProgram, "uSampler" );
    }



    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

    function mvPushMatrix()
    {
        var copy = mat4.create();
        mat4.set( mvMatrix, copy );
        mvMatrixStack.push( copy );
    }

    function mvPopMatrix()
    {
        if ( mvMatrixStack.length == 0 )
        {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }


    function setMatrixUniforms()
    {
        gl.uniformMatrix4fv( shaderProgram.pMatrixUniform, false, pMatrix );
        gl.uniformMatrix4fv( shaderProgram.mvMatrixUniform, false, mvMatrix );
    }


    function degToRad( degrees )
    {
        return degrees * Math.PI / 180;
    }


    var cubeVertexPositionBuffer = [];
    var cubeVertexColorBuffer = [];
    var cubeVertexIndexBuffer = [];
    var addCube = function ()
    {
        cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexPositionBuffer );
        var vertices = [
            // Front face
            -1.0, -1.0, 1.0,
             1.0, -1.0, 1.0,
             1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
             1.0, 1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
             1.0, 1.0, 1.0,
             1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0, 1.0, -1.0,
             1.0, 1.0, 1.0,
             1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0
        ];
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
        cubeVertexPositionBuffer.itemSize = 3;
        cubeVertexPositionBuffer.numItems = 24;

        cubeVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexColorBuffer );
        var colors = [
            [1.0, 0.0, 0.0, 1.0], // Front face
            [1.0, 1.0, 0.0, 1.0], // Back face
            [0.0, 1.0, 0.0, 1.0], // Top face
            [1.0, 0.5, 0.5, 1.0], // Bottom face
            [1.0, 0.0, 1.0, 1.0], // Right face
            [0.0, 0.0, 1.0, 1.0]  // Left face
        ];
        var unpackedColors = [];
        for ( var i in colors )
        {
            var color = colors[i];
            for ( var j = 0; j < 4; j++ )
            {
                unpackedColors = unpackedColors.concat( color );
            }
        }
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( unpackedColors ), gl.STATIC_DRAW );
        cubeVertexColorBuffer.itemSize = 4;
        cubeVertexColorBuffer.numItems = 24;

        cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer );
        var cubeVertexIndices = [
            0, 1, 2, 0, 2, 3,    // Front face
            4, 5, 6, 4, 6, 7,    // Back face
            8, 9, 10, 8, 10, 11,  // Top face
            12, 13, 14, 12, 14, 15, // Bottom face
            16, 17, 18, 16, 18, 19, // Right face
            20, 21, 22, 20, 22, 23  // Left face
        ];
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( cubeVertexIndices ), gl.STATIC_DRAW );
        cubeVertexIndexBuffer.itemSize = 1;
        cubeVertexIndexBuffer.numItems = 36;

    }

    var squareVertexPositionBuffer;
    var squareVertexTextureCoordBuffer;
    var squareVertexIndexBuffer = [];
    var addSquare = function ()
    {
        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, squareVertexPositionBuffer );
        var vertices = [
             1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
             1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = 4;

        squareVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, squareVertexTextureCoordBuffer );
        var textureCoords = [
                        0.0, 1.0,
                        0.0, 0.0,
                        1.0, 1.0,
                        1.0, 0.0
        ]
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( textureCoords ), gl.STATIC_DRAW );
        squareVertexIndexBuffer.itemSize = 4;
        squareVertexIndexBuffer.numItems = 4;

    }

    function initBuffers()
    {
        addCube();
        addSquare();
    }


    var startDistance = 70;
    function startView()
    {
        mat4.identity( mvMatrix );
        mat4.translate( mvMatrix, [0, 0.0, -startDistance] );
    }

    function drawScene()
    {
        var maxWidth = Math.round( startDistance * ( 10 / 14 ) ) - 3;
        var maxHeight = Math.round( startDistance * ( 5 / 14 ) );

        gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        mat4.perspective( 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100000.0, pMatrix );






    }


    var draw = {};
    var rSquare = 0;

    draw.imageSquare = function ( drawObject )
    {
        startView();

        mat4.translate( mvMatrix, [drawObject.body.body.m_xf.position.x * bodyScaling, drawObject.body.body.m_xf.position.y * bodyScaling, 0.0] );
        draw.square( drawObject );
    }

    draw.square = function ( drawObject )
    {
        mvPushMatrix();
        mat4.rotate( mvMatrix, degToRad( rSquare ), [1, 0, 0] );

        gl.bindBuffer( gl.ARRAY_BUFFER, squareVertexPositionBuffer );
        gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ARRAY_BUFFER, squareVertexTextureCoordBuffer );
        gl.vertexAttribPointer( shaderProgram.textureCoordAttribute, squareVertexIndexBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture( gl.TEXTURE_2D, drawObject.texture );
        gl.uniform1i( shaderProgram.samplerUniform, 0 );

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer );
        setMatrixUniforms();
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems );

        mvPopMatrix();
    }

    var rCube = 0;
    draw.cube = function ()
    {
        mvPushMatrix();
        //mat4.rotate( mvMatrix, degToRad( rCube ), [1, 1, 1] );

        gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexPositionBuffer );
        gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexColorBuffer );
        gl.vertexAttribPointer( shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer );
        setMatrixUniforms();
        gl.drawElements( gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0 );

        mvPopMatrix();
    }

    var lastTime = 0;


    return {
        webGLStart: function (canvasName)
        {
            var canvas = document.getElementById( canvasName );
            initGL( canvas );
            initShaders()
            initBuffers();

            gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
            gl.enable( gl.DEPTH_TEST );

        }
    }

} );