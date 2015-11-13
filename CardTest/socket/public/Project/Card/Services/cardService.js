'use strict';

app.service('cardService', function () {
	var activeCard = null;
	return {
		setActiveCard: function(card) {
			activeCard = card;
		},
		getActiveCard: function() {
			return activeCard;
		}
	}
});