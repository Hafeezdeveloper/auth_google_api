const express = require('express');
const app = express();
const mongoose= require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();

// Use CORS middleware with specific configurations
app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with the origin of your frontend
    credentials: true, // Allow credentials (cookies, authentication headers)
  })
);

app.use(express.json());

// Express session configuration
app.use(
  session({
    secret: 'cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());


passport.use(
    new GoogleStrategy(
      {
        clientID: '774917999953-0beb2elcvfkqj9p8bqnv2jt3snas3sqs.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/auth/google/callback', // Adjust this URL as needed
      },
         (token, tokenSecret, profile, done) => {
      // You can implement user creation and retrieval logic here.
      // Example: Check if the user exists in the database or create a new user.
      console.log(profile)
       done(null, profile);
    }
  )
);


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
  
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
  
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
      // Successful authentication, redirect or send a response as needed.
      res.redirect('/dashboard'); // Redirect to a dashboard page
    });
  


mongoose.connect(process.env.MONGO_URI)
.then( (succ) =>{
    app.listen(process.env.PORT, () =>{
        console.log("server is start and Mongo is connected")
    })
})  
.catch( (err) =>{
    console.log(err)
})