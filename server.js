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
  console.log(postBody);
  if(postBody.email != 'test@test.com') {
	  res.status(422).send('Fail');
  } else {
	  res.send('Success');  
  }
});

// READ profile data for a user
app.post('/profile/', function (req, res) {
  var nameToLookup = req.params[0]; // this matches the '*' part of '/users/*' above
  var postBody = req.body;
  login.authenticate(postBody);
  if(postBody.email != 'test@test.com') {
	  res.status(422).send('Epic Fail');
  } else {
	  res.send('Oyeeee');
  }
});


// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});