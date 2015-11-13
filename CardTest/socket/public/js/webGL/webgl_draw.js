
'use strict';


var sendBodyWarning = false;
var sendBodyToDraw = function () { if ( !sendBodyWarning ) { sendBodyWarning = true; console.log( "no sendBodyToDraw function found" ); } };

var gl_drawWarning = false;
var gl_draw = function () { if ( !gl_drawWarning ) { gl_drawWarning = true; console.log( "no gl_draw function found" ); } };


app.service( 'webgl_draw', function ( webgl_primitives, webgl_vertex, webgl_gl_init, webgl_textures )
{
    var gl;
    var shaderProgram;

    function initTextures( callback )
    {
        var cnt = 0;

        cnt++;
        textures.earth = gl.createTexture();
        textures.earth.image = new Image();
        textures.earth.image.onload = function ()
        {
            handleLoadedTexture( textures.earth );
            cnt--;
            if ( cnt == 0 )
                callback();
        }
        textures.earth.image.src = "images/earth.png";

        cnt++;
        textures.cube = gl.createTexture();
        textures.cube.image = new Image();
        textures.cube.image.onload = function ()
        {
            handleLoadedTexture( textures.cube )
            cnt--;
            if ( cnt == 0 )
                callback();
        }
        textures.cube.image.src = "images/nehe.gif";

        cnt++;
        speculars.earth = gl.createTexture();
        speculars.earth.image = new Image();
        speculars.earth.image.onload = function ()
        {
            handleLoadedTexture( speculars.earth )
            cnt--;
            if ( cnt == 0 )
                callback();
        }
        speculars.earth.image.src = "images/earth-specular.gif";

        cnt++;
        speculars.cube = gl.createTexture();
        speculars.cube.image = new Image();
        speculars.cube.image.onload = function ()
        {
            handleLoadedTexture( speculars.cube )
            cnt--;
            if ( cnt == 0 )
                callback();
        }
        speculars.cube.image.src = "images/nehe-specular.gif";
    }



    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();


    //helper
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

    var earthAngle = 180;

    var drawDetails =
        {
            vertexNormalBuffer: 0,
            vertexTextureCoordBuffer: 0,
            vertexPositionBuffer: 0,
            vertexIndexBuffer: 0,
            colorMapTexture: 0,
            specularMapTexture: 0,
            translate: 0,
            rotations: [{
                degrees: 0,
                angle: 0
            }]
        };


    function drawSphere( drawDetails )
    {
        if ( !drawDetails.colorMapTexture.image.width || !drawDetails.specularMapTexture.image.width )
            return;

        mat4.identity( mvMatrix );
        mat4.translate( mvMatrix, drawDetails.translate );

        for ( var i = 0; i < drawDetails.rotations.length; i++ )
        {
            mat4.rotate( mvMatrix, degToRad( drawDetails.rotations[i].degrees ), drawDetails.rotations[i].angle );
        }

        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture( gl.TEXTURE_2D, drawDetails.colorMapTexture );
        gl.uniform1i( shaderProgram.colorMapSamplerUniform, 0 );

        gl.activeTexture( gl.TEXTURE1 );
        gl.bindTexture( gl.TEXTURE_2D, drawDetails.specularMapTexture );
        gl.uniform1i( shaderProgram.specularMapSamplerUniform, 1 );

        gl.bindBuffer( gl.ARRAY_BUFFER, drawDetails.vertexPositionBuffer );
        gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, drawDetails.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ARRAY_BUFFER, drawDetails.vertexTextureCoordBuffer );
        gl.vertexAttribPointer( shaderProgram.textureCoordAttribute, drawDetails.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ARRAY_BUFFER, drawDetails.vertexNormalBuffer );
        gl.vertexAttribPointer( shaderProgram.vertexNormalAttribute, drawDetails.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, drawDetails.vertexIndexBuffer );
        setMatrixUniforms();
        gl.drawElements( gl.TRIANGLES, drawDetails.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0 );
    }


    function drawCube( drawDetails )
    {

        mat4.identity( mvMatrix );
        mat4.translate( mvMatrix, drawDetails.translate );

        for ( var i = 0; i < drawDetails.rotations.length; i++ )
        {
            mat4.rotate( mvMatrix, degToRad( drawDetails.rotations[i].degrees ), drawDetails.rotations[i].angle );
        }

        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture( gl.TEXTURE_2D, textures.cube );
        gl.uniform1i( shaderProgram.colorMapSamplerUniform, 0 );

        gl.activeTexture( gl.TEXTURE1 );
        gl.bindTexture( gl.TEXTURE_2D, speculars.cube );
        gl.uniform1i( shaderProgram.specularMapSamplerUniform, 1 );

        gl.bindBuffer( gl.ARRAY_BUFFER, webgl_vertex.cube.vertexNormalBuffer );
        gl.vertexAttribPointer( shaderProgram.vertexNormalAttribute, webgl_vertex.cube.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ARRAY_BUFFER, webgl_vertex.cube.vertexPositionBuffer );
        gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, webgl_vertex.cube.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ARRAY_BUFFER, webgl_vertex.cube.vertexTextureCoordBuffer );
        gl.vertexAttribPointer( shaderProgram.textureCoordAttribute, webgl_vertex.cube.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0 );


        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, webgl_vertex.cube.vertexIndexBuffer );
        setMatrixUniforms();
        gl.drawElements( gl.TRIANGLES, webgl_vertex.cube.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0 );
    }

    function setupDraw()
    {
        gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        mat4.perspective( 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100000.0, pMatrix );

        var useColorMap = true;
        gl.uniform1i( shaderProgram.useColorMapUniform, useColorMap );

        var useSpecularMap = true;
        gl.uniform1i( shaderProgram.useSpecularMapUniform, useSpecularMap );

        var lighting = true;
        gl.uniform1i( shaderProgram.useLightingUniform, lighting );
        if ( lighting )
        {
            gl.uniform3f(
                shaderProgram.ambientColorUniform,
                parseFloat( .4 ),
                parseFloat( .4 ),
                parseFloat( .4 )
            );

            gl.uniform3f(
                shaderProgram.pointLightingLocationUniform,
                parseFloat( -100 ),
                parseFloat( 4 ),
                parseFloat( 0 )
            );

            gl.uniform3f(
                shaderProgram.pointLightingSpecularColorUniform,
                parseFloat( 3 ),
                parseFloat( 3 ),
                parseFloat( 3 )
            );

            gl.uniform3f(
                shaderProgram.pointLightingDiffuseColorUniform,
                parseFloat( .5 ),
                parseFloat( .5 ),
                parseFloat( .5 )
            );
        }
    }

    function drawScene()
    {
        setupDraw();

        drawCube( {
            vertexNormalBuffer: webgl_vertex.sphere.vertexNormalBuffer,
            vertexTextureCoordBuffer: webgl_vertex.sphere.vertexTextureCoordBuffer,
            vertexPositionBuffer: webgl_vertex.sphere.vertexPositionBuffer,
            vertexIndexBuffer: webgl_vertex.sphere.vertexIndexBuffer,
            colorMapTexture: textures.cube,
            specularMapTexture: speculars.earth,
            translate: [0, 0, -40],
            rotations: [{
                degrees: 23.4,
                angle: [1, 0, -1]
            }, {
                degrees: earthAngle,
                angle: [0, 1, 0]
            }]
        } );

        drawSphere( {
            vertexNormalBuffer: webgl_vertex.sphere.vertexNormalBuffer,
            vertexTextureCoordBuffer: webgl_vertex.sphere.vertexTextureCoordBuffer,
            vertexPositionBuffer: webgl_vertex.sphere.vertexPositionBuffer,
            vertexIndexBuffer: webgl_vertex.sphere.vertexIndexBuffer,
            colorMapTexture: textures.earth,
            specularMapTexture: speculars.earth,
            translate: [40, 0, -80],
            rotations: [{
                degrees: 23.4,
                angle: [1, 0, -1]
            }, {
                degrees: earthAngle,
                angle: [0, 1, 0]
            }]
        } );

        //drawSphere( {
        //    vertexNormalBuffer: webgl_vertex.sphere.vertexNormalBuffer,
        //    vertexTextureCoordBuffer: webgl_vertex.sphere.vertexTextureCoordBuffer,
        //    vertexPositionBuffer: webgl_vertex.sphere.vertexPositionBuffer,
        //    vertexIndexBuffer: webgl_vertex.sphere.vertexIndexBuffer,
        //    colorMapTexture: textures.earth,
        //    specularMapTexture: speculars.earth,
        //    translate: [-100, 0, -200],
        //    rotations: [{
        //        degrees: 23.4,
        //        angle: [1, 0, -1]
        //    }, {
        //        degrees: earthAngle,
        //        angle: [0, 1, 0]
        //    }]
        //} );

        //drawSphere( {
        //    vertexNormalBuffer: webgl_vertex.sphere.vertexNormalBuffer,
        //    vertexTextureCoordBuffer: webgl_vertex.sphere.vertexTextureCoordBuffer,
        //    vertexPositionBuffer: webgl_vertex.sphere.vertexPositionBuffer,
        //    vertexIndexBuffer: webgl_vertex.sphere.vertexIndexBuffer,
        //    colorMapTexture: textures.earth,
        //    specularMapTexture: speculars.earth,
        //    translate: [100, 0, -200],
        //    rotations: [{
        //        degrees: 23.4,
        //        angle: [1, 0, -1]
        //    }, {
        //        degrees: earthAngle,
        //        angle: [0, 1, 0]
        //    }]
        //} );


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

    
    var textures = {};
    var speculars = {};
    return {
        webGLStart: function ()
        {
            var canvas = document.getElementById( "center-canvas" );
            gl = webgl_gl_init.initGL( canvas );
            shaderProgram = webgl_gl_init.initShaders( shaderProgram );
            webgl_vertex.initBuffers( gl );


            webgl_textures.initTextureArray( gl,
                [{
                    name: "earth",
                    src: "images/earth.png"
                }, {
                    name: "earth",
                    src: "images/earth-specular.gif"
                }, {
                    name: "cube",
                    src: "images/nehe.gif"
                }, {
                    name: "cube",
                    src: "images/nehe-specular.gif"
                }],
                textures,speculars,
                function ()
                {
                    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
                    gl.enable( gl.DEPTH_TEST );

                    tick();

                } );

        }
    }

} );