module.exports = {
	client : require('./data'),
	testVal : 'test',
	authenticate : function (userData) {
		console.log(this.testVal);
		var url = this.client.mongoUrl;
		this.client.dbCall(function (result) {
			console.log('Connection established to', url);
			var db = result.value;
			db.close();
		});
	}
};