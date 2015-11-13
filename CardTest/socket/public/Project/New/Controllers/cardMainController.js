'use strict';

var canvasDetails = { gravity: new b2Vec2( 0, 0 ) };
var canvasInit;

function CardMainCtrl( $scope, $rootScope, socket, card_body ) {

    var b = card_body.init({x:1, y:1});

    canvasInit = true;
    beginUpdate( $rootScope );

}
