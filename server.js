const express = require('express');
// const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const morgan = require('morgan');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const configDB = require('./config/db.js');
const port = process.env.PORT || 8000;
const app = express();


//configuration
mongoose.connect(configDB.url);
console.log("hello!");

//using stuff
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
require('./config/passport')(passport); // its because that shit require(..) returns a function and then passport is the parameter

//session secret
app.use(session({
  secret: 'choccymilkiseasilythebestone',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); //persistent login :) NICE
app.use(flash()); //dont really get what this is for lol

//thing we import from feed_routes.js
//its empty rn because we don't have a database set up
require('./app/routes.js')(app, passport);

app.listen(port, () => {
  console.log('Connecting to Port ' + port + '... :)');
});

// the tutorial suggests making four routes: CREATE, READ, UPDATE, and DELETE.
