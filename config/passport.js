//handing login here!!! YEW
const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');

module.exports = (passport) => {
  //passport session setup

  //serialises user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //deserialises
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    passReqToCallback : true
  }, (req, username, password, done) => {
    console.log("hello");
    //asynchronous
    //user.findOne won't fire unless data is sent back
    process.nextTick(() => {
      User.findOne({ 'local.username' : username }, (err, user) => {
        if (err) {
          return done(err);
        }
        //check to see if that username alredy exists
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        } else {

          //creating a new user
          const newUser = new User();
          newUser.local.username = username;
          newUser.local.password = newUser.generateHash(password);

          newUser.save((err) => {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy( {
    passReqToCallback : true
  }, (req, username, password, done) => {
    //if any error, return error before anything else
    // OOPS lol
    User.findOne({ 'local.username' : username }, (err, user) => {
      if (err)
        return done(err);
      // if no user is found with that username
      if (!user)
        return done(null, false, req.flash('loginMessage', ' No user found..'));
      // if user is found but password isn't right
      if (!User.validPassword(password, user))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      //by this stage, everything is bloody well tops
      return done(null, user);
    });
  }));
};
