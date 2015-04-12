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

var artworkidSchema = new mongoose.Schema({
    artworkid: String
});

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    photo: String,
    myfavartworks: [String]
}, { collection: 'user' });

var commentSchema = new mongoose.Schema({
    username: String,
    text: String
}, { collection: 'comment' });


var artcommentSchema = new mongoose.Schema({
    text: String,
    username : String
});

//step-1 search for that particular user in userSchema {
//step-2 insert your artwork in artworkSchema
//step-3 push() into myartworkID }

var artworkSchema = new mongoose.Schema({
    artworkname: String,
    username: String,
    type: String,
    artwork: String,
    upvotes: String,
    comments: [artcommentSchema],
    created: { type: Date, default: Date.now }
}, { collection: 'artwork' });


// Creating the Models for the schemas 
var userModel = mongoose.model("UserModel", userSchema);

var artworkidSchemaModel = mongoose.model("artworkidSchemaModel", artworkidSchema);

var commentModel = mongoose.model("CommentModel", commentSchema);

var artcommentModel = mongoose.model("ArtCommentModel", artcommentSchema);

var artworkModel = mongoose.model("ArtworkModel", artworkSchema);

//-------------------------------------------------------------
// Sample comment model with user info 
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
//-------------------------------------------------------------
// Sample get and post for user artwork
app.get('/api/userartwork', function (req, res) {
    artworkModel.find(function (err, data) {
        res.json(data);
    });
});

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
app.delete("/api/userartwork/:id", function (req, resp) {
    artworkModel.find({ _id: req.body.id , username : req.body.username }, function (err, doc) {
        doc.remove();
        artworkModel.find(function (err, data) {
            resp.json(data);
        });
    });
});

//Increase the upvotes by the id 
app.post('/api/userartworklike/:id', function (req, res) {
    artworkModel.findById(req.params.id, function (err, data) {
        data.update({ $set: { "upvotes": Number(data.upvotes) + 1 } }, function (err, doc) {
            artworkModel.find(function (err, data) {
                res.json(data);
            });
        });
    });
});

// -------------- Single update -----------
// TBD
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

//--------------------------------------------------------------------------------
//Update the user profile by id  
app.post('/api/updateprofile', function (req, res) {
    var username = req.body.username;
    userModel.findById(req.params.id, function (err, data) {
        data.username = username;
        data.password = req.body.password;
        data.email = req.body.email;
        data.firstName = req.body.firstName;
        data.lastName = req.body.lastName;
        data.photo = req.body.photo;
        data.myartwork = req.body.myartwork;
        data.myfavartwork = req.body.myfavartwork;
        data.save(function (err, data) {
            userModel.find(function (err, data) {
                res.json(data);
            });
        });
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