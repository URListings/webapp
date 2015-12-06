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
    				if(data.length < 10){
    					size = data.length;
    				}
    				var sale_info = [];
    				for (var i = 0; i < size; i++) {
    					sale_info.unshift(data[i]);
    				};
    				response.sale_info = sale_info;
    			}
    			else {
    				resonse.message = 'no post information';
    			}
    			db.close();
    			callback(response);
    		});
    	})
    },

	postSale : function(userData, callback){
		var response = {valid:false};
		this.client.dbCall(function (result) {
			var db = result.value;
			var userCol = db.collection('user');
			var count = userCol.find({_id:userData._id, pass:userData.pass, authenticate:1}).count(function(err, count) {
					if(count == 0) {
						response.message = 'Invalid user id or password';
						db.close();
						callback(response);
					}
					else{
						var saleCol = db.collection('sale');
						userData.create_date = new Date();
						userData.modified_date = new Date();
						userData.authenticate = 1;
						userData.userID = userData._id;
						delete userData._id;
						delete userData.pass;
						saleCol.insert(userData, function(err, data){
							if(err){
								response.message = 'Post failed.';
							}
							else {
								response.valid = true;
								response.message = 'Post successed.';
							}
							db.close();
							callback(response);
						});
						
					}
					
				});
		});
	},

};
