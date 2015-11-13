app.service( 'webgl_gl_init', function ()
{
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

    return {
        initGL: function ( canvas )
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
            return gl;
        },
        initShaders: function ( shaderProgram )
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

            return shaderProgram;
        }
    }
} );