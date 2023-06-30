const Student = require('./studentSchema');
const mongoose = require('mongoose')
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DBUID}:${process.env.DBPASS}@wisdomcluster.l40bgon.mongodb.net/wisdomdb`;

const handleAdd = (req, res) => {
    const studentid = req.body.studentid
    const name = req.body.name
    const standard = req.body.class
    const batch = req.body.batch
    const fees = req.body.fees
    const phone = req.body.phone
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    
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
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
    res.status(500).send('Error connecting to MongoDB')
  });
}

const handleFetch = (req, res) => {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      const student = await Student.find();
      if (student) {
        return res.status(200).json({ "data": student });
      } else {
        return res.status(404).send("No Students found in Database");
      }
    })
    .catch((error) => {
      console.error("Error fetching students:", error);
      return res.status(500).send("Error fetching students from Database");
    })
    .finally(() => {
      mongoose.disconnect();
    });
};

module.exports = {handleAdd, handleFetch}