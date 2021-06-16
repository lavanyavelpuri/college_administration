const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const passport = require('passport');
const Staff = require('../model/staff-model')
const Student = require('../model/student-model')
//require('../config/passport-staff')(passport);

router.get('/signup', (req,res) => {
    res.render('staff/staff-signup',{staff : new Staff()})
})

router.get('/login', (req,res) => {
    res.render(`staff/login-staff`)
})

router.get('/dashboard', async (req,res) => {
  let staff = await Staff.find()
  if(req.user.role === 'admin') {
    let student = await Student.find()
    res.render('staff/staff-dashboard', {name : req.user.name, role : req.user.role, staff, student})
  }
  else
  res.render('staff/staff-dashboard', {name : req.user.name, role : req.user.role, staff})
})

router.get('/info',async (req,res) => {
  let user = req.user.name
  try{
  let staff = await Staff.findOne({'name': user})
  res.render('staff/show', {name : req.user.name, role: req.user.role, staff})
  }
  catch(e) {
    console.log(e)
  }
})

router.get('/edit', async (req,res) => {
  let user = req.user.name
  try{
  let staff = await Staff.findOne({'name': user})
  res.render('staff/edit', {name : req.user.name, role: req.user.role, staff})
  }
  catch(e) {
    console.log(e)
  }
})


router.put('/edit',async (req,res) => {
  const {name, staffNo, email, address, city, state, country, zip} = req.body;
  let user = req.user.name
  let staff = await Staff.findOne({'name': user})
  let errors = [];
       
  if (!name || !email || !staffNo) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('staff/edit', { errors ,staff, name : req.user.name, role: req.user.role});
  } else {
    staff.name = name
    staff.staffNo = staffNo
    staff.email = email
    //staff.password = password
    staff.address = address
    staff.city = city
    staff.state = state
    staff.country = country
    staff.zip = zip
    staff.save().then(user => {
                 req.flash('success_msg','Saved successfully');
                 res.redirect(`/nit/staff/dashboard`)
          })
          .catch(err => console.log(err));
  }     
})

router.get('/reset',(req,res) => {
  try{
    res.render('staff/reset')
    }
    catch(e) {
      console.log(e)
    }
})

router.get('/student-edit', async (req,res) => {
  let student = await Student.find()
  let staff = await Staff.find()
  try{
    if(req.user.role === 'admin')
    res.render('staff/admin/student-marks',{student, staff, name : req.user.name, role: req.user.role})
    else {
    req.flash('error_msg','Not permitted')
    res.redirect('/nit/staff/dashboard')
    } 
  }
  catch(e) {
    console.log(e)
  }
})

router.get('/all_staff', async (req,res) => {
  let staff = await Staff.find()
  try{
    if(req.user.role === 'admin')
    res.render('staff/admin/staff-data',{ staff, name : req.user.name, role: req.user.role})
    else {
    req.flash('error_msg','Not permitted')
    res.redirect('/nit/staff/dashboard')
    } 
  }
  catch(e) {
    console.log(e)
  }
})

router.get('/all_students', async (req,res) => {
  let student = await Student.find()
  try{
    if(req.user.role === 'staff')
    res.render('staff/admin/student-data',{student, name : req.user.name, role: req.user.role})
  }
  catch(e) {
    console.log(e)
  }
})

router.get('/student/marks/:id', async(req,res) => {
  let student = await Student.findById(req.params.id)
  try{
    if(req.user.role === 'staff')
    res.render('staff/display-marks',{person:student, name : req.user.name, role: req.user.role})
  }
  catch(e) {
    console.log(e)
  }
})

router.get('/marks/:id', async(req,res) => {
  try{
    let student = await Student.findById(req.params.id)
    if(req.user.role === 'admin') {
      res.render('staff/marks-form',{student})
    }
    else {
      req.flash('error_msg','Not permitted')
      res.redirect('/nit/staff/dashboard')
    }   
  }
  catch(e) {
    console.log(e)
  }
})

router.put('/marks/:id', async (req,res) => {
  let errors = []
  const {Maths1, Maths2, Physics, Chemistry, English, Sanskrit} = req.body;
  let student = await Student.findById(req.params.id)
  let staff = await Staff.find()
  if (!Maths1 || !Maths2 || !Physics || !Chemistry || !English || !Sanskrit) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if(errors.length > 0)
  res.render('staff/marks-form',{errors, student})
  //console.log(subject)
  else {
    student.Maths1 = Maths1
    student.Maths2 = Maths2
    student.Physics = Physics
    student.Chemistry = Chemistry
    student.English = English
    student.Sanskrit = Sanskrit
    student.save().then(user => {
      res.redirect('/nit/staff/dashboard')
      }).catch(err => console.log(err));
  }
})

router.put('/reset',async (req,res) => {
  const { staffNo, password, password1} = req.body;
  let staff = await Staff.findOne({'staffNo': staffNo})
  let errors = [];
       
  if (!password || !password1 || !staffNo) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 5 ) {
    errors.push({ msg: 'Password must be at least 5 characters' });
  }
  
  if (password != password1) {
    errors.push({ msg: 'Password do not match' });
  }

  if (!staff) {
    errors.push({ msg: 'Reg No. do not exists' });
  }

  if (errors.length > 0) {
    res.render('staff/reset', { errors ,staff});
  } else {
    staff.password = password

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(staff.password, salt, (err, hash) => {
        if (err) throw err;
        staff.password = hash;
        staff.save()
             .then(user => {
                 req.flash('success_msg','Password changed');
                 res.redirect(`/nit/staff/login`)
          })
          .catch(err => console.log(err));
      });
    });
  }     
})

router.delete('/remove/:id', async (req,res) => {
  let staff = await Staff.findByIdAndDelete(req.params.id)
  await Student.findByIdAndDelete(req.params.id)
  if(staff)
  res.redirect('/nit/staff/all_staff')
  else
  res.redirect('/nit/staff/student-edit')
})

router.post('/signup', async (req,res) => {
    const {name, staffNo, email, password, address, city, state, country, zip, isAdmin} = req.body;
    let staff = new Staff({ name, staffNo, email, password, address, city, state, country, zip, isAdmin})
         let errors = [];
       
         if (!name || !email || !password || !staffNo) {
           errors.push({ msg: 'Please enter all fields' });
         }
       
         if (password.length < 5) {
           errors.push({ msg: 'Password must be at least 5 characters' });
         }
       
         if (errors.length > 0) {
           res.render('staff/staff-signup', { errors ,staff: staff});
         } else {
           Staff.findOne({ staffNo: staffNo }).then(user => {
             if (user) {
               errors.push({ msg: 'Staff Number already exists' });
               res.render('staff/staff-signup', { errors, staff : staff });
             } else {
       
               bcrypt.genSalt(10, (err, salt) => {
                 bcrypt.hash(staff.password, salt, (err, hash) => {
                   if (err) throw err;
                   staff.password = hash;
                   staff.save()
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
    passport.authenticate('staff-local', {
        successRedirect: '/nit/staff/dashboard',
        failureRedirect: '/nit/staff/login',
        failureFlash: true
      })(req, res, next);
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/nit');
});


module.exports = router;