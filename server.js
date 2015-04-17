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
    photo: String,
    followers : [String],
    created: { type: Date, default: Date.now }
}, { collection: 'user' });

var artcommentSchema = new mongoose.Schema({
    text: String,
    username: String,
    created: {type: Date, default: Date.now}
});

var artLikeSchema = new mongoose.Schema({
    count: String,
    username: String,
    created: { type: Date, default: Date.now }
});


//step-1 search for that particular user in userSchema {
//step-2 insert your artwork in artworkSchema
//step-3 push() into myartworkID }

var artworkSchema = new mongoose.Schema({
    artworkname: String,
    username: String,
    type: String,
    artwork: String,
    likes: [artLikeSchema],
    comments: [artcommentSchema],
    created: { type: Date, default: Date.now }
}, { collection: 'artwork' });


// Creating the Models for the schemas 
var userModel = mongoose.model("UserModel", userSchema);

var artcommentModel = mongoose.model("ArtCommentModel", artcommentSchema);

var artLikeModel = mongoose.model("ArtLikeModel", artLikeSchema);

var artworkModel = mongoose.model("ArtworkModel", artworkSchema);

//-------------------------------------------------------------

// Sample get and post for user artwork
app.get('/api/userartwork', function (req, res) {
    artworkModel.find(function (err, data) {
        res.json(data);
    });
});

//Create a new artwork
app.post('/api/userartwork', function (req, res) {
    var artwork = new artworkModel(req.body);
        artwork.save(function () {
        artworkModel.find({ "username": req.body.username }, function (err, data) {
            res.json(data);
        });
    });
});

//Find artwork by id  
app.get("/api/userartwork/:id", function (req, resp) {
    artworkModel.findById(req.params.id, function (err, doc) {
        resp.json(doc);
    });
});

//Find artwork by name
app.get("/api/userartwork/searchByName/:name", function (req, resp) {
    artworkModel.find({ artworkname: req.params.name }, function (err, doc) {
        resp.json(doc);
    });
});

//Find artwork by type
app.get("/api/userartwork/searchByType/:type", function (req, resp) {
    artworkModel.find({ type: req.params.type }, function (err, doc) {
        resp.json(doc);
    });
});

//Find artwork by type
app.get("/api/userartwork/search", function (req, resp) {
    console.log("This is search name" + req.params.searchNameString);
    console.log("This is search type" + req.params.searchTypeString);
    artworkModel.find({ artworkname: req.params.searchNameString, type: req.params.searchTypeString }, function (err, doc) {
        resp.json(doc);
    });
});

//Find artwork - comments by id
app.get("/api/userartwork/:id/comments", function (req, resp) {
    artworkModel.findById(req.params.id, function (err, doc) {
        resp.json(doc.comments);
    });
});

//Find myartwork by id using the username
app.get("/api/myuserartwork/:id", function (req, resp) {
    artworkModel.find({ "username": req.params.id }, function (err, doc) {
        resp.json(doc);
    });
});

app.post('/updateprofilewithmyartwork', function (req, res) {
    console.log(req.body.username, req.body.artworkid);
    userModel.find({ "username": req.body.username }, function (err, data) {
        //data.myfavartworks.push(req.body.artworkid);
        console.log(data.myfavartworks);
        //data.update({ $set: { "myfavartworks": data.myfavartworks } }, function (err, doc) {
        //    res.json({success: "Inserted Peacefully"});
        //});
        //data.save(function (err, data) {
        //    userModel.find(function (err, data) {
        //        res.json(data);
        //    });
        //});
    });
});

//Delete the artwork by id
app.delete("/api/userartwork/:id/:username", function (req, res) {
    artworkModel.findById(req.params.id, function (err, doc) {
        doc.remove();
        artworkModel.find({ "username": req.params.username }, function (err, data) {
            res.json(data);
        });
    });
});

//Increase the upvotes by the id 
app.post('/api/userartworklike/:id/:username', function (req, res) {
    artworkModel.findById(req.params.id, function (err, data) {
        data.update({ $set: { "upvotes": Number(data.upvotes) + 1 } }, function (err, doc) {
            artworkModel.find({ "username": req.params.username }, function (err, data) {
                res.json(data);
            });
        });
    });
});

app.put('/api/userartwork/:id/:username', function (req, res) {
    artworkModel.update({ _id: req.params.id }, { $set: req.body }, function (err, doc) {
        artworkModel.find({ "username": req.params.username }, function (err, data) {
            res.json(data);
        });
    });
});


app.put('/api/user/:id', function (req, res) {
    userModel.update({ _id: req.params.id }, { $set: req.body }, function (err, doc) {
        userModel.find( function (err, data) {
            res.json(data);
        });
    });
});


//--------------------------------------------------------------------------------
// Sample get and post for user artwork
app.get('/api/user', function (req, res) {
    userModel.find(function (err, data) {
        res.json(data);
    });
});

// Sample get and post for user artwork
app.get('/api/user/:id', function (req, res) {
    userModel.findById(req.params.id, function (err, data) {
        res.json(data);
    });
});

//Login to the application check 
app.post('/api/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var userid = req.body._id;
    userModel.find({ username: username, password: password }, function (err, data) {
        res.json(data);
    });
});


//Create a new user using the api
app.post('/api/signup', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var photo = req.body.photo;
    var myartwork = null;
    var myfavartwork = null;
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
                photo: photo,
                myartwork: myartwork,
                myfavartwork: myfavartwork
            }).save(function (err, data) {
                res.json({ response: 'true' });
            });
        }
    });

});

app.get('/', function (req, res) {
    res.send('Hello World');
});

//---------------------------------------------------------------------------------------
// Connection configuration details with local and openshift server

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);