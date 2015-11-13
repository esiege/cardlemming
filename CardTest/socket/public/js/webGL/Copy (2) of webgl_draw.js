
'use strict';


var sendBodyWarning = false;
var sendBodyToDraw = function () { if ( !sendBodyWarning ) { sendBodyWarning = true; console.log( "no sendBodyToDraw function found" ); } };

var gl_drawWarning = false;
var gl_draw = function () { if ( !gl_drawWarning ) { gl_drawWarning = true; console.log( "no gl_draw function found" ); } };



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
        var fragmentShader = getShader( gl, "per-fragment-lighting-fs" );
        var vertexShader = getShader( gl, "per-fragment-lighting-vs" );

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

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation( shaderProgram, "aVertexNormal" );
        gl.enableVertexAttribArray( shaderProgram.vertexNormalAttribute );

        shaderProgram.textureCoordAttribute = gl.getAttribLocation( shaderProgram, "aTextureCoord" );
        gl.enableVertexAttribArray( shaderProgram.textureCoordAttribute );

        shaderProgram.pMatrixUniform = gl.getUniformLocation( shaderProgram, "uPMatrix" );
        shaderProgram.mvMatrixUniform = gl.getUniformLocation( shaderProgram, "uMVMatrix" );
        shaderProgram.nMatrixUniform = gl.getUniformLocation( shaderProgram, "uNMatrix" );
        shaderProgram.colorMapSamplerUniform = gl.getUniformLocation( shaderProgram, "uColorMapSampler" );
        shaderProgram.specularMapSamplerUniform = gl.getUniformLocation( shaderProgram, "uSpecularMapSampler" );
        shaderProgram.useColorMapUniform = gl.getUniformLocation( shaderProgram, "uUseColorMap" );
        shaderProgram.useSpecularMapUniform = gl.getUniformLocation( shaderProgram, "uUseSpecularMap" );
        shaderProgram.useLightingUniform = gl.getUniformLocation( shaderProgram, "uUseLighting" );
        shaderProgram.ambientColorUniform = gl.getUniformLocation( shaderProgram, "uAmbientColor" );
        shaderProgram.pointLightingLocationUniform = gl.getUniformLocation( shaderProgram, "uPointLightingLocation" );
        shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation( shaderProgram, "uPointLightingSpecularColor" );
        shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation( shaderProgram, "uPointLightingDiffuseColor" );
    }


    function handleLoadedTexture( texture )
    {
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST );
        gl.generateMipmap( gl.TEXTURE_2D );

        gl.bindTexture( gl.TEXTURE_2D, null );
    }


    var earthColorMapTexture;
    var earthSpecularMapTexture;

    function initTextures()
    {
        earthColorMapTexture = gl.createTexture();
        earthColorMapTexture.image = new Image();
        earthColorMapTexture.image.onload = function ()
        {
            handleLoadedTexture( earthColorMapTexture )
        }
        earthColorMapTexture.image.src = "images/earth.jpg";

        earthSpecularMapTexture = gl.createTexture();
        earthSpecularMapTexture.image = new Image();
        earthSpecularMapTexture.image.onload = function ()
        {
            handleLoadedTexture( earthSpecularMapTexture )
        }
        earthSpecularMapTexture.image.src = "images/earth-specular.gif";
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

        var normalMatrix = mat3.create();
        mat4.toInverseMat3( mvMatrix, normalMatrix );
        mat3.transpose( normalMatrix );
        gl.uniformMatrix3fv( shaderProgram.nMatrixUniform, false, normalMatrix );
    }

    function degToRad( degrees )
    {
        return degrees * Math.PI / 180;
    }


    var sphereVertexNormalBuffer;
    var sphereVertexTextureCoordBuffer;
    var sphereVertexPositionBuffer;
    var sphereVertexIndexBuffer;

    function initBuffers()
    {
        var latitudeBands = 30;
        var longitudeBands = 30;
        var radius = 13;

        var vertexPositionData = [];
        var normalData = [];
        var textureCoordData = [];
        for ( var latNumber = 0; latNumber <= latitudeBands; latNumber++ )
        {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin( theta );
            var cosTheta = Math.cos( theta );

            for ( var longNumber = 0; longNumber <= longitudeBands; longNumber++ )
            {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin( phi );
                var cosPhi = Math.cos( phi );

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                var u = 1 - ( longNumber / longitudeBands );
                var v = 1 - ( latNumber / latitudeBands );

                normalData.push( x );
                normalData.push( y );
                normalData.push( z );
                textureCoordData.push( u );
                textureCoordData.push( v );
                vertexPositionData.push( radius * x );
                vertexPositionData.push( radius * y );
                vertexPositionData.push( radius * z );
            }
        }

        var indexData = [];
        for ( var latNumber = 0; latNumber < latitudeBands; latNumber++ )
        {
            for ( var longNumber = 0; longNumber < longitudeBands; longNumber++ )
            {
                var first = ( latNumber * ( longitudeBands + 1 ) ) + longNumber;
                var second = first + longitudeBands + 1;
                indexData.push( first );
                indexData.push( second );
                indexData.push( first + 1 );

                indexData.push( second );
                indexData.push( second + 1 );
                indexData.push( first + 1 );
            }
        }

        sphereVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, sphereVertexNormalBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( normalData ), gl.STATIC_DRAW );
        sphereVertexNormalBuffer.itemSize = 3;
        sphereVertexNormalBuffer.numItems = normalData.length / 3;

        sphereVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( textureCoordData ), gl.STATIC_DRAW );
        sphereVertexTextureCoordBuffer.itemSize = 2;
        sphereVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

        sphereVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, sphereVertexPositionBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertexPositionData ), gl.STATIC_DRAW );
        sphereVertexPositionBuffer.itemSize = 3;
        sphereVertexPositionBuffer.numItems = vertexPositionData.length / 3;

        sphereVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indexData ), gl.STREAM_DRAW );
        sphereVertexIndexBuffer.itemSize = 1;
        sphereVertexIndexBuffer.numItems = indexData.length;
    }


    var earthAngle = 180;
    var filterEffect = {};
    filterEffect.use_colorMap = true;
    filterEffect.use_specularMap = true;
    filterEffect.use_lighting = true;


    function drawScene()
    {
        gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        mat4.perspective( 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix );

        gl.uniform1i( shaderProgram.useColorMapUniform, filterEffect.use_colorMapColorMap );
        gl.uniform1i( shaderProgram.useSpecularMapUniform, filterEffect.use_specularMap );
        gl.uniform1i( shaderProgram.useLightingUniform, filterEffect.use_lighting );

        if ( filterEffect.use_lighting )
        {
            filterEffect.ambientR = .5;
            filterEffect.ambientG = .5;
            filterEffect.ambientB = .5;

            filterEffect.lightPositionX = -10;
            filterEffect.lightPositionY = 4;
            filterEffect.lightPositionZ = -20;

            filterEffect.specularR = 5;
            filterEffect.specularG = 5;
            filterEffect.specularB = 5;

            filterEffect.diffuseR = 0.8;
            filterEffect.diffuseG = 0.8;
            filterEffect.diffuseB = 0.8;

            gl.uniform3f(
                shaderProgram.ambientColorUniform,
                parseFloat( filterEffect.ambientR ),
                parseFloat( filterEffect.ambientG ),
                parseFloat( filterEffect.ambientB )
            );

            gl.uniform3f(
                shaderProgram.pointLightingLocationUniform,
                parseFloat( filterEffect.lightPositionX ),
                parseFloat( filterEffect.lightPositionY ),
                parseFloat( filterEffect.lightPositionZ )
            );

            gl.uniform3f(
                shaderProgram.pointLightingSpecularColorUniform,
                parseFloat( filterEffect.specularR ),
                parseFloat( filterEffect.specularG ),
                parseFloat( filterEffect.specularB )
            );

            gl.uniform3f(
                shaderProgram.pointLightingDiffuseColorUniform,
                parseFloat( filterEffect.diffuseR ),
                parseFloat( filterEffect.diffuseG ),
                parseFloat( filterEffect.diffuseB )
            );
        }

        mat4.identity( mvMatrix );

        mat4.translate( mvMatrix, [0, 0, -40] );
        mat4.rotate( mvMatrix, degToRad( 23.4 ), [1, 0, -1] );
        mat4.rotate( mvMatrix, degToRad( earthAngle ), [0, 1, 0] );

        if ( earthColorMapTexture && earthColorMapTexture.image.width )
        {
            gl.activeTexture( gl.TEXTURE0 );
            gl.bindTexture( gl.TEXTURE_2D, earthColorMapTexture );
            gl.uniform1i( shaderProgram.colorMapSamplerUniform, 0 );
        }

        if ( earthSpecularMapTexture && earthSpecularMapTexture.image.width )
        {
            gl.activeTexture( gl.TEXTURE1 );
            gl.bindTexture( gl.TEXTURE_2D, earthSpecularMapTexture );
            gl.uniform1i( shaderProgram.specularMapSamplerUniform, 1 );
        }

        gl.bindBuffer( gl.ARRAY_BUFFER, sphereVertexPositionBuffer );
        gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer );
        gl.vertexAttribPointer( shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ARRAY_BUFFER, sphereVertexNormalBuffer );
        gl.vertexAttribPointer( shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer );
        setMatrixUniforms();
        gl.drawElements( gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0 );
    }


    var lastTime = 0;

    function animate()
    {
        var timeNow = new Date().getTime();
        if ( lastTime != 0 )
        {
            var elapsed = timeNow - lastTime;

            earthAngle += 0.05 * elapsed;
        }
        lastTime = timeNow;
    }



    function tick()
    {
        requestAnimFrame( tick );
        drawScene();
        animate();
    }

        var webGLStart =  function ()
        {

            var canvas = document.getElementById( "center-canvas" );
            initGL( canvas );
            initShaders();
            initBuffers();

            setTimeout( function () {  initTextures(); }, 3000 );

           

            gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
            gl.enable( gl.DEPTH_TEST );

            tick();
        }
    
