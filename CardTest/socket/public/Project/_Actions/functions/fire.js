//'use strict';


//mouseLeftClickEvents[0] = function () {



//}


//actions.push(
//    {
//        name: 'fireRed',
//        func: function execute(rootScope, index, callback) {

//            rootScope.actionReadied.details = {
//                color: "red",
//                shape: "block",
//                x: 20,
//                y: 42,
//                vx: 60,
//                vy: 2,
//                density: 100,
//                tags:
//                    {
//                        objectType: 'action'
//                    }
//            };
//            rootScope.actionReadied.declaration = function (details, loaded) {
//                if (!loaded) {


//                }
//                if (loaded) {


//                }
//                //details.x = 100;
//            };
//            rootScope.actionReadied.callback = callback;

//            if (rootScope.actionReadied.targetLine == 'projectile')
//                rootScope.actionReadied.targetLine = null;
//            else
//                rootScope.actionReadied.targetLine = 'projectile';

//            //setInterval( function ()
//            //{
//            //    destroy_list.push( b.body );
//            //}, 100 );
//            //callback();
//        }
//    },
//    {
//        name: 'fireBlue',
//        func: function execute(rootScope, index, callback) {
//            new Body(
//                    {
//                        color: "blue",
//                        shape: "circle",
//                        x: 20,
//                        y: 42,
//                        vx: rootScope.actionReadied.details.vx,
//                        vy: rootScope.actionReadied.details.vy,
//                        tags:
//                            {
//                                objectType: 'action'
//                            }
//                    },
//                    function (details, loaded) {
//                        if (!loaded) {


//                        }
//                        if (loaded) {


//                        }
//                        //details.x = 100;
//                    });

//            callback();
//        }
//    },
//    {
//        name: 'fireGreen',
//        func: function execute(rootScope, index, callback) {
//            basicProjectileFunction(rootScope, index, callback, {
//                width: 30,
//                height: 50,
//                color: 'green',
//                speed: 2,
//                iterations: 90,
//                texturePath: "/images/actions/gray3.png"
//            })
//        }
//    }
//);


//var insertOrUpdateIntoImages = function (image) {
//    images.push(image);
//    return images.length - 1;
//}

//var basicProjectileFunction = function (rootScope, index, callback, attributes) {
//    //called from scope
//    var projectileObject = {};
//    projectileObject.index = index;
//    projectileObject.direction = getDirection(rootScope);
//    projectileObject.position = {};
//    projectileObject.image = {};

//    //canvas
//    projectileObject.texturePath = attributes.texturePath;
//    projectileObject.clipx = 0;
//    projectileObject.clipy = 0;
//    projectileObject.scale = 1;
//    projectileObject.flip = false;

//    ////un-canvas
//    //projectileObject.image.width = attributes.width;
//    //projectileObject.image.height = attributes.height;
//    //projectileObject.image.color = attributes.color;


//    projectileObject.position.x = rootScope.user.position.x + projectileObject.image.height / 2;
//    projectileObject.position.y = 100 - (rootScope.user.position.y + projectileObject.image.width / 2);

//    projectileObject.speed = attributes.speed;
//    projectileObject.iterations = attributes.iterations;
//    AI_projectile(projectileObject, function (result) {
//        //update projectile positions
//        projectileObject = result.projectile;


//        if (!result.projectile.endedNaturally) {
//            callback(projectileObject);
//        }
//        else {
//            //end effect
//            projectileObject = {};


//            projectileObject.dispose = true
//            callback(projectileObject);
//        }

//    });
//}

//var getDirection = function (rootScope) {
//    if (rootScope.user.position.x > rootScope.opponent.position.x)
//        return 1;
//    else
//        return -1;

//}