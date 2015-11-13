
spriteObject = function (pos, size)
{
    var body =  {localBody: new b2BodyDef};
    body.localBody.linearDamping = 4.0;
    body.localBody.angularDamping = 2.0;

    body.localBody.type = b2Body.b2_dynamicBody;

    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(
         size.w
       , size.h
    );
    body.localBody.position = { x: pos.x, y: pos.y };
    
    body.localBody.userData = {};
    body.localBody.userData.sprites = [];
    body.localBody.userData.objectType = "player";

    body.worldBody = box.world.CreateBody( body.localBody ).CreateFixture( fixDef );

    return body;
};


function addSpriteImage(imgSrc, spriteList, imagePositionAdjust)
{
    var img = new Image();
    var index = spriteList.length;
    spriteList.push({});

    img.src = 'images/' + imgSrc;
    img.pos = imagePositionAdjust;
    spriteList[index].image = img;

    img.onload = function ()
    {
        spriteList[index].loaded = true;
    };
}

function drawSprite(sprite, body, context) {
    context.save();
    var i = sprite.image;
    var r = body.GetAngle();


    if (sprite.loaded) {

        context.translate( body.m_xf.position.x * 30, body.m_xf.position.y * 30 );
        context.rotate( r );
        context.drawImage(i, 0, 0, i.width / 2, i.height, -i.width / 4, -i.height / 2, i.width / 2, i.height);
    }

    context.restore();
}


//createSpriteOld = function ( world, x, y, points, fixed )
//{
//    var polySd = new b2PolyDef();
//    polySd.groupIndex = -1;


//    if ( !fixed ) polySd.density = 1.0;
//    polySd.vertexCount = points.length;
//    for ( var i = 0; i < points.length; i++ )
//    {
//        polySd.vertices[i].Set( points[i][0], points[i][1] );
//    }
//    var polyBd = new b2BodyDef();

//    polyBd.AddShape( polySd );
//    polyBd.position.Set( x, y );

//    polyBd.userData = {};
//    polyBd.userData.sprites = [];


//    return polyBd;
//};