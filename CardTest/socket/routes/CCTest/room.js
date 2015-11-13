
function log(label, val) {
	console.log("\n_____________________________");
	console.log(label + ":  ");
	console.log(val);
	console.log("_____________________________\n");
}

var rooms = {};
var usersConnectionList = [];

var setupNewPlayer = function (player) {
	player.hp = 100;
	player.mp = 100;
	player.stamina = 100;
	player.status = 'Engaged';

	player.position = {};
	player.position.y = 100;


	if (player.slot_id == 0)
		player.position.x = 100;
	else if (player.slot_id == 1)
		player.position.x = 300;

	return player;
}



module.exports = function (socket) {
	//io.sockets.in( 'room' ).emit( 'event_name', data )
	socket.on('login:joinRoom', function (data) {
		log('socket.on', 'login:joinRoom');

		var p_slot_id = 1;

		if (!rooms['room' + data.data.sid]) {
			rooms['room' + data.data.sid] = {};
			rooms['room' + data.data.sid].users = [];
			rooms['room' + data.data.sid].sid = data.data.sid;
			p_slot_id = 0;
		}

		if (!rooms['room' + data.data.sid].users[p_slot_id]) {
			rooms['room' + data.data.sid].users[p_slot_id] = data.data.user;
			rooms['room' + data.data.sid].users[p_slot_id].slot_id = p_slot_id;

			socket.join('room' + data.data.sid);
			rooms['room' + data.data.sid].users[p_slot_id] = setupNewPlayer(rooms['room' + data.data.sid].users[p_slot_id]);
		}


		if (rooms['room' + data.data.sid].users.length == 2) {

			var o_slot_id = 1;
			if (p_slot_id == 1)
				o_slot_id = 0;

			socket.in('room' + data.data.sid).emit('login:connectRoom', { room: rooms['room' + data.data.sid], localPos: p_slot_id, opponentPos: o_slot_id, status: "Engaged" });
			socket.in('room' + data.data.sid).broadcast.emit('login:connectRoom', { room: rooms['room' + data.data.sid], localPos: o_slot_id, opponentPos: p_slot_id, status: "Engaged" });
		}
	});


	
	socket.on('grid:sendFunctionCallToServer', function (data) {
		var session = data.data.session;

		var room = rooms['room' + session.sid];
		if (room) {
			var user = room.users[session.localPos];

			socket.in('room' + session.sid).broadcast.emit('grid:getFunctionCallFromServer', data);
			//socket.emit('grid:getFunctionCallFromServer', user);
		}
		else {
			log('room ' + session.sid + ' not found, possible rooms:', rooms);
		}

	});

	socket.on('grid:getUserFromServer', function (data) {
		var room = rooms['room' + data.data.sid];
		if (room) {
			var user = room.users[data.data.localPos];

			socket.emit('grid:getUserFromServer', user);
			socket.in('room' + data.data.sid).broadcast.emit('grid:sendUserFromServer', user);
		}
		else {
			log('room ' + data.data.sid + ' not found, possible rooms:', rooms);
		}
	});

	socket.on('grid:syncLocalDataInterval', function (data) {
		log("syncLocalDataInterval", data);

		var room = rooms['room' + data.data.sid];
		if (room) {
			room.users[data.data.localPos] = data.data.user;
			var user = room.users[data.data.localPos];

			socket.in('room' + data.data.sid).broadcast.emit('grid:syncLocalDataInterval', user);
		}
		else {
			log('room ' + data.data.sid + ' not found, possible rooms:', rooms);
		}
	});
	


};