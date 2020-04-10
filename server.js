var express= require("express");
const bodyParser = require('body-parser');
const expressip = require('express-ip');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var mongoose = require('mongoose');
var users = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcryptjs');
const saltRounds = 5;
var jwt = require('jsonwebtoken');
var token,IP_ADDRESS;
process.env.SECRET_KEY='sak';
var app = express();

app.set('views', __dirname + '/view');
app.use('/assets', express.static('assets'));
app.use(expressip().getIpInfoMiddleware);


// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_id',
    secret: 'sak',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_id && !req.session.user) {
        res.clearCookie('user_id');        
    }
    next();
});

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_id) {
        next();
    } else {
       res.redirect('/');
    }    
};

function loggedIn(req, res, next) {
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, function(err) {
      next();
    });
  }else{
    res.redirect('/');
  }
}

var Uconnect = mongoose.createConnection('mongodb://dev:dev123@ds249873.mlab.com:49873/users',{
    useNewUrlParser: true,useUnifiedTopology:true
});

var UserSchema = new mongoose.Schema({
    name: { type : String },
    email: { type : String },
    password: {type : String},
    ip: {type: String},
    createdAt: {type: String,default: new Date().toJSON().slice(0,10).replace(/-/g,'/')}
});

var User = Uconnect.model('User', UserSchema);


app.get('/users/',sessionChecker, function(req,res){
  User.find({}, function(err, data){
      if (err) return callback(err);
      res.render('users.ejs',{row: data});
  });
});

// register post
app.post('/register_details',urlencodedParser,function(req,res){
    bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {
      var userData = {
       name: req.body.name,
       email: req.body.email,
       password: hash,
       ip: req.ipInfo.ip
      };
      var newUser = User(userData).save(function(err, data) {
        if(err) throw err;
        req.session.user = data;
        res.json(data);
      });
    });
});

// login post
app.post('/login_details',urlencodedParser,function(req,res){
    var em = req.body.email;
    var password = req.body.pass;
    var r=res;
    var re=req;
    User.find({email: em}, function(err, data) {
       if (err) throw err;
       var d=data;
        if (data.length > 0) {
          bcrypt.compare(password, data[0].password, function(err, res) {
              if(res==true){
                token = jwt.sign({data: data[0]}, process.env.SECRET_KEY, {
                  expiresIn: 1000
                });
                re.session.user = d;
                r.json({"token": token,"id": data[0].id,"login": true});
              }else{
                r.json({"err": 'password did not match',"login": false});
              }
          });
        }else{
          r.json({"err": 'email not found',"login": false});
        }
    });
});

// register get
app.get('/register',function(req,res){
    User.find({ip: req.ipInfo.ip,createdAt: new Date().toJSON().slice(0,10).replace(/-/g,'/')},function(err,data){
        if(err)throw err;
        res.render('register.ejs',{showCaptcha: data.length>3});
    });
});

// logout get
app.get('/logout',function(req,res){
    token=null;
    if (req.session.user && req.cookies.user_id) {
        res.clearCookie('user_id');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

app.get('/',function(req,res){
  res.render('login.ejs');
});
app.get('*',function(req,res){
  res.redirect('/');
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening on port 3000");
});
