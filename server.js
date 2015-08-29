var express = require ('express');
var mongoose = require ('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passPort = require('passport');
var localStrategy = require('passport-local');
var session = require('express-session');
var async = require('async');
var connectFlash = require('connect-flash');
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
var historyModel = require('./models/historyModels.js');

//Utils
function randomNfromM (N, A){
    var i = 0, j, arr = [], M = A.length - 1, result = [];
    while(i<N){
        j = Math.floor(Math.random()*(M + 1));
        if (arr.indexOf(j)<0){
            arr.push(j);
            i++
        }
    }
    for (var k = 0; k < arr.length; k++) {
        result.push(A[arr[k]]._id);

    }
    return result
}

function getQuestionFromModel(Model, num) {
    return function(callback) {
        Model.find({}, {_id: 1}, function (err, result) {
            var questionIDs = randomNfromM(num, result);
            Model.find({_id: {$in: questionIDs}}, function (err, result) {
                callback(null, result);
            })
        });
    }
}

//services
var loginService = require('./services/loginService');

//register middle-ware
app.use(connectFlash());
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
    console.log(req.user.username + " has logged out.");
    req.logout();
    res.sendStatus(200);
});

app.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated()? req.user: "0")
});

app.post('/quiz', function (req, res) {
    var jobs = [
        getQuestionFromModel(EPModel,5),
        getQuestionFromModel(GKModel,5),
        getQuestionFromModel(MAModel,5),
        getQuestionFromModel(PMModel,5),
        getQuestionFromModel(SCMModel,5),
        getQuestionFromModel(SQMModel,5),
        getQuestionFromModel(SVVModel,5)];
    async.parallel(jobs, function (err,result) {
        var returnVal=[];
        result.forEach(function (value, index ,array) {
            for (var obj in value){
                returnVal.push(value[obj])
            }
            if (index == array.length - 1) {
                res.send(returnVal)
            }
        })
    })
});

app.post('/practise', function (req, res) {
    var cat;
    switch(req.body[0]){
        case "GKModel":
            cat = GKModel;
            break;
        case "SQMModel":
            cat = SQMModel;
            break;
        case "EPModel":
            cat = EPModel;
            break;
        case "PMModel":
            cat = PMModel;
            break;
        case "MAModel":
            cat = MAModel;
            break;
        case "SVVModel":
            cat = SVVModel;
            break;
        case "SCMModel":
            cat = SCMModel;
            break;
    }
    async.series([getQuestionFromModel(cat,5)], function (err,result) {
        res.send(result[0]);
    })
});

app.post('/saveRecord', function (req, res) {
    var newRecord = new historyModel(req.body);
    newRecord.save(function (err, result) {
        if (err) {
            res.send('error')
        } else {
            res.send(result)
        }
    })
});

app.post('/getRecord', function (req,res) {
    //get practise history logic
    historyModel.find({
        username:req.body.username,
        mode:req.body.mode
    })
        .sort({time: -1})
        .limit(req.body.number)
        .exec(function (err, result) {
        res.send(result)
    })

});

app.post('/changePasswd', function (req, res) {
    userModel.find({username:req.body.username, password:req.body.oldPassword}, function (err, result) {
        if (result && result.length != 0) {
            console.log(result, req.body);
            /*result.password  = req.body.newPassword;
            result.save(function (err) {
                if (err) {
                    res.send(err)
                } else {
                    res.send('success');
                }
            })*/

            userModel.update({username:req.body.username},{password:req.body.newPassword},false,function (err, num){
                if (num.ok == 1){
                    res.send('success')
                } else {
                    res.send('error')
                }
            })

        } else {
            res.send('incorrect')
        }
    })
});

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname + "/views" });
});

app.listen(port, function (){
    console.log('http://127.0.0.1:' + port + '/');
});