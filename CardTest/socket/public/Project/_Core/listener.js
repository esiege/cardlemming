
var listenFor = [];
var hitTimer = 0;
var hitTimerCap = 10;
var listener_BeginContact = [];
var listener_EndContact = [];
var listener_PostSolve = [];
var listener_PreSolve = [];
var listener_PreCheck = [];

var Listener = window.Listener = function ()
{
    var b2Listener = Box2D.Dynamics.b2ContactListener;

    //Add listeners for contact
    var listener = new b2Listener;

    listener.PreCheck = function (contact) {
        for (var i = 0; i < listener_PreCheck.length; i++) {
            var r = listener_PreCheck[i](contact);

            if (r)
            {
                return r;
            }

        }

    }

    listener.BeginContact = function (contact) {
        for (var i = 0; i < listener_BeginContact.length; i++) {
        	listener_BeginContact[i](contact);
	        console.log(contact);
        }
    }

    listener.EndContact = function ( contact )
    {
        for (var i = 0; i < listener_EndContact.length; i++) {
            listener_EndContact[i](contact);
        }
    }

    listener.PostSolve = function ( contact, impulse )
    {
        for (var i = 0; i < listener_PostSolve.length; i++) {
            listener_PostSolve[i](contact, impulse);
        }
    }

    listener.PreSolve = function ( contact, oldManifold )
    {
        for (var i = 0; i < listener_PreSolve.length; i++) {
            listener_PreSolve[i](contact, oldManifold);
        }
    }

    getBox().world.SetContactListener(listener);
};