'use strict';

app.service('roomService', function () {


	var pingFunctions = [];
	var iteration = 0;
	var pingAll = function () {
		iteration++;
		for (var i = 0; i < pingFunctions.length; i++) {
			if (pingFunctions[i].func)
				pingFunctions[i].func(pingFunctions[i].body, iteration);
		}
	};

	//client based ping --TODO: replace w/node
	window.setInterval(pingAll, 5000);

	return {
		addPingFunction: function(body, func) {
			pingFunctions.push({ body:body, func: func });
		},
		pingAll: pingAll,
		pingFunctions:pingFunctions
	}



});
