const MonthlyFee = require('./models/monthlyFeeSchema')
const Student = require('./models/studentSchema');
require('dotenv').config()

const handleAdd = async (req, res) => {
  let rescode = 500;
  let resmsg = "Error"
  const studentId = req.params.studentId;
  const year = req.body.year;
  const month = req.body.month;
  const fee = req.body.fee;
  try {
      if(!studentId){
        rescode = 404;
        resmsg = 'Student not found'
        return;
      }

      const student = await Student.findById(studentId);
      if (!student) {
        rescode = 404;
        resmsg = 'Student not found'
        return;
      }

      let monthlyFee = await MonthlyFee.findOne({ student: studentId });

      if (monthlyFee) {
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
                update
              );
        }
        rescode = 201;
        resmsg = 'Monthly fee details updated successfully'
      } else {
        // Create a new monthly fee document
        monthlyFee = new MonthlyFee({
          student: studentId,
          year: {
            [year]: Array.from({ length: 12 }, (_, i) => i === month ? {fee: fee, time: new Date()} : false)
          }
        });
        monthlyFee = await monthlyFee.save();
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

const handleDel = async (req, res)=>{
  const studentId = req.params.studentId;
  const year = req.body.year;
  const month = req.body.month;
  const fee = req.body.fee;
  let rescode = 500;
  let resmsg = "Error"

  const student = await Student.findById(studentId);
  if (student) {
    try {
      let monthlyFee = await MonthlyFee.findOne({ student: studentId });
      if (monthlyFee?.year?.hasOwnProperty(year)) {
        const update = {
            $set: {
              [`year.${year}.${month}`]: false
            }
          };
          monthlyFee = await MonthlyFee.findOneAndUpdate(
            { student: studentId },
            update
          );

          rescode = 201,
          resmsg = "Fee Deletion Successful"
          monthlyFee = await monthlyFee.save();
    }else{
        rescode = 404
        resmsg = "Entry already null"
    }
    }catch(err){
      console.log(err)
      rescode = 500;
      resmsg = err
    }finally{
      return res.status(rescode).send(resmsg)
    }
  }else{
    return res.status(404).send("Student Not Found in db")
  }
}


const handleFetchPending = async (req, res)=>{
  try{
    const fees = await Student.aggregate([
      {
        $lookup: {
          from: 'monthlyfees', 
          localField: '_id',
          foreignField: 'student',
          as: 'paymentData'
        }
      }
    ]);
    if (fees) {
      const pendingData = [];
      const currdate = new Date();
      const feeData = fees;
      for(let j=0; j<feeData.length; j++){
        if(feeData[j].paymentData.length && feeData[j].active){
            let defcount = 0
            let startdate = new Date(feeData[j].joiningdate)
            while(startdate < currdate){
                let m = startdate.getMonth()
                let y = startdate.getFullYear()
                if(feeData[j].paymentData[0].year[y][m] === false){
                    defcount += 1
                }
                startdate.setMonth(startdate.getMonth() + 1)
            }
            pendingData.push({name : feeData[j].name, pendingmonths : defcount, num : feeData[j].number, id : feeData[j]._id})
        }
      } 
      return res.status(200).json({ "data": pendingData });
    }
  }
  catch(err){
    return res.status(404).send("No Fee of any student found in Database");
  }
}

const handleFetch = async (req, res)=>{
  const studentId = req.params.studentId;
  let rescode = 500;
  let resmsg = "Error"
  const student = await Student.findById(studentId);
  if (student) {
    try {

      let monthlyFee = await MonthlyFee.findOne({ student: studentId });
      if(monthlyFee){
          rescode = 200;
          resmsg = monthlyFee
      }else{
        const year = new Date().getFullYear()
        monthlyFee = new MonthlyFee({
          student: studentId,
          year: {
            [year]: Array.from({ length: 12 }, (_, i) => false)
          },
        });
        await Student.findByIdAndUpdate(studentId, {active: true})
        rescode = 201
        resmsg = await monthlyFee.save() 
      }
    }catch(err){
      console.log(err)
      rescode = 500;
      resmsg = err
    }finally{
      return res.status(rescode).send(resmsg)
    }
  }else{
    return res.status(404).send("Student Not Found in db")
  }


}

module.exports = {handleAdd, handleDel, handleFetch, handleFetchPending}