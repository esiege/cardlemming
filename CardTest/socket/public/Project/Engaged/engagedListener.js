
var listenFor = [];
var hitTimer = 0;
var hitTimerCap = 10;

var Listener = window.Listener = function ()
{
    var b2Listener = Box2D.Dynamics.b2ContactListener;

    //Add listeners for contact
    var listener = new b2Listener;

    listener.BeginContact = function ( contact )
    {
        for ( var i = 0; i < listenFor.length; i++ )
        {
            var targetBodyA = contact.m_fixtureB.m_body == listenFor[i].body;
            if ( contact.m_fixtureA.m_body == listenFor[i].body || contact.m_fixtureB.m_body == listenFor[i].body )
            {


                //#region targetLine
                var hitA = contact.m_fixtureA.m_body.m_userData.tags.objectType == 'targetLine';
                var hitB = contact.m_fixtureB.m_body.m_userData.tags.objectType == 'targetLine';

                var b;
                if ( hitA )
                    b = contact.m_fixtureA.m_body;
                if ( hitB )
                    b = contact.m_fixtureB.m_body;


                if ( b )
                {
                    b.m_userData.details.color.r = 255;
                }
                //#endregion


                //#region action hits opposite user
                var hitA = contact.m_fixtureA.m_body.m_userData.tags.objectType == 'action' && contact.m_fixtureB.m_body.m_userData.tags.objectType == 'target';
                var hitB = contact.m_fixtureB.m_body.m_userData.tags.objectType == 'action' && contact.m_fixtureA.m_body.m_userData.tags.objectType == 'target';
                if ( (hitA || hitB))
                {
                    hitTimer = hitTimerCap;

                    if ( targetBodyA )
                        destroy_list.push( contact.m_fixtureA.m_body );
                    else
                        destroy_list.push( contact.m_fixtureB.m_body );
                    console.log( contact.m_fixtureB.m_body );
                }
                //#endregion
            }
        }

    }

    listener.EndContact = function ( contact )
    {
    }

    listener.PostSolve = function ( contact, impulse )
    {
    }

    listener.PreSolve = function ( contact, oldManifold )
    {
    }

    getBox().world.SetContactListener(listener);
};