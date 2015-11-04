module.exports = {
	client : require('./data'),
	authenticate : function (userData, callback) {
		response = this.validate(userData);
		if(response.valid) {
			this.client.dbCall(function (result) {
				var db = result.value;
				var col = db.collection('user');
				col.find({_id:userData._id, pass:userData.pass, authenticate:1}).count(function(err, count) {
					if(count == 0) {
						response.message = 'Invalid user id or password';
						response.valid = false;
					}
					db.close();
					callback(response);
				});
			});
		} else {
			callback(response);
		}
	},
	create : function (userData, callback) {
		response = this.validate(userData);
		if(response.valid) {
			this.client.dbCall(function (result) {
				var db = result.value;
				var col = db.collection('user');
				var count = col.find({_id:userData.email, pass:userData.pass}).count(function(err, count) {
					if(count > 0) {
					response.message = 'User email already exists';
					response.valid = false;
					db.close();
					callback(response);
					} else {
						userData.create_date = new Date();
						userData.modified_date = new Date();
						userData.authenticate = 0;
						delete userData.passC;
						col.insert(userData, function(err, data) {
							if(err) {
								response.valid = false;
								response.message = 'Error in creating user. Please try later';
							} else {
								response.message = 'User account created successfully';
							}
							db.close();
							callback(response);
						});
					}
				});			
			});
		} else {
			callback(response);
		}	
	},
	validate : function(userData) {
		response = {valid:true, message:''};
		if(this.containsEmpty(userData)) {
			response.valid = false;
			response.message = 'Please fill all mandatory fields';
		} else if(!this.isValidEmail(userData._id)) {
			response.valid = false;
			response.message = 'Invalid rochester.edu email';
		}
		return response;
	},
	containsEmpty :function(userData) {
		for(i in userData) {
			if(userData.i === '' || userData.i === undefined || userData.i === null) {
				return false;
			}
		}
	},
	isValidEmail:function(email) {
		if(email.indexOf('@') > 0 && email.indexOf('rochester.edu') > 0) {
			return true;
		}
		return false;
	}
};