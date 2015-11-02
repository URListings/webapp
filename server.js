// Lectures 11 and 12 - CSC 210 Fall 2015
// Philip Guo

// This is the backend for the Fakebook web app, which demonstrates CRUD
// with Ajax using a REST API. (static_files/fakebook.html is the frontend)

// Prerequisites - first run:
//   npm install express
//   npm install body-parser
//
// then run:
//   node server.js
//
// and the frontend can be viewed at http://localhost:3000/fakebook.html

var express = require('express');
var app = express();

// required to support parsing of POST request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// put all of your static files (e.g., HTML, CSS, JS, JPG) in the static_files/
// sub-directory, and the server will serve them from there. e.g.,:
//
// http://localhost:3000/fakebook.html
// http://localhost:3000/cat.jpg
//
// will send the file static_files/cat.jpg to the user's Web browser
app.use(express.static('static'));


// simulates a database in memory, to make this example simple and
// self-contained (so that you don't need to set up a separate database).
// note that a real database will save its data to the hard drive so
// that they become persistent, but this fake database will be reset when
// this script restarts. however, as long as the script is running, this
// database can be modified at will.
var fakeDatabase = [
  {name: 'Philip', job: 'professor', pet: 'cat.jpg'},
  {name: 'Jane',   job: 'engineer',  pet: 'bear.jpg'},
  {name: 'John',   job: 'student',   pet: 'dog.jpg'}
];


// REST API as described in http://pgbovine.net/rest-web-api-basics.htm

/* Run through a full API test session with curl (commands typed after '$',
   outputs shown on the line below each command) ...

$ curl -X GET http://localhost:3000/users
["Philip","Jane","John"]

$ curl -X GET http://localhost:3000/users/Philip
{"name":"Philip","job":"professor","pet":"cat.jpg"}

$ curl -X PUT --data "job=bear_wrangler&pet=bear.jpg" http://localhost:3000/users/Philip
OK

$ curl -X GET http://localhost:3000/users/Philip
{"name":"Philip","job":"bear_wrangler","pet":"bear.jpg"}

$ curl -X DELETE http://localhost:3000/users/Philip
OK

$ curl -X GET http://localhost:3000/users/Philip
{}

$ curl -X GET http://localhost:3000/users
["Jane","John"]

$ curl -X POST --data "name=Carol&job=scientist&pet=dog.jpg" http://localhost:3000/users
OK

$ curl -X GET http://localhost:3000/users
["Jane","John","Carol"]

$ curl -X GET http://localhost:3000/users/Carol
{"name":"Carol","job":"scientist","pet":"dog.jpg"}

*/

// CREATE a new user
//
// To test with curl, run:
//   curl -X POST --data "name=Carol&job=scientist&pet=dog.jpg" http://localhost:3000/users
app.post('/users', function (req, res) {
  var postBody = req.body;
  var myName = postBody.name;

  // must have a name!
  if (!myName) {
    res.send('ERROR');
    return; // return early!
  }

  // check if user's name is already in database; if so, send an error
  for (var i = 0; i < fakeDatabase.length; i++) {
    var e = fakeDatabase[i];
    if (e.name == myName) {
      res.send('ERROR');
      return; // return early!
    }
  }

  // otherwise add the user to the database by pushing (appending)
  // postBody to the fakeDatabase list
  fakeDatabase.push(postBody);

  res.send('OK');
});


// READ profile data for a user
//
// To test with curl, run:
//   curl -X GET http://localhost:3000/users/Philip
//   curl -X GET http://localhost:3000/users/Jane
app.get('/users/*', function (req, res) {
  var nameToLookup = req.params[0]; // this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
  for (var i = 0; i < fakeDatabase.length; i++) {
    var e = fakeDatabase[i];
    if (e.name == nameToLookup) {
      res.send(e);
      return; // return early!
    }
  }

  res.send('{}'); // failed, so return an empty JSON object!
});


// READ a list of all usernames (note that there's no '*' at the end)
//
// To test with curl, run:
//   curl -X GET http://localhost:3000/users
app.get('/users', function (req, res) {
  var allUsernames = [];

  for (var i = 0; i < fakeDatabase.length; i++) {
    var e = fakeDatabase[i];
    allUsernames.push(e.name); // just record names
  }

  res.send(allUsernames);
});


// UPDATE a user's profile with the data given in POST
//
// To test with curl, run:
//   curl -X PUT --data "job=bear_wrangler&pet=bear.jpg" http://localhost:3000/users/Philip
app.put('/users/*', function (req, res) {
  var nameToLookup = req.params[0]; // this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
  for (var i = 0; i < fakeDatabase.length; i++) {
    var e = fakeDatabase[i];
    if (e.name == nameToLookup) {
      // update all key/value pairs in e with data from the post body
      var postBody = req.body;
      for (key in postBody) {
        var value = postBody[key];
        e[key] = value;
      }

      res.send('OK');
      return; // return early!
    }
  }

  res.send('ERROR'); // nobody in the database matches nameToLookup
});


// DELETE a user
//
// To test with curl, run:
//   curl -X DELETE http://localhost:3000/users/Philip
//   curl -X DELETE http://localhost:3000/users/Jane
app.delete('/users/*', function (req, res) {
  var nameToLookup = req.params[0]; // this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
  for (var i = 0; i < fakeDatabase.length; i++) {
    var e = fakeDatabase[i];
    if (e.name == nameToLookup) {
      fakeDatabase.splice(i, 1); // remove current element at index i
      res.send('OK');
      return; // return early!
    }
  }

  res.send('ERROR'); // nobody in the database matches nameToLookup
});


// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});
