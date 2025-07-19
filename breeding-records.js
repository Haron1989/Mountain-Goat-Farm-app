const mongoose = require('mongoose');

const breedingRecordSchema = new mongoose.Schema({
  goatId: String,
  pregnant: Boolean,
  kiddingDate: String,
  lineage: String,
  success: Boolean
});

const BreedingRecord = mongoose.model('BreedingRecord', breedingRecordSchema);

module.exports = BreedingRecord;
