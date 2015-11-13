var Body = window.Body = function (details, declaration) {

    this.details = details || {};

    if (declaration)
        this.details = declaration(details, false);

    this.defaults = {
        shape: "block",
        width: 5,
        height: 5,
        radius: 2.5
    };

    this.fixtureDefaults = {
        density: 2,
        friction: 1,
        restitution: 0.2,
        isSensor: false
    };

    this.filterDefaults = {
        categoryBits: 1,
        groupIndex: 0,
        maskBits: 65535
    };

    this.definitionDefaults = {
        active: true,
        allowSleep: true,
        angle: 0,
        angularVelocity: 0,
        awake: true,
        bullet: false,
        fixedRotation: false,
        linearDamping: 0,
        angularDamping: 0
    };



    // Create the definition
    this.definition = new b2BodyDef();

    // Set up the definition
    for (var k in this.definitionDefaults) {
        this.definition[k] = details[k] || this.definitionDefaults[k];
    }
    this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
    this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
    this.definition.userData = this;
    this.definition.userData.tags = details.tags || {};
    this.definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

    // Create the Body
    this.body = getBox().world.CreateBody(this.definition);

    // Create the fixture
    this.fixtureDef = new b2FixtureDef();
    for (var l in this.fixtureDefaults) {
        this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
    }
    for (var l in this.filterDefaults) {
        this.fixtureDef.filter[l] = details[l] || this.filterDefaults[l];
    }
    this.draw = function (context) {
        if (typeof this.body.m_userData.details.visible == "function")
            if (this.body.m_userData.details.visible() == false)
                return;

        if (details.canvas.initialDetails.canvType == "webgl") {
            if (!details.image || (details.image && details.img))
                sendBodyToDraw(this);
        }
        else {
            if (this.details.color || this.details.line) {

                var pos = this.body.GetPosition(),
                    angle = this.body.GetAngle();


                context.save();

                context.translate(pos.x, pos.y);
                context.rotate(angle);

                if (this.details.color)
                    if (this.details.color.r != undefined) {
                        if (this.details.color.r != undefined && this.details.color.g != undefined && this.details.color.b != undefined && this.details.color.a == undefined)
                            context.fillStyle = "rgba(  " + this.details.color.r + ", " + this.details.color.g + ", " + this.details.color.b + " )";
                        else if (this.details.color.r != undefined && this.details.color.g != undefined && this.details.color.b != undefined && this.details.color.a != undefined)
                            context.fillStyle = "rgba(  " + this.details.color.r + ", " + this.details.color.g + ", " + this.details.color.b + ", " + this.details.color.a + " )";
                    }
                    else
                        context.fillStyle = this.details.color;

                switch (this.details.shape) {
                    case "circle":
                        context.beginPath();
                        context.arc(0, 0, this.details.radius, 0, Math.PI * 2);
                        context.fill();
                        break;
                    case "polygon":

                        var points = this.details.points;
                        context.beginPath();

                        context.moveTo(points[0].x, points[0].y);
                        for (var i = 1; i < points.length; i++) {
                            context.lineTo(points[i].x, points[i].y);
                        }

                        if (this.details.color)
                            context.fill();


                        if (this.details.line) {
                            context.lineTo(points[0].x, points[0].y);
                        }

                        break;
                    case "block":
                        context.fillRect(-this.details.width / 2, -this.details.height / 2,
                        this.details.width,
                        this.details.height);
                    default:
                        break;
                }
            }


            if (this.details.line) {
                context.lineWidth = this.details.line.lineWidth;
                context.strokeStyle = this.details.line.strokeStyle;
                context.stroke();
            }

            context.restore();
        }
    };

    details.shape = details.shape || this.defaults.shape;

    switch (details.shape) {
        case "circle":
            details.radius = details.radius || this.defaults.radius;
            this.fixtureDef.shape = new b2CircleShape(details.radius);
            break;
        case "polygon":
            this.fixtureDef.shape = new b2PolygonShape();
            this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
            break;
        case "block":
        default:
            details.width = details.width || this.defaults.width;
            details.height = details.height || this.defaults.height;

            this.fixtureDef.shape = new b2PolygonShape();
            this.fixtureDef.shape.SetAsBox(details.width / 2,
            details.height / 2);
            break;
    }

    this.body.CreateFixture(this.fixtureDef);

    this.destroy = function () {
        if (this.body.m_userData.details.destroyEvent)
            this.body.m_userData.details.destroyEvent(this.body);

        destroy_list.push(this.body);

        for (var obj in this) {
            delete this[obj];
        }

        delete this;
    }

    if (this.details.destroyIn) {
        setTimeout(function () {


        }, 100);
    }


    //various helper functions
    this.addForce = function (dir, amount) {
        var impulse = { x: dir.x || 0, y: dir.y || 0 };

        var vel = this.body.GetLinearVelocity();

        impulse.x *= amount;
        impulse.y *= amount;

        this.body.ApplyImpulse(impulse, this.body.GetWorldCenter());
    }
    //various helper functions
    this.setForce = function (val) {
        this.body.SetLinearVelocity(val);
    }

    this.addPos = function (pos) {
        if (pos.x || pos.y) {
            pos.x += this.body.m_xf.position.x;
            pos.y += this.body.m_xf.position.y;
            this.body.SetPosition(pos);
        }
    }

    this.setPos = function (pos) {
        this.body.SetPosition(pos);
    }

    this.getPos = function () {
        return this.body.m_xf.position;
    }

    this.addRotation = function (deg) {
        this.body.SetAngularVelocity(this.body.m_angularVelocity + deg);
    }
    this.setRotation = function (deg) {
        this.body.SetAngularVelocity(deg);
    }
    this.setAngle = function (deg) {
        this.body.SetAngle(deg);
    }
    this.getAngle = function () {
        return this.body.m_sweep.a;
    }
    this.setCenter = function (pos) {
        this.body.m_sweep.localCenter = pos;
    }

    this.disableCollision = function () {
        this.details.disabledMaskBits = String(this.body.m_fixtureList.m_filter.maskBits);
        this.body.m_fixtureList.m_filter.maskBits = 0x0000;
    }

    this.enableCollision = function () {
        if (this.details.disabledMaskBits)
            this.body.m_fixtureList.m_filter.maskBits = String(this.details.disabledMaskBits);
        else
            this.body.m_fixtureList.m_filter.maskBits = 65535;
    }


    if (declaration && declaration.postLoad)
        this.postLoad = declaration(details, true);

};

var loadedImages = {};
//function mkImage( src )
//{
//    if ( loadedImages[src] )
//        return loadedImages[src];
//    else
//    {
//        var i = document.createElement( "IMG" );
//        i.setAttribute( "src", src );
//        loadedImages[src] = i;
//        return i;
//    }
//}
var absolutePath = function (href) {
    var link = document.createElement("a");
    link.href = href;
    return (link.protocol + "//" + link.host + link.pathname + link.search + link.hash);
}