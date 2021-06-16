const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')

// Load User model
const Student = require('../model/student-model');
const Staff = require('../model/staff-model');
module.exports = function(passport) {

  passport.use('student-local', new LocalStrategy({ usernameField: 'roll' }, (roll, password, done) => {
      // Match user
      Student.findOne({
        roll: roll
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Roll No. is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );
  
  //second local strategy
  passport.use('staff-local', new LocalStrategy({ usernameField: 'staffNo' }, (staffNo, password, done) => {
    // Match user
    Staff.findOne({
      staffNo: staffNo
    }).then(user => {
      if (!user) {
        return done(null, false, { message: 'Staff No. is not registered' });
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, { _id: user.id, role: user.role });
});

  passport.deserializeUser(function(id, done) {
    if(id.role === 'student') {
      Student.findById(id, function(err, user) {
        done(err, user);
      });
    }
    else if (id.role === 'admin') {
      Staff.findById(id, function(err, user) {
        done(err, user);
      });
    }
    else if (id.role === 'staff') {
      Staff.findById(id, function(err, user) {
        done(err, user);
      });
    }
    else {
      done({ message: 'No entity found' }, null);
  }
    
  });
};