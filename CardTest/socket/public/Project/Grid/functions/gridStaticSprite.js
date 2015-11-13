'use strict';

app.service( 'grid_staticSprite', function ( $rootScope, grid_input, grid_swings, gridActionDefinitions )
{

    this.cr_object = function ( initDetails )
    {
        return new Body( {
            shape: initDetails.shape,
            color: initDetails.color,
            activity: "idle",
            image: initDetails.image,
            imgData: initDetails.imgData,
            name: initDetails.name,
            height: initDetails.height,
            width: initDetails.width,
            radius: initDetails.radius,
            x: initDetails.x,
            y: initDetails.y,
            vx: 0,
            vy: 0,
            density: 0,
            maskBits: initDetails.maskBits,
            rotation: initDetails.rotation,
            fixedRotation: true,
            staticBody: true,
            controllable: initDetails.controllable,
            groupIndex: initDetails.groupIndex,
            layer: initDetails.layer,
            update: initDetails.update,
            getUserRotVars: initDetails.getUserRotVars,
            destroyEvent: function ( body ) { gl_destroy( body ); },
            bindBody: [],
            tags: initDetails.tags,
            stats: initDetails.stats,
        } );
        if ( currentBody.details.update )
            currentBody.details.update();
    }
} );