/**
 * Module dependencies.
 */
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path'),
    session = require('express-session'),
    serverController = require('./app/controller/serverController');

// db connection
mongoose.connect('mongodb://localhost/mean-login-project');

// GLOBAL config
app.use('/js', express.static(__dirname + "/public/js"));
app.use('/css', express.static(__dirname + "/public/css"));
app.use('/images', express.static(__dirname + "/public/images"));
app.use(bodyParser());
app.use(session({secret: 'secret'}));

//routes
require('./routes/route')(app);

// Start the app by listening on <port>
app.listen(3000, function(req, res){
	console.log('I\'m Listening on 3000 port');
});


