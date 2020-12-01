const { Schema, model } = require('mongoose');
const bcryptjs = require('bcryptjs');

const agricultureSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    position: { type: Array, required: true },
    previousHarvest: { type: String },
    previousYield: { type: Number},
    dateOfPlanting: { type: Date },
    irrigationSystem: { type: String },
    targetHarvest: { type: String },
    targetYield: { type: Number },
  });

module.exports = model('Agriculture', agricultureSchema);