const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const passport = require('passport');
const Student = require('../model/student-model')

router.get('/signup', (req,res) => {
    res.render('student/student-signup',{student : new Student()})
})

router.get('/login', (req,res) => {
    res.render('student/login-student',{student : new Student()})
})

router.get('/dashboard', async(req,res) => { 
  let student = await Student.find();
  res.render('student/student-dashboard', {name : req.user.name, role: req.user.role, student})
})

router.get('/info',async (req,res) => {
  let user = req.user.name
  try{
  let student = await Student.findOne({'name': user})
  res.render('student/show', {name : req.user.name, role: req.user.role, student})
  }
  catch(e) {
    console.log(e)
  }
})

router.get('/marks/:id', async(req,res) => {
  let student = await Student.findById(req.params.id)
   res.render('student/display-marks', {person:student, name : req.user.name, role: req.user.role})
})

router.get('/edit', async (req,res) => {
  let user = req.user.name
  try{
  let student = await Student.findOne({'name': user})
  res.render('student/edit', {name : req.user.name, role: req.user.role, student})
  }
  catch(e) {
    console.log(e)
  }
})

router.put('/edit',async (req,res) => {
  const {name, roll, email, address, city, state, country, zip} = req.body;
  let user = req.user.name
  let student = await Student.findOne({'name': user})
  let errors = [];
       
  if (!name || !email || !roll) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('student/edit', { errors ,student, name : req.user.name, role: req.user.role});
  } else {
    student.name = name
    student.roll = roll
    student.email = email
    //staff.password = password
    student.address = address
    student.city = city
    student.state = state
    student.country = country
    student.zip = zip
    student.save().then(user => {
                 req.flash('success_msg','Saved successfully');
                 res.redirect(`/nit/student/dashboard`)
          })
          .catch(err => console.log(err));
  }     
})

router.get('/reset',(req,res) => {
    const {roll} = req.body;
    // if(!roll) {
    //   req.flash('error_msg','Please enter Reg No.')
    //   res.render('student/login')
    // }
    res.render('student/reset')
})

router.put('/reset',async (req,res) => {
  const { roll, password, password1} = req.body;
  let student = await Student.findOne({'roll': roll})
  let errors = [];
       
  if (!password || !password1 || !roll) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 5 ) {
    errors.push({ msg: 'Password must be at least 5 characters' });
  }
  
  if (password != password1) {
    errors.push({ msg: 'Password do not match' });
  }

  if (!student) {
    errors.push({ msg: 'Reg No. do not exists' });
  }

  if (errors.length > 0) {
    res.render('student/reset', { errors ,student});
  } else {
    student.password = password

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(student.password, salt, (err, hash) => {
        if (err) throw err;
        student.password = hash;
        student.save()
             .then(user => {
                 req.flash('success_msg','Password changed');
                 res.redirect(`/nit/student/login`)
          })
          .catch(err => console.log(err));
      });
    });
  }     
})

router.post('/signup', (req,res) => {
    const { name, roll, email, password, address, city, state, country, zip} = req.body;
    let student = new Student({ name, roll, email, password, address, city, state, country, zip })
    let errors = [];
       
         if (!name || !email || !password || !roll) {
           errors.push({ msg: 'Please enter all fields' });
         }
       
         if (password.length < 5) {
           errors.push({ msg: 'Password must be at least 5 characters' });
         }
       
         if (errors.length > 0) {
           res.render('student/student-signup', { errors ,student: student});
         } else {
           Student.findOne({ roll: roll }).then(user => {
             if (user) {
               errors.push({ msg: 'Reg No. already exists' });
               res.render('student/student-signup', { errors, student : student });
             } else {
       
               bcrypt.genSalt(10, (err, salt) => {
                 bcrypt.hash(student.password, salt, (err, hash) => {
                   if (err) throw err;
                   student.password = hash;
                   student.save()
                        .then(user => {
                            req.flash('success_msg','You are now registered and can log in');
                            res.redirect(`/nit/login`)
                     })
                     .catch(err => console.log(err));
                 });
               });
             }
           });
        }
    })

router.post('/login', (req,res,next) => {
    passport.authenticate('student-local', {
        successRedirect: '/nit/student/dashboard',
        failureRedirect: '/nit/student/login',
        failureFlash: true
      })(req, res, next);
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/nit');
});

module.exports = router;