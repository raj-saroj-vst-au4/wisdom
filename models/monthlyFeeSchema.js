const mongoose = require('mongoose');

const monthlyFeeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  year: {
    type: Object,
    default: {}
  }

});

const MonthlyFee = mongoose.model('MonthlyFee', monthlyFeeSchema);

module.exports = MonthlyFee;


// year: {
//   type: Map,
//   of: {
//     type: [Boolean],
//     default: Array.from({ length: 12 }, () => false)
//   }
// }