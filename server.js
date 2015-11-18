var express = require('express'); // required to support parsing of POST request bodies
var app = express();
var bodyParser = require('body-parser');
var login = require('./login');
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
})

app.post('/query/', function(req, res){
    var postBody = req.body;
    console.log('server, query');
    login.query(postBody, function(data){
        if(data.valid){
            
        }
        res.json(data);
    });
})

app.post('/Edit', function(req, res){
    var postBody = req.body;
    login.edit(postBody, function(data){
        res.json(data);
    });
});

// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});
