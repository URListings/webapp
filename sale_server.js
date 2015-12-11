module.exports = {
	client : require('./data'),

    getSale : function(userData, callback){
    	var response = {valid:false};
    	this.client.dbCall(function (result){
    		var db = result.value;
    		var col = db.collection('sale');
    		col.find({authenticate:1}).toArray(function(err, data) {
    			if(err){
    				response.message = 'no post information';
    			}
    			else if (data.length){
    				response.valid = true;
    				var size = 10;
    				if(data.length < 100){
    					size = data.length;
    				}
    				var sale_info = [];
    				for (var i = 0; i < size; i++) {
    					sale_info.unshift(data[i]);
    				};
    				response.sale_info = sale_info;
    			}
    			else {
    				response.message = 'no post information';
    			}
    			db.close();
    			callback(response);
    		});
    	})
    },

    deleteSale : function(userData, callback){
    	var response = {valid:false};
    	ObjectId = this.client.mongoId;
    	var oid = new ObjectId(userData._id);
    	this.client.dbCall(function (result) {
			var db = result.value;
			var col = db.collection('sale');
			col.deleteOne({_id:oid, userID:userData.user}, function(err, result) {
				if(err || result.deletedCount == 0) {
					response.message = 'Error in deleting sale post';
					response.valid = false;
				} else {
					response.message = 'Sale post removed successfully';
					response.valid = true;
				}                 
				db.close();
				callback(response);
			});
		});	

    },

    updateSale : function(userData, callback) {
    	console.log(userData);
    	var response = {valid:false};
    	ObjectId = this.client.mongoId;
    	var oid = new ObjectId(userData._id);
    	this.client.dbCall(function (result) {
    		var db = result.value;
    		var col = db.collection('sale');
    		var modified_date = new Date();
    		col.updateOne({_id:oid, userID:userData.user}, { $set:{_title:userData._title, 
    			_content:userData._content, modified_date:modified_date}}, function(err, info){
                if(err || info === 0){
                    response.valid = false;
                    response.message = 'Error in updating sale post';
                } else {
                    response.valid = true;
                    response.modified_date = modified_date;
                    response.message = 'Sale post updated successfully';
                    console.log('end');
                }
                db.close();
                callback(response);
            });
    	});
    },

    getSaleContent : function(userData, callback){
    	var response = {valid:false};
    	ObjectId = this.client.mongoId;
    	var oid = new ObjectId(userData._id);
    	this.client.dbCall(function (result){
    		var db = result.value;
    		var col = db.collection('sale');

    		col.find({_id:oid}).toArray(function(err, data) {
    			if(err){
    				response.message = 'error';
    			}
    			else if (data.length){
    				var d = data[0];
    				response.valid = true;
    				response.fName = d.fName;
    				response.lName = d.lName;
    				response._title = d._title;
    				response._content = d._content;
    				response.modified_date = d.modified_date;
    				response.message = "post content found";
    			}
    			else {
    				response.message = 'no post';
    			}
    			db.close();
    			callback(response);
    		});
    	})
    },

	createSale : function(userData, callback){
		var response = {valid:false};
		this.client.dbCall(function (result) {
			var db = result.value;
			var userCol = db.collection('user');
			userCol.find({_id:userData._id, pass:userData.pass, authenticate:1}).toArray(function(err, info) {
				if(err) {
					response.message = 'Invalid user id or password';
					db.close();
					callback(response);
				}
				else if (info.length){
					var saleCol = db.collection('sale');
					userData.create_date = new Date();
					userData.modified_date = new Date();
					userData.authenticate = 1;
					userData.userID = userData._id;
					userData.fName = info[0].fName;
					userData.lName = info[0].lName;
					delete userData._id;
					delete userData.pass;
					saleCol.insert(userData, function(err, data){
						if(err){
							response.message = 'Post failed.';
						}
						else {
							response.modified_date = userData.modified_date;
							response.valid = true;
							response.message = 'Post successed.';
						}
						db.close();
						callback(response);
					});
				}
				else {
					response.message = 'Invalid user id or password';
					db.close();
					callback(response);
				}
			});
		});
	},

};
