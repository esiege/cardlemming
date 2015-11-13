app.service( 'engagedMain', function ( $rootScope )
{
    initBoard();
    var board = new Board();
    beginUpdate( $rootScope );
    var listen = new Listener();

    function init()
    {
        var centerCanvas;
        var centerContext;
        var texPack = '_simple';

        centerCanvas = document.getElementById( 'center-canvas' );

        if ( !centerCanvas )
            return;

        centerContext = centerCanvas.getContext( '2d' );

        window.addEventListener( 'resize', resizeCanvas, false );

        function resizeCanvas()
        {
            centerCanvas.width = 1200;
            centerCanvas.height = 200;
        }
        resizeCanvas();
        canvasInit = true;
    };
    function setup()
    {
        var user = new Body( {
            color: "lightgray",
            shape: "block",
            height: 11,
            x: 19,
            y: 44,
            vx: 0,
            vy: 0,
            density: .0002,
            fixedRotation: true,
            groupIndex: -1,
            tags:
                {
                    objectType: 'player'
                }
        } );

        var userBaseJoint = new Body( { type: "static", color: "yellow", shape: "block", height: 1, width: 1, x: 19, y: 50, vx: 0, vy: 0, density: 20 } );


        var opponent = new Body( {
            color: "lightgray",
            shape: "block",
            height: 11,
            x: 281,
            y: 44,
            vx: 0,
            vy: 0,
            density: .0002,
            fixedRotation: true,
            groupIndex: -1,
            tags:
                {
                    objectType: 'target'
                }
        } );
        var opponentBaseJoint = new Body( { type: "static", color: "yellow", shape: "block", height: 1, width: 1, x: 281, y: 50, vx: 0, vy: 0, density: 20 } );

        listenFor.push( user );
        listenFor.push( opponent );

        var j2 = new Joint( user, userBaseJoint, { type: "distance" } );
        var j2 = new Joint( opponent, opponentBaseJoint, { type: "distance" } );
    };

    function Board()
    {

        init();

        setup();

    }
} );