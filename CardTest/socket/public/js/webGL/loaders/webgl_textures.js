app.service( 'webgl_textures', function ( webgl_primitives )
{
    return {
        initTextureArray: function ( gl, texArray, textures, speculars, callback )
        {
            var textureLoadCount = 0;
            for ( var i = 0; i < texArray.length; i++ )
            {
                if ( texArray[i].src.indexOf( "specular" ) > -1 )
                {
                    textureLoadCount++;
                    this.initTexture( gl, texArray[i], speculars, function ()
                    {
                        textureLoadCount--;
                        if ( textureLoadCount == 0 )
                            callback();
                    } );
                }
                else
                {
                    textureLoadCount++;
                    this.initTexture( gl, texArray[i], textures, function ()
                    {
                        textureLoadCount--;
                        if ( textureLoadCount == 0 )
                            callback();
                    } );
                }
            }
        },
        initTexture: function ( gl, details, textures, callback )
        {
            textures[details.name] = gl.createTexture();
            textures[details.name].image = new Image();
            textures[details.name].image.onload = function ()
            {
                handleLoadedTexture( textures[details.name], gl, function ()
                {
                    callback();
                } );
            }
            textures[details.name].image.src = details.src;
        }
    }

    function handleLoadedTexture( texture, gl, callback )
    {
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.bindTexture( gl.TEXTURE_2D, null );
        callback();
    }
} );