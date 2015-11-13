
var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2AABB = Box2D.Collision.b2AABB
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2Fixture = Box2D.Dynamics.b2Fixture
            , b2World = Box2D.Dynamics.b2World
            , b2MassData = Box2D.Collision.Shapes.b2MassData
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
            , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            , b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
            , b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef
;

var destroy_list = [];

var Box = function (element, details) {

    this.initialDetails = details;
    this.definitionDefaults = {
        gravity: new b2Vec2(0, 10),
        scale: 1,
        dtRemaining: 0,
        speed: 30,
        stepAmount: 1 / 60
    };

    // Set up the definition
    for (var k in this.definitionDefaults) {
        this[k] = details[k] || this.definitionDefaults[k];
    }

    this.world = new b2World(this.gravity, true);
    this.element = element;

    this.context = element.getContext(details.canvType);

    this.context.imageSmoothingEnabled = false;


    this.step = function ( rootScope, draw ) {
        this.dtRemaining += this.stepAmount * this.speed;
        while (this.dtRemaining > this.stepAmount) {
            this.dtRemaining -= this.stepAmount;
            this.world.Step(this.stepAmount,
            8, // velocity iterations
            3); // position iterations
        }
        if (this.debugDraw) {
            this.world.DrawDebugData();
        } else if (details.canvType == "2d") {
            var obj = this.world.GetBodyList();

            this.context.clearRect(0, 0, this.element.width, this.element.height);
            this.context.save();
            this.context.scale(this.scale, this.scale);

            if (draw)
                draw();

            var layers = {};

            while (obj) {
                var body = obj.GetUserData();

                if (body) {

                    if (body.details && body.details.layer) {
                        if (!layers[body.details.layer])
                            layers[body.details.layer] = [];

                        layers[body.details.layer].push(body);
                    }
                    else if (body.draw)
                        body.draw(this.context);

                    if (body.func)
                        body.func(body);
                }
                obj = obj.GetNext();
            }

            for (var layerNum in layers) {
                for (var i = 0; i < layers[layerNum].length; i++) {
                    layers[layerNum][i].draw(this.context);
                }
            }

            this.context.restore();
        }
        else {

            var obj = this.world.GetBodyList();


            if (draw)
                draw();

            var layers = {};

            while (obj) {
                var body = obj.GetUserData();

                if (body) {

                    if (body.details && body.details.layer) {
                        if (!layers[body.details.layer])
                            layers[body.details.layer] = [];

                        layers[body.details.layer].push(body);
                    }
                    else
                        body.draw(this.context);

                    if (body.func)
                        body.func(body);
                }
                obj = obj.GetNext();
            }

            for (var layerNum in layers) {
                for (var i = 0; i < layers[layerNum].length; i++) {
                    layers[layerNum][i].draw(this.context);
                }
            }
        }
    };
    this.debug = function () {
        this.debugDraw = new b2DebugDraw();
        this.debugDraw.SetSprite(this.context);
        this.debugDraw.SetDrawScale(this.scale);
        this.debugDraw.SetFillAlpha(0.3);
        this.debugDraw.SetLineThickness(1.0);
        this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(this.debugDraw);
    };
    this.drawTrajectory = function (rootScope) {
        if (!actionReadied.targetLine)
            return;

        if (actionReadied && actionReadied.name) {
            actionReadied.updateVariableDetails();

            var increment = actionReadied.targetLine.increment;
            var iterations = actionReadied.targetLine.iterations;


            var tp;
            var cap = iterations * increment;
            for (var i = 0; i < cap; i += increment) {
                var opacity = (1 - i / cap) / 16;
                var width = 2 - 2 * (i / cap);


                var r = i * actionReadied.targetLine.r.multi + actionReadied.targetLine.r.fixed;
                var g = i * actionReadied.targetLine.g.multi + actionReadied.targetLine.g.fixed;
                var b = i * actionReadied.targetLine.b.multi + actionReadied.targetLine.b.fixed;

                this.context.beginPath();
                this.context.lineWidth = width;
                this.context.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
                this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
                this.context.lineCap = 'round';

                if (i == 0)
                    this.context.moveTo(actionReadied.details.x, actionReadied.details.y);
                else
                    this.context.moveTo(tp.x, tp.y);

                tp = getTrajectoryPoint(new b2Vec2(actionReadied.details.x, actionReadied.details.y), new b2Vec2(actionReadied.details.vx, actionReadied.details.vy), i);
                this.context.lineTo(tp.x, tp.y);
                this.context.stroke();
            }
        }
    }


};

var box;

var getBox = function (canvasDomId) {
    if (!box)
        box = new Box(document.getElementById(name), canvasDetails);

    return box;

}

var initBox = function ( details) {
    var d;

    if(typeof details === 'undefined')
        console.error('box/canvas details are needed.  Ex. { gravity: new b2Vec2(0, 10), canvType: "webgl", canvId:"center-canvas" }')
    else
        d = details;

    box = new Box(document.getElementById(details.canvId), details);

    return box;
}



var getTrajectoryPoint = function (startingPosition, startingVelocity, n) {

    var stepVelocity = new b2Vec2(box.stepAmount * startingVelocity.x,
                                   box.stepAmount * startingVelocity.y);

    var stepGravity = new b2Vec2(box.stepAmount * box.stepAmount * box.world.m_gravity.x,
                                  box.stepAmount * box.stepAmount * box.world.m_gravity.y);

    var newPosition = new b2Vec2(startingPosition.x + n * stepVelocity.x + 0.5 * (n * n + n) * stepGravity.x,
                                  startingPosition.y + n * stepVelocity.y + 0.5 * (n * n + n) * stepGravity.y);

    return newPosition;
}
