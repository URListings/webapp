var express = require('express'); // required to support parsing of POST request bodies
var app = express();
var bodyParser = require('body-parser');
var login = require('./login');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('static'));

// CREATE a new user
// To test with curl, run:
app.post('/users', function (req, res) {
  var postBody = req.body;
  login.create(postBody, function(data) {
	  res.json(data);
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


// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});
