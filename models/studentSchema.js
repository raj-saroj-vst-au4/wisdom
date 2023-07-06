const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentid: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  batch: {
    type: Number,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  joiningdate: {
    type: Date,
    required: true,
    default: Date.now
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;