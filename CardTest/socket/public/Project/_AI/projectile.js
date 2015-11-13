'use strict';

var AI_projectile = function (projectile, callback, iteration)
{
    //calculate projectile positions

    //definitions
    var updateSpeed = 15;
    projectile.type = 'projectile';

    if ( !iteration )
        iteration = 1;
    else
        iteration++;

    projectile.iteration = iteration;
    

    //calculations
    projectile.position.x+=projectile.speed;

    //set up collision map in server - init with player coords

    //socket emit, send x,y, and speed values, return if hit on collision map





    //iteration and callback
    if ( iteration < projectile.iterations )
    {
        setTimeout( function ()
        {
            AI_projectile( projectile, callback, iteration );
        }, updateSpeed );
    }
    else
    {
        projectile.endedNaturally = true;
    }
    callback( { projectile: projectile } );
};