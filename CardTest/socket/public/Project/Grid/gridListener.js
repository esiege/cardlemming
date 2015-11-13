
//listener.BeginContact = function ( contact )
//listener.EndContact = function ( contact )
//listener.PostSolve = function ( contact, impulse )
//listener.PreSolve = function ( contact, oldManifold )


var gridStyle = {};
gridStyle.strokeStyle = "rgba(100,100,100,.5)";
gridStyle.lineWidth = "2";


var getActiveItem = function (bodyA, bodyB, callback) {

    var itemBody;
    var spriteBody;

    if (bodyA.details.tags.objectType == "item" && bodyB.details.tags.objectType == "item") {
        //eventually item collision
        return { bypassCollision: true };
    }
    else if (bodyA.details.tags.objectType == "item" && bodyA.details.busy) {
        itemBody = bodyA;
        spriteBody = bodyB;
    }
    else if (bodyB.details.tags.objectType == "item" && bodyB.details.busy) {
        itemBody = bodyB;
        spriteBody = bodyA;

    } else
        return { bypassCollision: true };



    if (!spriteBody.details.parent)
        return callback(itemBody, spriteBody);
    else
        return { bypassCollision: true };


}

listener_PreCheck.push(function (contact) {
    var bodyA = contact.m_fixtureA.m_body.m_userData;
    var bodyB = contact.m_fixtureB.m_body.m_userData;

    var ret = getActiveItem(bodyA, bodyB, function (itemBody, spriteBody) {


        if (!spriteBody.details.contact || spriteBody.details.contact.state != "hit") {
        } else
            return { bypassCollision: true };
    });

    return ret;
});
listener_BeginContact.push(function (contact) {
    var bodyA = contact.m_fixtureA.m_body.m_userData;
    var bodyB = contact.m_fixtureB.m_body.m_userData;

    var ret = getActiveItem(bodyA, bodyB, function (itemBody, spriteBody) {

        if (!spriteBody.details.contact || spriteBody.details.contact.state != "hit") {

            spriteBody.details.contact = { state: "hit" };
            _.delay(function () {
                spriteBody.details.contact = { state: "idle" };
            },500)

            spriteBody.body.SetLinearVelocity(spriteBody.details.forward(-5));
            itemBody.body.SetLinearVelocity(itemBody.details.forward(0));
            itemBody.body.m_fixtureList.m_density = 1;
            itemBody.body.ResetMassData();


            _.delay(function () {
            	itemBody.body.m_fixtureList.m_density = 0.002;
            	itemBody.body.ResetMassData();
            }, 100)
        } 
    });

    return ret;
});

listener_EndContact.push(function (contact) {
    //var tagA = contact.m_fixtureA.m_body.m_userData.details.tag;
    //var tagB = contact.m_fixtureB.m_body.m_userData.details.tag;

    //if (tagB == "grid") {
    //    contact.m_fixtureB.m_body.m_userData.details.line.strokeStyle = gridStyle.strokeStyle;
    //    contact.m_fixtureB.m_body.m_userData.details.line.lineWidth = gridStyle.lineWidth;
    //}
});
listener_PreSolve.push(function (contact) {
    var bodyA = contact.m_fixtureA.m_body.m_userData;
    var bodyB = contact.m_fixtureB.m_body.m_userData;

    if (bodyA.details.groupIndex == bodyB.details.groupIndex && bodyA.details.groupIndex < 0)
        return;

    console.log("A: " + bodyA.details.name);
    console.log("B: " + bodyB.details.name);


});
