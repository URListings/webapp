module.exports = {
    client : require('./data'),
    query : function(userData, callback){
        response = {valid:true, message:'hello'};
        callback(response);
    },

    que : function(userData, callback){
        console.log('start query');
        response = {valid:true, id:'null', message:'Hello'};
        this.client.dbCall(function(result){
            var db = result.value;
            var col = db.collection('user');
            console.log('1');
            console.log(userData._id + userData.pass);
            col.find({_id:'jxu45@ur.rochester.edu', pass:'123456', authenticate:1}).count(function(err, res){
                console.log('2');
                if(err){
                    console.log('error');
                    response.valid = false;
                    response.message = 'err';
                } else if (res != 0){
                    console.log('found', res);
                    response.message = 'found';
                } else {
                    console.log('else');
                    response.valid = false;
                    response.message = 'No information found';
                }
                console.log('3');
                db.close();
                callback(response);
            });
            db.close();
        });
    }
    
}
