demos.player = {};
demos.player.initWorld = function ( world )
{


	//var sd = new b2BoxDef();
	//var bd = new b2BodyDef();
	//bd.AddShape(sd);
	//sd.density = 1.0;
	//sd.friction = 0.5;
	//sd.extents.Set(10, 10);
	//var pos = {x:300, y:200};

	//var ground = world.GetGroundBody();
	//var colMap = true;


	//col = square( -10, -1, 18, 14 );
	//var body = demos.player.createSprite( world, pos.x, pos.y, col );
	//addSprite( 'testSprite/body.png', body.userData.sprites );
	//body.userData.showColMaps = colMap;
	//body = world.CreateBody( body );


	////jointDef = new b2RevoluteJointDef();
	////jointDef.anchorPoint.Set( 210, 50 );
	////jointDef.body1 = ground;
	////jointDef.body2 = body;
	////world.CreateJoint( jointDef );


	////col = square( -6, 12, 10, 3 );
	////var feet = demos.player.createSprite( world, pos.x, pos.y, col );
	////addSprite( 'testSprite/feet.png', feet.userData.sprites );
	////feet.userData.showColMaps = colMap;
	////feet = world.CreateBody( feet );

	////jointDef = new b2RevoluteJointDef();
	////jointDef.anchorPoint.Set( 210, 50 );
	////jointDef.body1 = ground;
	////jointDef.body2 = feet;
	////world.CreateJoint( jointDef );
    
	////col = square( -12, 2, 15, 6 );
	////var hands = demos.player.createSprite( world, pos.x, pos.y, col );
	////addSprite( 'testSprite/hands.png', hands.userData.sprites );
	////hands.userData.showColMaps = colMap;
	////hands = world.CreateBody( hands );

	////jointDef = new b2RevoluteJointDef();
	////jointDef.anchorPoint.Set( 210, 50 );
	////jointDef.body1 = ground;
	////jointDef.body2 = hands;
	////world.CreateJoint( jointDef );

	//col = square( -10, -16, 15, 16 );
	//var head = demos.player.createSprite( world, pos.x, pos.y, col );
	//addSprite( 'testSprite/head.png', head.userData.sprites );
	//head.userData.showColMaps = colMap;
	//head = world.CreateBody( head );

	////jointDef = new b2RevoluteJointDef();
	////jointDef.anchorPoint.Set( 210, 50 );
	////jointDef.body1 = ground;
	////jointDef.body2 = head;
	////world.CreateJoint( jointDef );



    ////create distance joint between b and c
	//distance_joint = new b2DistanceJointDef();
	//distance_joint.body1 = body;
	//distance_joint.body2 = head;
    ////connect the centers - center in local coordinate - relative to body is 0,0
	//distance_joint.localAnchor1 = new b2Vec2( 0, 0 );
	//distance_joint.localAnchor2 = new b2Vec2( 0, 0 );
    ////length of joint
	//distance_joint.length = 3;
	//distance_joint.collideConnected = true;

    ////add the joint to the world
	//world.CreateJoint( distance_joint );

}

function square(x ,y, w, h)
{
    return [
            [x, y]
        , [x + w, y]
        , [x + w, y + h]
        , [x, y + h]
    ];
}

demos.player.createSprite = function ( world, x, y, points, fixed )
{
    var polySd = new b2PolyDef();
    polySd.groupIndex = -1;


    if ( !fixed ) polySd.density = 1.0;
    polySd.vertexCount = points.length;
    for ( var i = 0; i < points.length; i++ )
    {
        polySd.vertices[i].Set( points[i][0], points[i][1] );
    }
    var polyBd = new b2BodyDef();

    polyBd.AddShape( polySd );
    polyBd.position.Set( x, y );

    polyBd.userData = {};
    polyBd.userData.sprites = [];

    
    return polyBd;
};
function addSprite( imgSrc, spriteList )
{
    var img = new Image();
    var index = spriteList.length;
    spriteList.push( {} );

    img.src = 'images/' + imgSrc;
    spriteList[index].image = img;
    
    img.onload = function ()
    {
        spriteList[index].loaded = true;
    }
}
demos.InitWorlds.push( demos.player.initWorld );


