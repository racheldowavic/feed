// all the routes... sorry
const moment = require('moment');

module.exports = (app, passport) => {
  //################### HOME PAGE ###################
  app.get('/', (req, res) => {
     res.render('index.ejs'); //load the index.ejs file
  });

  app.get('/login', (req, res) => {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/feed',
    failureRedirect : '/login',
    failureFlash : true
  }));

  //process the login form
  // app.post('/login', passport stuff);

  // sign up ?? Nah..

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // this is for authenticating signup
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/feed',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  //for viewing the feed
  app.get('/feed', authenticated, (req, res) => {
    res.render('feed.ejs', {
      user : req.user, // get the user out of the session and pass her to the template :)
      time : moment().calendar()
    });
  });

  //for posting
  app.get('/post', authenticated, (req, res) => {
    res.render('make_post.ejs');
  });

  //for logging out
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};

//function for checking if a person is logged in or not
//very easy with passport yoho
const authenticated = (req, res, next) => {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
}
