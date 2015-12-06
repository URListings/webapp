module.exports = {
	client : require('./data'),
	deleteListing : function (user, listingId, callback) {
		response = {valid:true, message:''};
		this.validateUser(response, user);
		if(response.valid) {
			ObjectId = this.client.mongoId;
			var oid = new ObjectId(listingId);
			this.client.dbCall(function (result) {
				var db = result.value;
				var col = db.collection('rooms');
				col.deleteOne({_id:oid, user:user}, function(err, result) {
					if(err || result.deletedCount == 0) {
						response.message = 'Error in deleting listing';
						response.valid = false;
					} else {
						response.message = 'Listing removed successfully';
						response.valid = true;
					}                 
					db.close();
					callback(response);
				});
			});	
		} else {
			callback(response);
		}
	},
    updateListings : function(id, user, data, callback){
		response = this.validate(data, user);
		if(response.valid) {
			data.user = user;
			ObjectId = this.client.mongoId;
			var oid = new ObjectId(id);
			this.client.dbCall(function (result) {
				var db = result.value;
				var col = db.collection('rooms');
				col.updateOne({_id:oid, user:user}, {$set:{title:data.title, address:data.address, latlong:data.latlong, rent:data.rent
				, description:data.description, amenities:data.amenities, rent_in:data.rent_in, modified_date: new Date()}}, 
					function(err, numRows){
						if(err || numRows === 0){
							response.valid = false;
							response.message('Error in updating the lisitng')
						} else {
							response.valid = true;
							response.data = data;
							response.message = 'Listing updated successfully'
						}
						db.close();
						callback(response);
				});		
			});
		} else {
			callback(response);
		}
    },

    getUserListings : function(user, callback){
    	response = {valid:true, message:''};
		this.validateUser(response, user);
		if(response.valid) {
			this.client.dbCall(function (result) {
				var db = result.value;
				var col = db.collection('rooms');
				col.find({user:user}).sort({modified_date:-1}).toArray(function(err, info) {
					if(err) {
						response.message = 'Error in getting data';
						response.valid = false;
					} else {
						response.data = info;
					}                   
					db.close();
					callback(response);
				});
			});	
		} else {
			callback(response);
		}   
    },
	
	getOtherListings : function(user, callback){
    	response = {};
		response.data = [];
		this.client.dbCall(function (result) {
			var db = result.value;
			var col = db.collection('rooms');
		col.find({user:{$ne:user}}).sort({rent:1}).toArray(function(err, info) {
				if(err) {
					response.message = 'Error in getting data';
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
		response = this.validate(roomData, user);
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
						delete roomData._id;
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
	validate : function(roomData, user) {
		response = {};
		response.valid = false;
		response.message = '';
		if(roomData.address === '' || roomData.latlong === undefined) {
			response.message = 'Please enter a valid address';
		} else if(roomData.title === '') {
			response.message = 'Please enter a valid title';
		} else if(roomData.rent === '' || isNaN(roomData.rent)) {
			response.message = 'Please enter a valid rent value';
		} else {
			response.valid = true;
		}
		this.validateUser(response, user);
		return response;
	},
	validateUser: function(response, user) {
		if(user === '' || user === undefined) {
			response.message = 'The user session is not valid';
			response.valid = false;
		}
	}
};
