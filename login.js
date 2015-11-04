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
				var count = col.find({_id:userData._id}).count(function(err, count) {
					if(count > 0) {
						response.message = 'User email already exists';
						response.valid = false;
						db.close();
						callback(response);
					} else {
						userData.create_date = new Date();
						userData.modified_date = new Date();
						userData.authenticate = 0;
						userData.token = '3433ccsxzdsiueresd';
						delete userData.passC;
						col.insert(userData, function(err, data) {
							if(err) {
								response.valid = false;
								response.message = 'Error in creating user. Please try later';
							} else {
								response.message = 'User account created successfully';
							}
							db.close();
							callback(response, userData);
						});
					}
				});			
			});
		} else {
			callback(response);
		}	
	},
	confirmToken : function(email, userToken, callback) {
		this.client.dbCall(function (result) {
			var db = result.value;
			var col = db.collection('user');
			col.findAndModify({_id: email, token:userToken}, [['_id','asc']], {$set: {authenticate: 1}}, {}, 
				function(err, object) {
					response = {success: true};
					if (err){
						response.success = false;
					}
					callback(response);
			});
		});
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
	sendConfirmationMail : function(userData, smtpTransport, host) {
		var body = 'Please go to this link to confirm email:\n' + host + '/confirm?token=' + userData.token+'&email='+userData._id;
		var mailOptions = this.generateMailOption(userData._id, 'URListing:Confirm account', body);
		this.sendMail(smtpTransport, mailOptions);
	},
	isValidEmail:function(email) {
		if(email.indexOf('@') > 0 && email.indexOf('rochester.edu') > 0) {
			return true;
		}
		return false;
	},
	generateMailOption:function(email, subject, body) {
		var mailOptions = {
			from: "URListings <donotreply@urlistings.com>", // sender address
			to: email,
			subject: subject,
			text: body
		}
		return mailOptions;
	},
	getSMTPTransport:function(nodemailer) {
		var smtpTransport = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: 'uorlistings@gmail.com',
				pass: 'csc210@ur.rochester.edu'
			}
		});
		return smtpTransport;
	},
	sendMail:function(smtpTransport, mailOptions) {
		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
			}
		// if you don't want to use this transport object anymore, uncomment following line
		//smtpTransport.close(); // shut down the connection pool, no more messages
		});
	}
};