const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  goatId: String,
  checkupDate: String,
  treatment: String,
  status: String
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

module.exports = HealthRecord;
