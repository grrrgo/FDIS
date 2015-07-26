var express = require ('express');
var mongoose = require ('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passPort = require('passport');
var localStrategy = require('passport-local');
var session = require('express-session');
var app = express();
var port = process.env.PORT || 1337;
app.use(express.static(__dirname + '/views'));
mongoose.connect('mongodb://localhost:27017/Quiz');

//models
var userModel = require('./models/userModel.js');
var questionModel = require('./models/questionModel.js');
var GKModel = require('./models/GKModel.js');
var SQMModel = require('./models/SQMModel.js');
var EPModel = require('./models/EPModel.js');
var MAModel = require('./models/MAModel.js');
var SVVModel = require('./models/SVVModel.js');
var SCMModel = require('./models/SCMModel.js');
var PMModel = require('./models/PMModel.js');


//services
var loginService = require('./services/loginService');

//register middle-ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    secret: "secret",
    resave: "",
    saveUninitialized: ""
}));
app.use(passPort.initialize());
app.use(passPort.session());

//passport config
passPort.use(new localStrategy(
    function (username, password, done){
        //authentication method
        userModel.findOne({
            username: username,
            password: password
        }, function (err, user) {
            if (user) {
                return done(null, user)
            }
            return  done(null, false)
        })
    }));

passPort.serializeUser(function (user, done){
    done(null, user);
});

passPort.deserializeUser(function (user, done){
    done(null, user);
});


//routes
app.post('/register', function (req, res) {
    userModel.findOne({username: req.body.username}, function (err, result) {
        if (result) {
            res.send("0");
        } else {
            var newUser = new userModel(req.body);
            newUser.save(function (err, user) {
                req.login(user, function () {
                    res.json(user);
                });
            })
        }
    })
});

app.post('/login', passPort.authenticate('local'), function(req, res){
    var user = req.user;
    console.log(req.user.username + " has logged in.");
    res.json(user);
});

app.post('/logout', function (req, res) {
    console.log(req.user.username + " has logged out.")
    req.logout();
    res.sendStatus(200);
});

app.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated()? req.user: "0")
});

app.post('/quiz', function (req, res) {
    questionModel.find({_id:{$in:req.body}}, function (err, result) {
        res.send(result);
    })
});


app.get('/getquestions', function (req, res) {
    questionModel.find({}, {_id:1}, function(err, result){
        res.send(result);
    })
});

app.get('/getGK', function (req, res) {
    GKModel.find({}, {_id:1}, function(err, result){
        res.send(result);
    })
});

app.get('/getSQM', function (req, res) {
    SQMModel.find({}, {_id:1}, function(err, result){
        res.send(result);
    })
});

app.get('/getEP', function (req, res) {
    EPModel.find({}, {_id:1}, function(err, result){
        res.send(result);
    })
});

app.get('/getPM', function (req, res) {
    PMModel.find({}, {_id:1}, function(err, result){
        res.send(result);
    })
});

app.get('/getMA', function (req, res) {
    MAModel.find({}, {_id:1}, function(err, result){
        res.send(result);
    })
});

app.get('/getSVV', function (req, res) {
    SVVModel.find({}, {_id:1}, function(err, result){
        res.send(result);
    })
});

app.get('/getSCM', function (req, res) {
    SCMModel.find({}, {_id:1}, function(err, result){
        res.send(result);
    })
});

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname + "/views" });
});

app.listen(port, function (){
    console.log('http://127.0.0.1:' + port + '/');
});