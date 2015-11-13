'use strict';

app.service( 'engagedActionDefinitions', function ( $rootScope )
{

    //#region key command
    var keyedActions = new Array( 9 );
    var active = 0;

    this.keyPress = function ( keyCode )
    {
        if ( keyCode == keycode_1 && active != 1 ) { if ( keyedActions[1] ) { keyedActions[1](); active = 1; } }
        else if ( keyCode == keycode_2 && active != 2 ) { if ( keyedActions[2] ) { keyedActions[2](); active = 2; } }
        else if ( keyCode == keycode_3 && active != 3 ) { if ( keyedActions[3] ) { keyedActions[3](); active = 3; } }
        else if ( keyCode == keycode_4 && active != 4 ) { if ( keyedActions[4] ) { keyedActions[4](); active = 4; } }
        else if ( keyCode == keycode_5 && active != 5 ) { if ( keyedActions[5] ) { keyedActions[5](); active = 5; } }
        else if ( keyCode == keycode_6 && active != 6 ) { if ( keyedActions[6] ) { keyedActions[6](); active = 6; } }
        else if ( keyCode == keycode_7 && active != 7 ) { if ( keyedActions[7] ) { keyedActions[7](); active = 7; } }
        else if ( keyCode == keycode_8 && active != 8 ) { if ( keyedActions[8] ) { keyedActions[8](); active = 8; } }
    }
    //#endregion

    //#region inits
    var actions = {};
    var actionReadied = {};
    //#endregion


    actions.fire =
        {
            //#region Details
            //name (used in activeAction for ref)
            name: 'fire',
            //details for body
            details: {
                color: "gray",
                shape: "block",
                x: 20,
                y: 42,
                vx: 60,
                vy: 2,
                density: 100,
                destroyIn: 100,
                tags:
                    {
                        objectType: 'action'
                    }
            },
            //#endregion
            //#region Variable Details
            variableDetails: {},
            updateVariableDetails: function ()
            {
                //variable details done before the action takes place, passed to server
                //------------------------------------------------------------------------
                actionReadied.variableDetails.vy = ( 265 - mouse.y ) * -.5;


                //------------------------------------------------------------------------
                for ( var a in this.variableDetails )
                    this.details[a] = this.variableDetails[a];
            },
            //#endregion
            //#region Declaration
            //additional helper methods
            declaration: function ( details, loaded )
            {
                //prior to body creation
                if ( !loaded )
                {
                    //------------------------------------------------------------------------

                    //------------------------------------------------------------------------
                }
                //immediatly after body creation
                if ( loaded )
                {
                    //------------------------------------------------------------------------

                    //------------------------------------------------------------------------
                }
            },
            //#endregion
            //#region Target Line
            targetLine: {
                //target line vars - drawn in init
                //------------------------------------------------------------------------
                type: 'projectile',
                r: { fixed: 5, multi: 20 },
                g: { fixed: 0, multi: 0 },
                b: { fixed: 0, multi: 0 },
                increment: 1,
                iterations: 16
                //------------------------------------------------------------------------
            },
            //#endregion
            //#region Constants
            //copy to active action - constant
            setActiveAction: function ( callback )
            {
                actionReadied = this;
            },
            //action trigger on click - constant
            performAction: function ( remote_variableDetails, stepSyncDifference )
            {

                var det = this.details;

                for ( var a in remote_variableDetails )
                    this.details[a] = remote_variableDetails[a];

                if ( stepSyncDifference < 0 )
                {
                    var syncModifierPos = {};
                    syncModifierPos.x = this.details.x;
                    syncModifierPos.y = this.details.y;

                    var syncModifierVel = {};
                    syncModifierVel.x = this.details.vx;
                    syncModifierVel.y = this.details.vy;

                    var modifiedPos = getTrajectoryPoint( syncModifierPos, syncModifierVel, -stepSyncDifference );

                    this.details.x = modifiedPos.x;
                    this.details.y = modifiedPos.y;

                    new Body( this.details, this.declaration );

                    this.details.x = syncModifierPos.x;
                    this.details.y = syncModifierPos.y;

                }
                else
                {
                    new Body( this.details, this.declaration );

                }



                this.details = det;

            }
            //#endregion
        }
    actions.fire2 =
        {

            initAction: function execute( callback )
            {

                //mouseLeftClickEvents[0] = function () {
                //    new Body(actionReadied.details, actionReadied.declaration);
                //}

                actionReadied.name = 'fire2';
                actionReadied.details = {
                    color: "blue",
                    shape: "circle",
                    x: 20,
                    y: 42,
                    vx: 60,
                    vy: 2,
                    density: 100,
                    destroyIn: 100,
                    tags:
                        {
                            objectType: 'action'
                        }
                };

                actionReadied.declaration = function ( details, loaded )
                {
                    if ( !loaded )
                    {

                    }
                    if ( loaded )
                    {

                    }
                    //details.x = 100;
                };
                actionReadied.callback = callback;

                actionReadied.targetLine = {
                    type: 'projectile',
                    r: { fixed: 0, multi: 0 },
                    g: { fixed: 0, multi: 0 },
                    b: { fixed: 5, multi: 20 },
                    increment: 1,
                    iterations: 16
                };

            }

        }
    actions.fire3 =
        {
            initAction: function execute( callback )
            {

                //mouseLeftClickEvents[0] = function () {
                //    new Body(actionReadied.details, actionReadied.declaration);
                //}

                actionReadied.name = 'fire3';
                actionReadied.details = {
                    color: "green",
                    shape: "block",
                    height: 10,
                    width: 1,
                    x: 20,
                    y: 42,
                    vx: 60,
                    vy: 12,
                    angularVelocity: 13,
                    density: 100,
                    destroyIn: 100,
                    tags:
                        {
                            objectType: 'action'
                        }
                };

                actionReadied.declaration = function ( details, loaded )
                {
                    if ( !loaded )
                    {

                    }
                    if ( loaded )
                    {

                    }
                    //details.x = 100;
                };
                actionReadied.callback = callback;

                actionReadied.targetLine = {
                    type: 'projectile',
                    r: { fixed: 0, multi: 0 },
                    g: { fixed: 5, multi: 20 },
                    b: { fixed: 0, multi: 0 },
                    increment: 1,
                    iterations: 16
                };

            }
        }



    var insertOrUpdateIntoImages = function ( image )
    {
        images.push( image );
        return images.length - 1;
    }


} );