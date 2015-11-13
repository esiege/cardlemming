'use strict';

app.service( 'webgl_primitives', function ()
{
    var det =
        {
            vertexNormalBuffer: 0,
            vertexTextureCoordBuffer: 0,
            vertexPositionBuffer: 0,
            vertexIndexBuffer: 0,
        }

    return {
        initSphere: function ( gl, details )
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

            details.vertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, details.vertexNormalBuffer );
            gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( normalData ), gl.STATIC_DRAW );
            details.vertexNormalBuffer.itemSize = 3;
            details.vertexNormalBuffer.numItems = normalData.length / 3;

            details.vertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, details.vertexTextureCoordBuffer );
            gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( textureCoordData ), gl.STATIC_DRAW );
            details.vertexTextureCoordBuffer.itemSize = 2;
            details.vertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

            details.vertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, details.vertexPositionBuffer );
            gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertexPositionData ), gl.STATIC_DRAW );
            details.vertexPositionBuffer.itemSize = 3;
            details.vertexPositionBuffer.numItems = vertexPositionData.length / 3;

            details.vertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, details.vertexIndexBuffer );
            gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indexData ), gl.STREAM_DRAW );
            details.vertexIndexBuffer.itemSize = 1;
            details.vertexIndexBuffer.numItems = indexData.length;
        },

        initCube: function ( gl, details )
        {
            details.vertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, details.vertexNormalBuffer );
            var normalCoords = [
            // Front
             0.0, 0.0, 1.0,
             0.0, 0.0, 1.0,
             0.0, 0.0, 1.0,
             0.0, 0.0, 1.0,

            // Back
             0.0, 0.0, -1.0,
             0.0, 0.0, -1.0,
             0.0, 0.0, -1.0,
             0.0, 0.0, -1.0,

            // Top
             0.0, 1.0, 0.0,
             0.0, 1.0, 0.0,
             0.0, 1.0, 0.0,
             0.0, 1.0, 0.0,

            // Bottom
             0.0, -1.0, 0.0,
             0.0, -1.0, 0.0,
             0.0, -1.0, 0.0,
             0.0, -1.0, 0.0,

            // Right
             1.0, 0.0, 0.0,
             1.0, 0.0, 0.0,
             1.0, 0.0, 0.0,
             1.0, 0.0, 0.0,

            // Left
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0
            ];
            gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( normalCoords ), gl.STATIC_DRAW );
            details.vertexNormalBuffer.itemSize = 3;
            details.vertexNormalBuffer.numItems = 24;

            details.vertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, details.vertexTextureCoordBuffer );
            var textureCoords = [
              // Front face
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,

              // Back face
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
              0.0, 0.0,

              // Top face
              0.0, 1.0,
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,

              // Bottom face
              1.0, 1.0,
              0.0, 1.0,
              0.0, 0.0,
              1.0, 0.0,

              // Right face
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
              0.0, 0.0,

              // Left face
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
            ];
            gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( textureCoords ), gl.STATIC_DRAW );
            details.vertexTextureCoordBuffer.itemSize = 2;
            details.vertexTextureCoordBuffer.numItems = 24;

            details.vertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, details.vertexPositionBuffer );
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
            details.vertexPositionBuffer.itemSize = 3;
            details.vertexPositionBuffer.numItems = 24;

            details.vertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, details.vertexIndexBuffer );
            var cubeVertexIndices = [
                0, 1, 2, 0, 2, 3,    // Front face
                4, 5, 6, 4, 6, 7,    // Back face
                8, 9, 10, 8, 10, 11,  // Top face
                12, 13, 14, 12, 14, 15, // Bottom face
                16, 17, 18, 16, 18, 19, // Right face
                20, 21, 22, 20, 22, 23  // Left face
            ];
            gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( cubeVertexIndices ), gl.STATIC_DRAW );
            details.vertexIndexBuffer.itemSize = 1;
            details.vertexIndexBuffer.numItems = 36;
        }
    }

} );