module.exports = {
	client : require('./data'),
	deleteListing : function (user, listingId, callback) {
		response = {};
		this.client.dbCall(function (result) {
			var db = result.value;
			var col = db.collection('user');
			col.deleteOne({_id:listingId}, function(err, result) {
				if(err || result.deletedCount == 0) {
					response.message = 'Error in deleting file';
					response.valid = false;
				}                   
				db.close();
				callback(response);
			});
		});
	},


    edit : function(userData, callback){
        response = {valid:false};
        this.client.dbCall(function(result){
            var db = result.value;
            var col = db.collection('user');
            col.updateOne({_id:userData._id, pass:userData.pass, authenticate:1}, { $set:{fName:userData.fName, lName:userData.lName}}, function(err, info){
                if(err){
                    response.valid = false;
                } else {
                    response.valid = true;
                    response.fName = userData.fName;
                    response.lName = userData.lName;
                }
                db.close();
                callback(response);
            });
        });
    },


    getListings : function(user, callback){
    	response = {};
		response.data = [];
		this.client.dbCall(function (result) {
			var db = result.value;
			var col = db.collection('rooms');
			col.find({user:user}).toArray(function(err, info) {
				if(err) {
					response.message = 'please login';
					response.valid = false;
				} else {
					response.data = info;
                }                   
				db.close();
				callback(response);
			});
		});	
    
    },

	createEntry : function (roomData, user, callback) {
		response = this.validate(roomData);
		if(response.valid) {
			roomData.user = user;
			this.client.dbCall(function (result) {
				var db = result.value;
				var col = db.collection('rooms');
				var count = col.find({address:roomData.address, user:user}).count(function(err, count) {
					if(count > 0) {
						response.message = 'This location has already been added by you.';
						response.valid = false;
						db.close();
						callback(response);
					} else {
						roomData.create_date = new Date();
						roomData.modified_date = new Date();
						col.insert(roomData, function(err, data) {
							if(err) {
								response.valid = false;
								response.message = 'Error in creating room listing. Please try later';
							} else {
								response.message = 'Entry created successfully';
								roomData.id = data.insertedIds[0];
								response.data = roomData;
								delete roomData.create_date;
								delete roomData.modified_date;
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
	validate : function(roomData) {
		response = {};
		response.valid = false;
		response.message = '';
		if(roomData.address === '' || roomData.latlong === '') {
			response.message = 'Please enter a valid address';
		} else if(roomData.title === '') {
			response.message = 'Please enter a valid title';
		} else if(roomData.rent === '' || isNaN(roomData.rent)) {
			response.message = 'Please enter a valid rent value';
		} else {
			response.valid = true;
		}
		return response;
	}
};
