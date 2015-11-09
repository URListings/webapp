module.exports = {
	dbClient : require('mongodb').MongoClient,
	mongoUrl : 'mongodb://csc210:csc210_rochester.edu@ds049104.mongolab.com:49104/ur_listings',
	dbCall : function (callback) {
		this.dbClient.connect(this.mongoUrl, function (err, db) {
			var result = {connect:false, value:''};
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
				result.connect = true;
				result.value = db;
				callback(result);
			}
		});
	}
};
