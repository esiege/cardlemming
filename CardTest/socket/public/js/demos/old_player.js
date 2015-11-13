'use strict';

/* Controllers */
var player = {};
var playerLocal = {};
var moveX = 0;
var moveY = 0;


function PlayerCtrl($scope, socket, update) {
    $scope.players = [];
    $scope.id = 0;

    var speed = 1.3;
    var newR = 0;
    var prevR = 0;
    var controllerInit = false;

    setInterval(function () {
        if (init) {
            if ( getMove() )
            {
                move( moveX * speed, moveY * speed );
            }
            else
            {
                playerLocal.state = "idle";
            }

            newR = (Math.atan2($scope.players[$scope.id].y - mouse.y, $scope.players[$scope.id].x - mouse.x)) * (180 / Math.PI);

            if (newR != prevR) {
                rotate(newR);

                prevR = newR;
            }


            $scope.$apply();
        }
    }, 10);




    function getMove()
    {
        var r = false;
        moveX = 0;
        moveY = 0;

        if ( key[keycode_left] || key[keycode_a] )
        {
            moveY = -speed / 2 * Math.sin(( player.r - 90 ) * ( Math.PI / 180 ) );
            moveX = -speed / 2 * Math.cos(( player.r - 90 ) * ( Math.PI / 180 ) );
            playerLocal.state = "sidestep";
            r = true;
        }

        if ( key[keycode_right] || key[keycode_d] )
        {
            moveY = -speed / 2 * Math.sin(( player.r + 90 ) * ( Math.PI / 180 ) );
            moveX = -speed / 2 * Math.cos(( player.r + 90 ) * ( Math.PI / 180 ) );
            playerLocal.state = "sidestep";
            r = true;
        }
        if ( key[keycode_up] || key[keycode_w] )
        {
            moveY = -speed * Math.sin( player.r * ( Math.PI / 180 ) );
            moveX = -speed * Math.cos( player.r * ( Math.PI / 180 ) );
            playerLocal.state = "walking";
            r = true;
        }
        if ( key[keycode_down] || key[keycode_s] )
        {
            moveY = speed/2 * Math.sin( player.r * ( Math.PI / 180 ) );
            moveX = speed / 2 * Math.cos( player.r * ( Math.PI / 180 ) );
            playerLocal.state = "backstep";
            r = true;
        }





        return r;
    }


    function move(x, y) {
        socket.emit('player:move', {
            x: x,
            y: y
        });
    }
    function rotate(r) {
        socket.emit('player:rotate', {
            r: r
        });
    }
    
    socket.emit('col:addOrUpdateCSM2', {
        id: $scope.id,
        
    });

    socket.on('player:init', function (data) {
        $scope.players = data.players;
        $scope.id = data.id;
        player = $scope.players[$scope.id];
        init = true;
    });

    socket.on('player:join', function (data) {
        $scope.players = data.players;
    });

    socket.on('player:update', function (data) {
        $scope.players = data.players;
        player = $scope.players[$scope.id];
    });

    socket.emit('player:update');
}
