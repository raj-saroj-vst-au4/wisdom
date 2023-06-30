const Student = require('./models/studentSchema');
const mongoose = require('mongoose')
require('dotenv').config()

const handleAdd = (req, res) => {
    const studentid = req.body.studentid
    const name = req.body.name
    const standard = req.body.class
    const batch = req.body.batch
    const fees = req.body.fees
    const phone = req.body.phone
    
    // Create a new student document
    const newStudent = new Student({
        studentid: studentid,
        name: name,
        class: standard,
        batch: batch,
        fees: fees,
        number: phone,
    });

    // Save the student document
    newStudent.save()
      .then(() => {
        console.log('Student saved successfully');
        res.status(200).send(`new student added successfully`)
      })
      .catch((error) => {
        console.error('Error saving student', error);
        res.status(500).send(error)
      })
      .finally(() => {
        // Disconnect from MongoDB
        mongoose.disconnect()
      });
}

const handleFetch = async (req, res) => {
  const student = await Student.find();
  if (student) {
    return res.status(200).json({ "data": student });
  } else {
    return res.status(404).send("No Students found in Database");
  }
};

module.exports = {handleAdd, handleFetch}