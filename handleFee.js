const MonthlyFee = require('./monthlyFeeSchema')
const Student = require('./studentSchema');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DBUID}:${process.env.DBPASS}@wisdomcluster.l40bgon.mongodb.net/wisdomdb`;
const mongoose = require('mongoose')

const handleAdd = (req, res) => {
    // Connect to MongoDB
    let rescode = 500;
    let resmsg = "Error"
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
  console.log('Connected to MongoDB');
    const studentId = req.params.studentId;
    const year = req.body.year;
    const month = req.body.month;
    const value = req.body.value;
    try {
        // Check if the student exists
        const student = await Student.findById(studentId);
        if (!student) {
          console.log('Student not found');
          rescode = 404;
          resmsg = 'Student not found'
          return;
        }
  
        // Find the monthly fee document for the student
        let monthlyFee = await MonthlyFee.findOne({ student: studentId });
  
        if (monthlyFee) {
          // Update the monthly fee details for the given year and month
          if (monthlyFee.year.hasOwnProperty(year)) {
              const update = {
                  $set: {
                    [`year.${year}.${month}`]: value
                  }
                };
                monthlyFee = await MonthlyFee.findOneAndUpdate(
                  { student: studentId },
                  update
                );
          }else{
              const update = {
                  $set: {
                    [`year.${year}`]: Array.from({ length: 12 }, (_, i) => i === month ? value : false)
                  }
                };
                monthlyFee = await MonthlyFee.findOneAndUpdate(
                  { student: studentId },
                  update,
                  { new: true }
                );
          }
          console.log('Monthly fee details updated successfully');
          rescode = 201;
          resmsg = 'Monthly fee details updated successfully'
        } else {
          // Create a new monthly fee document
          monthlyFee = new MonthlyFee({
            student: studentId,
            year: {
              [year]: Array.from({ length: 12 }, (_, i) => i === month ? value : false)
            }
          });
          monthlyFee = await monthlyFee.save();
          console.log('Monthly fee details added successfully');
          rescode = 201;
          resmsg = 'Monthly fee details added successfully'
        }
      } catch (error) {
        console.error('Error adding monthly fee details:', error);
        rescode = 201;
        resmsg = error
      } finally {
          mongoose.connection.close();
          console.log('Disconnected from MongoDB');
          res.status(rescode).send(resmsg)
      }
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  res.status(500).send('error connecting to Mongodb')
})
}

const handleFetch = (req, res)=>{
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');
        const studentId = req.params.studentId;
        const monthlyFee = await MonthlyFee.findOne({ student: studentId });
        if(monthlyFee){
            res.status(200).send(monthlyFee)
        }else{
            res.status(404).send("no data found")
        }
        
        mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    })
}

module.exports = {handleAdd, handleFetch}