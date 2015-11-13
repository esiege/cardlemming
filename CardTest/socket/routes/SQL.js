var sql = require( 'node-sqlserver' );
var conn_str = "Driver={SQL Server Native Client 11.0};Server=(local);Database=Socket;Trusted_Connection={Yes}";
executeQuery('DELETE from ActiveUser');
var prefix = 'Socket.dbo.';
var sessionIdCounter = 0;

function log( label, val )
{

    console.log( "\n_____________________________" );
    console.log( label + ":  " + val );
    console.log( "_____________________________\n" );
}

function executeQuery( sqlString, callback )
{
    // Query with explicit connecztion
    sql.open( conn_str, function ( err, conn )
    {
        if ( err )
        {
            console.log( "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
            console.log( "Error opening:  " + conn_str );
            console.log( "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
            return;
        }
        sql.query( conn_str, sqlString, function ( err, results )
        {
            if ( err )
            {
                console.log( "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
                console.log( "Error executing:  " + sqlString );
                console.log( "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
                return;
            }
            console.log( "\nPerformed Query:  " + sqlString + "\n" );

            if (callback)
            callback( results );

        } );
    } );
}


module.exports = function ( socket )
{
    //#region simple call handlers
    //get account name
    onSocketCall_Select( 'account:getUserLogin', 'userAccounts', 'userName', 'data' );
    onSocketCall_Select( 'account:getUserLogin2', 'userAccounts', 'userName', 'data' );
    //create new user
    onSocketCall_Insert( 'account:addUserLogin', 'userAccounts' );

    //check login
    onSocketCall_Select('login:getUserFromActive', 'ActiveUser', 'userName', 'data');
    //add to logged in
    onSocketCall_Insert('login:addUserToActive', 'ActiveUser');
    //delete active user
    onSocketCall_Delete('login:removeUserFromActive', 'ActiveUser', '', 'data');
    //update active user
    onSocketCall_Update('login:updateActivePlayer1', 'ActiveUser');


    //check other active accounts for matching
    //onSocketCall_Select( 'account:getMatchingUsers', 'ActiveUser', 'userName', 'data' );

    //get session status
    onSocketCall_Select('login:getSessionStatus', 'ActiveUser', '*', 'data');

    //#endregion

    //#region complex call handlers
    onSocketCall_Function( 'login:getSessionId', function ( data )
    {

        //check for existing session ID
        //--------------------------------------------------
        var sql = "SELECT * FROM " + prefix + "ActiveUser WHERE userName != '" + data.data.userName + "' and status = 'Matching' and session_id is not NULL";
        executeAndCallbackSQLResults( sql, data, function ( data, results )
        {

            function addNewSession(callback)
            {
                sessionIdCounter++;
                socket.join( 'session ' + sessionIdCounter );

                var sql = "UPDATE " + prefix + "ActiveUser SET session_id = " + sessionIdCounter + " WHERE userName = '" + data.data.userName + "'";
                executeAndCallbackSQLResults( sql, data, function ( data, results )
                {
                    //new session id created
                    if ( callback )
                    callback();
                } );
            }
            function matchSession( player, callback )
            {
                var sql = "UPDATE " + prefix + "ActiveUser SET session_id = " + player.session_id + " WHERE userName = '" + data.data.userName + "'";
                executeAndCallbackSQLResults( sql, data, function ( data, results )
                {
                    //session id copied from other player

                    var sql = "UPDATE " + prefix + "ActiveUser SET status = 'Session Found' WHERE session_id = '" + player.session_id + "'";
                    executeAndCallbackSQLResults( sql, data, function ( data, results )
                    {
                        //set status to session found for session id
                        if ( callback )
                        callback();
                    } );
                } );
            }



            if ( results.length == 0)
            {
                //execute if no session ids are found
                //--------------------------------------------------
                addNewSession( function ()
                {
                    socket.emit( 'login:getSessionId', {
                        results: results
                    } );

                });
            }
            else
            {
                if ( results.length > 1 )
                {
                    //execute if multiple session ids are found
                    //--------------------------------------------------
                    matchSession( results[0], function ()
                    {
                        socket.emit('login:getSessionId', {
                            results: results[0]
                        } );
                    } );

                }
                else if ( results.length == 1 )
                {
                    //execute if single session id is found
                    //--------------------------------------------------
                    matchSession( results[0], function ()
                    {
                        socket.emit('login:getSessionId', {
                            results: results[0]
                        } );
                    } );

                }

            }


        });

    } );

    //#endregion

    //#region generic calls
    //need where value from data.username
    function onSocketCall_Select( emitCall, table, cols, where )
    {
        socket.on( emitCall, function ( data )
        {
            if ( table == 'data' )
                table = data.data.table;
            if ( cols == 'data' )
                cols = data.data.cols;
            if ( where == 'data' )
                where = data.data.where;


            var sql = "SELECT " + cols + " FROM " + prefix + table;
            if ( where )
                sql += " WHERE " + where;

            executeAndReturnSQLResults( emitCall, sql );


            if ( table == data.data.table )
                table = 'data';
            if ( cols == data.data.cols )
                cols = 'data';
            if ( where == data.data.where )
                where = 'data';
        } );
    }
    //need where value from data.username
    function onSocketCall_Delete( emitCall, table, cols, where )
    {
        socket.on( emitCall, function ( data )
        {
            if ( table == 'data' )
                table = data.data.table;
            if ( cols == 'data' )
                cols = data.data.cols;
            if ( where == 'data' )
                where = data.data.where;

            var sql = "DELETE " + cols + " FROM " + prefix + table;
            if ( where )
                sql += " WHERE " + where;

            executeAndReturnSQLResults( emitCall, sql );


            if ( table == data.data.table )
                table = 'data';
            if ( cols == data.data.cols )
                cols = 'data';
            if ( where == data.data.where )
                where = 'data';
        } );
    }
    function onSocketCall_Function( emitCall,  callback )
    {
        socket.on( emitCall, function ( data )
        {
            if ( callback )
            callback( data );
        } );
    }

    function onSocketCall_Insert( emitCall, table )
    {

        socket.on( emitCall, function ( recieve )
        {
            var sql = "INSERT INTO " + prefix + table + " (";
            var fieldNames = "";
            var fieldValues = "";

            for ( var attr in recieve.data )
            {
                fieldNames += attr + ",";
                fieldValues += "'" + recieve.data[attr] + "',";
            }

            sql += fieldNames.substring( 0, fieldNames.length - 1 ) + ") ";
            sql += "VALUES (";
            sql += fieldValues.substring( 0, fieldValues.length - 1 ) + ") ";



            executeAndReturnSQLResults( emitCall, sql );
        } );

    }

    function onSocketCall_Update( emitCall, table, where )
    {

        socket.on( emitCall, function ( recieve )
        {
            var sql = "UPDATE " + prefix + table + " SET";
            var fieldName = "";
            var fieldValue = "";

            for ( var attr in recieve.data )
            {
                if ( attr == 'where' )
                    break;

                fieldName = attr;
                fieldValue = "'" + recieve.data[attr] + "'";
                sql += " " + fieldName + " = " + fieldValue + ",";

            }

            sql = sql.substring( 0, sql.length - 1 );

            if ( recieve.data.where )
                sql += " WHERE " + recieve.data.where;

            executeAndReturnSQLResults( emitCall, sql );
        } );

    }
    function executeAndReturnSQLResults( emitCall, sql )
    {
        executeQuery( sql, function ( results )
        {
            socket.emit( emitCall, {
                results: results
            } );
        } );
    }
    function executeAndCallbackSQLResults( sql, data, callback )
    {
        executeQuery( sql, function ( results )
        {
            if ( callback )
            callback( data, results );
        } );
    }
    //#endregion 


};