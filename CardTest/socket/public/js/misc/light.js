// this two functions were promoted to be global
// to make firefoxs jit happy - URGH
function clamp( x, min, max )
{
    if ( x < min ) return min;
    if ( x > max ) return max - 1;
    return x;
}

// this is basically where the magic happens



//function normalmap( canvas, textures, normalmaps, specularity, shiny )
//{

//    if ( canvas.getContext == undefined )
//    {
//        document.write( 'unsupported browser' );
//        return;
//    }

//    var ctx = canvas.getContext( '2d' );

//    var normalData = null;
//    var textureData = null;

//    function getDataFromImage( img )
//    {
//        canvas.width = 800;
//        canvas.height = 800;
//        ctx.drawImage( img, 0, 0 );
//        return ctx.getImageData( 0, 0, img.width, img.height );
//    }

//    function loadImage( src, callback )
//    {
//        var img = document.createElement( 'img' );
//        img.onload = callback;
//        img.src = src;
//        return img;
//    }

//    var normals1 = [];
//    var textureData = [];


//    var normalsImg = [];

//    normalsImg[0] = loadImage( normalmaps[0], function ()
//    {
//        var data = getDataFromImage( normalsImg[0] ).data;
//        // precalculate the normals
//        for ( var i = 0; i < canvas.height * canvas.width * 4; i += 4 )
//        {
//            var nx = data[i];
//            // flip the y value
//            var ny = 255 - data[i + 1];
//            var nz = data[i + 2];

//            // normalize
//            var magInv = 1.0 / Math.sqrt( nx * nx + ny * ny + nz * nz );
//            nx *= magInv;
//            ny *= magInv;
//            nz *= magInv;

//            normals1.push( nx );
//            normals1.push( ny );
//            normals1.push( nz );
//        }


//    } );

//    var normals2 = [];


//    normalsImg[1] = loadImage( normalmaps[1], function ()
//    {
//        var data = getDataFromImage( normalsImg[1] ).data;
//        // precalculate the normals
//        for ( var i = 0; i < canvas.height * canvas.width * 4; i += 4 )
//        {
//            var nx = data[i];
//            // flip the y value
//            var ny = 255 - data[i + 1];
//            var nz = data[i + 2];

//            // normalize
//            var magInv = 1.0 / Math.sqrt( nx * nx + ny * ny + nz * nz );
//            nx *= magInv;
//            ny *= magInv;
//            nz *= magInv;

//            normals2.push( nx );
//            normals2.push( ny );
//            normals2.push( nz );
//        }

//    } );

//    var textureImg = [];
//    textureImg[0] = loadImage( textures[0], function ()
//    {
//        textureImg[1] = loadImage( textures[1], function ()
//        {
//        textureData[0] = getDataFromImage( textureImg[0] ).data;

//        } );
//    } );



//    //document.onmousemove = function ( e )
//    //{
//    //    drawLight( canvas, ctx, normals, textureData[0], shiny, specularity, e.clientX + 50, e.clientY + 50, 100 );
//    //}

//}
