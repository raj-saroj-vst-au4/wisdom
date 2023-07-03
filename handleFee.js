const MonthlyFee = require('./models/monthlyFeeSchema')
const Student = require('./models/studentSchema');
require('dotenv').config()

const handleAdd = async (req, res) => {
  // Connect to MongoDB
  let rescode = 500;
  let resmsg = "Error"
  const studentId = req.params.studentId;
  const year = req.body.year;
  const month = req.body.month;
  const value = req.body.value;
  const fee = req.body.fee;
  try {
      // Check if the student exists
      const student = await Student.findById(studentId);
      if (!student) {
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
                  [`year.${year}.${month}`]: {fee: fee, time: new Date()}
                }
              };
              monthlyFee = await MonthlyFee.findOneAndUpdate(
                { student: studentId },
                update
              );
        }else{
            const update = {
                $set: {
                  [`year.${year}`]: Array.from({ length: 12 }, (_, i) => i === month ? {fee: fee, time: new Date()} : false)
                }
              };
              monthlyFee = await MonthlyFee.findOneAndUpdate(
                { student: studentId },
                update,
                { new: {fee: fee, time: new Date()} }
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
        res.status(rescode).send(resmsg)
    }
}

const handleFetch = async (req, res)=>{
  const studentId = req.params.studentId;
  try {
    const monthlyFee = await MonthlyFee.findOne({ student: studentId });
    if(monthlyFee){
        res.status(200).send(monthlyFee)
    }else{
        res.status(404).send("no data found")
    }
  }catch(err){
    res.status(500).send(err);
  }

}

module.exports = {handleAdd, handleFetch}