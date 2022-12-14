const { ObjectId } = require("mongodb");
 
 module.exports = function(app, passport, db, objectId) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('serverUsers').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            serverUsers: result
          })
        })
    });
    app.get('/createUser', isLoggedIn, function(req, res) {
        db.collection('serverUsers').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('createUser.ejs', {
            user : req.user,
            serverUsers: result
          })
        })
    });
    app.get('/updateUser', isLoggedIn, function(req, res) {
        db.collection('serverUsers').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('updateUser.ejs', {
            user : req.user,
            serverUsers: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/createUser', (req, res) => {
      db.collection('serverUsers').save({
        name: req.body.name,
        email: req.body.email,
        permissions: req.body.permissions
      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })
// thumbs up and thumbs down logic
    app.put('/updateUser', (req, res) => {
      db.collection('serverUsers')
      .findOneAndUpdate({
        _id: objectId(req.body._id)
      }, {
        $set: {
          _id: ObjectId(req.body._id),
          name: req.body.name,
          email: req.body.email,
          permissions: req.body.permissions
        }
      }, {
        sort: {_id: -1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })
    app.delete('/deleteUser', (req, res) => {
      db.collection('serverUsers').findOneAndDelete({
        name: req.body.name,
        _id: ObjectId(req.body._id)
      }, (err, result) => {
        if (err) return res.send(500, err)
        res.send(result)
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
