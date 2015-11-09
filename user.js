module.exports = {
    client : require('./data'),
    query : function(userData, callback){
        response = {valid:true, message:'hello'};
        callback(response);
    },
    
    
}
