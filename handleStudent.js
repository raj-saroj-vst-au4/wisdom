const Student = require('./models/studentSchema');
const mongoose = require('mongoose')
require('dotenv').config()

const handleAdd = (req, res) => {
    const studentid = req.body.studentid
    const name = req.body.name
    const standard = req.body.standard
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

const handleDisable = async (req, res) => {
  const studentid = req.params.studentId
  try {
    await Student.findByIdAndUpdate(studentid, {active : false})
    res.status(202).send("Student Disabled Successfully")
  }catch(err){
    res.status(500).send(err);
  }
  
}

const handlePromotion = async (req, res) => {
  const studentid = req.params.studentId
  try {
    await Student.findByIdAndUpdate(studentid, {$inc: { class: 1 }})
    res.status(202).send("Student Disabled Successfully")
  }catch(err){
    res.status(500).send(err);
  }
  
}

const handleDel = async (req, res) =>{
  const studentId = req.params.studentId;
  try{
    await Student.findOneAndDelete({_id:studentId})
    res.status(203).send("Student Deleted Successfully")
  }
  catch(err){
    res.status(400).send(err)
  }

}

module.exports = {handleAdd, handleFetch, handleDisable, handlePromotion, handleDel}