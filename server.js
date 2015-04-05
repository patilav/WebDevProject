/*
 * Project Name: ArtisticCollab 
 * Created by: Avanti Patil 
 */

// Required node modules for project 

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');

// creating a new nodejs app with express module
var app = express();


// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(multer()); 

//max limit to save images
app.use(express.bodyParser({ limit: '50mb' })); 

//mongodb connection string for the remote database on openshift database 
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/cs5610project';

//connecting with mongoose and database string to the database 
mongoose.connect(connectionString);

// (**** DANGER ****) Not be used in production
// To check all the process details running on the Openshift Server
//app.get('/process', function (req, res) {
//    res.json(process.env);
//})

// Serve static content for the app from the “public” directory in the application directory
app.use(express.static(__dirname + '/public'));

//Sample to check if the Server is running
app.get('/content', function (req, res) {
    res.send('<h1>Hello from Open Shift - Static Message</h1>');
});

//--------------------Schemas--------------------------------------------------------

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    photo: String
}, { collection: 'user' });

var commentSchema = new mongoose.Schema({
    username: String,
    text: String
}, { collection: 'comment' });


var artworkSchema = new mongoose.Schema({
    username: String,
    type: String,
    artwork: String
}, { collection: 'artwork' });


// Creating the Models for the schemas 
var userModel = mongoose.model("UserModel", userSchema);
var commentModel = mongoose.model("CommentModel", commentSchema);
var artworkModel = mongoose.model("ArtworkModel", artworkSchema);


app.get('/usercomment', function (req, res) {
    commentModel.find(function (err, data) {
        res.json(data);
    });
});

app.post('/usercomment', function (req, res) {
    var comment = new commentModel(req.body);
    comment.save(function () {
        commentModel.find(function (err, data) {
            res.json(data);
        });
    });
});

app.get('/userartwork', function (req, res) {
    artworkModel.find(function (err, data) {
        res.json(data);
    });
});

app.post('/userartwork', function (req, res) {
    var artwork = new artworkModel(req.body);
    artwork.save(function () {
        artworkModel.find(function (err, data) {
            res.json(data);
        });
    });
});

app.post('/updateprofile', function (req, res) {
    var username = req.body.username;
    userModel.update({ username: username }, { $set: req.body }, function (err, data) {
        userModel.find(function (err, data) {
            res.json(data);
        });
    });
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    userModel.find({ username: username, password: password }, function (err, data) {
        res.json(data);
    });
});

app.post('/signup', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var photo = req.body.photo;

    userModel.find({ username: username }, function (err, data) {
        if (data.length > 0) {
            res.json({ response: 'false' });
        } else {
            new userModel({
                username: username,
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName,
                photo: photo
            }).save(function (err, data) {
                res.json({ response: 'true' });
            });
        }
    });

});


//----------------------------000-clientApp--------------------------------------

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/login', function (req, res) {
    res.json(login);
});

app.get('/login/:index', function (req, res) {
    var idx = req.params.index; // or req.params['index'];
    res.json(login[idx]);
});

app.post('/login', function (req, res) {
    var obj = req.body;
    login.push(obj);
    res.json(login);
});

app.put('/login/:index', function (req, res) {
    var index = req.params.index;
    login[index] = req.body;
    res.json(login);
});

app.delete('/login/:index', function (req, res) {
    var idx = req.params.index;
    login.splice(idx, 1);
    res.json(login);
});

app.get('/login/:index/application', function (req, res) {
    var idx = req.params.index; // or req.params['index'];
    res.json(login[idx].application);
});

app.get('/login/:index/application/:appIndex', function (req, res) {
    var idx = req.params.index; // or req.params['index'];
    var appIdx = req.params.appIndex;

    res.json(login[idx].application[appIdx]);
});

app.get('/bye', function (req, res) {
    res.send('Good Bye');
});

//---------------------------------------------------------------------------------------
// Connection configuration details with local and openshift server

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);