/**
 * Module dependencies.
 */

var express = require( 'express' );
var app = module.exports = express.createServer();

// Hook Socket.io into Express
var io = require( 'socket.io' ).listen( app );

var routes = require( './routes' ),
    room = require( './routes/CCTest/room.js' );
//  room = require('./routes/room.js'),
//  p_init = require('./routes/project/init.js'),
//  sql = require( './routes/SQL.js' );


// Configuration
app.configure( function ()
{
    app.set( 'views', __dirname + '/views' );
    app.set( 'view engine', 'jade' );
    app.set( 'view options', {
        layout: false
    } );
    app.use( express.bodyParser() );
    app.use( express.methodOverride() );
    app.use( express.static( __dirname + '/public' ) );
    app.use( app.router );
} );

app.configure( 'development', function ()
{
    app.use( express.errorHandler( { dumpExceptions: true, showStack: true } ) );
} );

app.configure( 'production', function ()
{
    app.use( express.errorHandler() );
} );

// Routes
app.get( '/', routes.index );
app.get( '/partials/:name', routes.partials );

// redirect all others to the index (HTML5 history)
app.get( '*', routes.index );

// Socket.io Communication
io.sockets.on('connection', room);
//io.sockets.on('connection', p_init);
//io.sockets.on( 'connection', sql );

// Start server
app.listen( 3000, function ()
{
    console.log( "Express server listening on port %d in %s mode", app.address().port, app.settings.env );
} );

function log( label, val )
{
    console.log( "\n_____________________________" );
    console.log( label + ":  " + val );
    console.log( "_____________________________\n" );
}
