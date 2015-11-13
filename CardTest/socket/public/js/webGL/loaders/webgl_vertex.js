app.service( 'webgl_vertex', function ( webgl_primitives )
{

    var sphereDef = {
        vertexNormalBuffer: 0,
        vertexTextureCoordBuffer: 0,
        vertexPositionBuffer: 0,
        vertexIndexBuffer: 0,
    };
    var cubeDef = {
        vertexNormalBuffer: 0,
        vertexTextureCoordBuffer: 0,
        vertexPositionBuffer: 0,
        vertexIndexBuffer: 0,
    };

    return {
        initBuffers: function (gl)
        {
            webgl_primitives.initSphere( gl, sphereDef );
            webgl_primitives.initCube( gl, cubeDef );
        },
        cube: cubeDef,
        sphere: sphereDef,
    }


} );