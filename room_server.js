module.exports = {
	client : require('./data'),
	deleteListing : function (user, listingId, callback) {
		response = {};
		ObjectId = this.client.mongoId;
		var oid = new ObjectId(listingId);
		this.client.dbCall(function (result) {
			var db = result.value;
			var col = db.collection('rooms');
			col.deleteOne({_id:oid}, function(err, result) {
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
	},


    updateListings : function(user, data, callback){
		response = this.validate(data);
		if(response.valid) {
			data.user = user;
			ObjectId = this.client.mongoId;
			var oid = new ObjectId(data._id);
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
						}
						db.close();
						callback(response);
				});		
			});
		} else {
			callback(response);
		}
    },


    getListings : function(user, callback){
    	response = {};
		response.data = [];
		this.client.dbCall(function (result) {
			var db = result.value;
			var col = db.collection('rooms');
			col.find({user:user}).toArray(function(err, info) {
				if(err) {
					response.message = '';
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
