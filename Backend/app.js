var express = require('express');
var app = express();
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var creaTournRouter = require('./modules/creaTourn/routes/creaTourn.router');
var userRouter = require('./modules/users/routes/users.router');
var authRouter = require('./modules/users/routes/auth.router');
var frontAddress = require('./frontAddress');
var passport = require('passport');
var passportService = require('./modules/users/services/auth.service');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", frontAddress);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json({limit: '50mb'}));

app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: false,
    maxAge: 1000000000000
}));
app.use(passport.initialize());      //===========
app.use(passport.session());         //autoryzacja
passportService.initPassport();      //===========
app.use(authRouter);
app.use(creaTournRouter);
app.use(userRouter);
app.use(function(req,res,next){                //========
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.json({                             //autoryzacja
            success: false,
            error: "Not authenticated"
        }).status(403);
    }
});                                            //=========

app.listen(2000);

process.on('unhandledRejection', function(reason, p) {
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});
