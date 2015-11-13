
app.service('userFactory', function () {

	var user = { name: 'test' };


	return {
		user: user,
		baseModel: function() {
			return {
				id: user.id,
				userName: user.userName,
				password: null,
				email: null
			};
		},
		setUser: function (u) {
			user = u;
		},
		updateUser: function (u) {
			for (var attr in u)
			{
				user[attr] = u[attr];
			}
		}
	};


});