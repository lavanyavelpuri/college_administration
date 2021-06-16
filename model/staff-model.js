const mongoose = require('mongoose')
const StaffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    staffNo: {
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
        default: 'staff'
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
    isAdmin: {
        type: Boolean,
        required: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = mongoose.model('Staff', StaffSchema);
  