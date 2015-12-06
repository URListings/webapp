var express = require('express'); // required to support parsing of POST request bodies
var app = express();
var bodyParser = require('body-parser');
var login = require('./login');
var room = require('./room_server');
var sale = require('./sale_server');
var smtpTransport = login.getSMTPTransport(require('nodemailer'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('static'));

// CREATE a new user
// To test with curl, run:
app.post('/users', function (req, res) {
  var postBody = req.body;
  login.create(postBody, function(data, userData) {
	  res.json(data);
	  if(data.valid) {
		  var host = req.protocol + '://' + req.get('host');
		  login.sendConfirmationMail(userData, smtpTransport, host);
	  }
  });
});

// Autheticate a user
app.post('/profile/', function (req, res) {
  var postBody = req.body;
  login.authenticate(postBody, function(data) {
	if(data.valid) {
		data.message = '/welcome';
	}  
	res.json(data);
  });
});

app.get('/welcome',function(req,res){
  res.sendFile(__dirname + '/view/home.html');
});

app.get('/error',function(req,res){
  res.sendFile(__dirname + '/view/error.html');
});

app.get('/room',function(req,res){
  res.sendFile(__dirname + '/view/room.html');
});

app.post('/userRooms',function(req,res){
  var postBody = req.body;
  var user = postBody.user;
  room.createEntry(postBody, user, function(data) { 
	res.json(data);
  });
});

app.get('/userRooms',function(req,res){
  var user = req.query.user;
  var type = req.query.type;
  if(type === 'other') {
	room.getOtherListings(user, function(data) {
		res.json(data);
	}); 
  } else {
	room.getUserListings(user, function(data) {
		res.json(data);
	});  
  }
});

app.delete('/userRooms/*',function(req,res){
  id = req.params[0];
  var user = req.headers['user'];
  room.deleteListing(user, id, function(data) {
	res.json(data);
  });
});

app.put('/userRooms/*',function(req,res){
  var id = req.params[0];
  var postBody = req.body;
  var user = postBody.user;
  room.updateListings(id, user, postBody, function(data) {
	res.json(data);
  });
});

app.get('/confirm/',function(req, res){
  var token = req.query.token;
  var email = req.query.email;
  login.confirmToken(email, token, function(response) {
	 if(response.success) {
		 res.redirect('/');
	 } else {
		 res.redirect('/error');
	 }
  });
});

app.get('/account/',function(req, res){
    res.sendFile(__dirname + '/view/account.html');    
});

app.get('/sale/', function(req, res){
  res.sendFile(__dirname + '/view/sale.html');
});

app.get('/getSale/', function(req, res){
  sale.getSale(res, function(data){
    if(data.valid){

    }
    res.json(data);
  })
});

app.post('/postSale/', function(req, res){
  var post_body = req.body;
  sale.postSale(post_body, function(data){
    if(data.valid){

    }
    res.json(data);
  });
});

app.get('/sale/post/:tagId', function(req, res) {
  res.send("tagId is set to " + req.params.tagId);
});

app.post('/query/', function(req, res){
    var post_body = req.body;
    login.query(post_body, function(data){
        if(data.valid){
            
        }
        res.json(data);
    });
});

app.post('/Edit/', function(req, res){
    var post_body = req.body;
    login.edit(post_body, function(data){
        res.json(data);
    });
});

// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});
