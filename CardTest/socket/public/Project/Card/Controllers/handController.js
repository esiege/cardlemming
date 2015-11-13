'use strict';

var canvasDetails = { gravity: new b2Vec2(0, 0), canvType: "2d", canvId: "center-canvas" };
var canvasInit;

function CardMainCtrl($scope, $rootScope, socket, canvasService, cardService, roomService, card_body, three_draw)
{
	var c = canvasService.init(canvasDetails);
	Listener();
	var m = new Body({ canvas: c });

	//card obj
	var b_card1 = card_body.init({
		x: 100, y: 100, width: 100, height: 100,
		color: 'green',
		name: 'b_card1',
		canvas: c,
		isSensor: true,
		activeSpot: null,
		clickFunction: [
			function (b) {
				cardService.setActiveCard(b);
				b.body.details.mouseJoint = new Joint(m, b, { type: "mouse" });
			}
		],
		releaseFunction: [
			function (b, outOfBounds)
			{
				if (outOfBounds || !b.body.details.activeSpot) {
					cardService.setActiveCard(null);
					b.body.setPos({ x: b.body.details.x, y: b.body.details.y });
				} else {
					var placedSpot = b.body.details.activeSpot;
					box.world.DestroyBody(b.body.body);

					//placed obj
					var placed = card_body.init({
						x: placedSpot.x,
						y: placedSpot.y,
						z:1,
						width: 100,
						height: 400,
						color: 'blue',
						name: 'placed1',
						canvas: c,
						isSensor: true
					});

					roomService.addPingFunction(placed, function(body, iteration) {

						var spawn = card_body.init({
							x: body.x,
							y: body.y,
							z: 1,
							width: 100,
							height: 200,
							color: 'orange',
							name: 'spawn'+iteration,
							canvas: c,
							spawner: body
						});

						updateFunctions.push({
							execute: function (spawn, param2) {
								spawn.body.setForce({ x: 5, y: 0 });
							},
							param1: spawn,
							param2: null
						});
					});

				}
			}
		],
		cardPlayed: function () {

		}
	});
	var b_card2 = card_body.init({
		x: 220, y: 100, width: 100, height: 100,
		color: 'rgb(0,1,0)',
		name: 'b_card2',
		canvas: c,
		isSensor: true,
		clickFunction: [
			function (b) {
				cardService.setActiveCard(b);
				b.body.details.mouseJoint = new Joint(m, b, { type: "mouse" });
			}
		],
		releaseFunction: [
			function (b) {
				cardService.setActiveCard(null);
				b.body.setPos({ x: b.body.details.x, y: b.body.details.y });
			}
		]
	});
	var b_card3 = card_body.init({
		x: 340, y: 100, width: 100, height: 100,
		color: 'purple',
		name: 'b_card3',
		canvas: c,
		isSensor: true,
		clickFunction: [
			function (b) {
				cardService.setActiveCard(b);
				b.body.details.mouseJoint = new Joint(m, b, { type: "mouse" });
			}
		],
		releaseFunction: [
			function (b) {
				cardService.setActiveCard(null);
				b.body.setPos({ x: b.body.details.x, y: b.body.details.y });
			}
		]
	});
	var b_card4 = card_body.init({
		x: 460, y: 100, width: 100, height: 100,
		color: 'green',
		name: 'b_card4',
		canvas: c,
		isSensor: true,
		clickFunction: [
			function (b) {
				cardService.setActiveCard(b);
				b.body.details.mouseJoint = new Joint(m, b, { type: "mouse" });
			}
		],
		releaseFunction: [
			function (b) {
				cardService.setActiveCard(null);
				b.body.setPos({ x: b.body.details.x, y: b.body.details.y });
			}
		]
	});

	var floortiles = [];
	for (var i = 1; i <= 11; i++) {

		//no center
		if (i === 6)
			i++;

		floortiles.push(card_body.init({
			x: 135 * i + 100, y: 930, z: -1,
			width: 80,
			height: 80,
			color: "gray",
			name: 'floor' + i,
			canvas: c,
			isSensor: true,
			hidden:true,
			hoverFunction: [
				function (b)
				{
					if (!cardService.getActiveCard())
						return;

					var mouseBody = cardService.getActiveCard().body;
					box.world.DestroyJoint(mouseBody.details.mouseJoint);
					mouseBody.body.SetPosition({ x: b.body.details.x, y: b.body.details.y });
					mouseBody.body.SetLinearVelocity({ x: 0, y: 0 });
					mouseBody.details.activeSpot = { x: b.body.details.x, y: b.body.details.y };
				}
			]
		}));
	}

	var b_mainfloor = card_body.init({
		x: 940, y: 1000, width: 1820, height: 39,
		color: 'blue',
		name: 'floor',
		canvas: c,
		type: 'static',
	});
	var b_lilguy = card_body.init({
		x: 300, y: 929, z: 1,
		name: "ambertest",
		color: 'red',
		canvas: c,
		image: "Project/Card/Content/ambertest.png",
		scale: 0.3,
		isSensor: true,
		clickFunction: [
			function (b)
			{
				b.body.details.mouseJoint = new Joint(m, b, { type: "mouse" });
			}
		]
	});
	var b_castle = card_body.init({
		x: 100, y: 892, z: 1,
		name: "castle",
		color: 'red',
		canvas: c,
		image: "Project/Card/Content/castle.png",
		scale: 0.3,
		isSensor: true,
		clickFunction: [
			function (b)
			{
				b.body.details.mouseJoint = new Joint(m, b, { type: "mouse" });
			}
		]
	});

	$scope.webGLStart = function () { three_draw.init(canvasService.getCanvas()); };
	canvasInit = true;
	beginUpdate($rootScope);

}




//var walls = [];
//for (var i = 1; i <= 4; i++)
//{		
//	walls.push(card_body.init({ x: 100 * i + 200, y: 970, width: 10, height: 60, type: "static", color: "rgb(0, 255, 0)" }))
//}
//for (var i = 6; i <= 9; i++)
//{
//	walls.push(card_body.init({ x: 100 * i + 200, y: 970, width: 10, height: 60, type: "static", color: "green" }))
//}


//var b_pivotPoint = card_body.init( { x: 960, y: 300, radius: 20, shape: "circle" } );
//var squiggle = card_body.init( { x: 300, y: 100, type: "static", objPath: "Project/Card/objJSON/bridgeBottom.json", texPath: "" } );
//var b_pivotPoint = card_body.init( { x: 960, y: 300, radius: 20, shape: "circle" } );
//var b_pivotPoint2 = card_body.init( { x: 950, y: 250, radius: 20, shape: "circle" } );