const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'student'
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    zip: {
        type: String,
        required: false
    },
    Maths1 :{type: Number},
    Maths2 :{type: Number},
    Physics :{type: Number},
    Chemistry :{type: Number},
    English :{type: Number},
    Sanskrit :{type: Number},
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
 const Student = mongoose.model('Student', studentSchema);
 module.exports = Student;
  