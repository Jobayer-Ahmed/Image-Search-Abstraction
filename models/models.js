// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema
const searchSchema = new Schema({
	searchValue: String,
	searchDate: Date
},{timestamps: true});

const ModelClass = mongoose.model('searchModel', searchSchema);

// Exports Modals
module.exports = ModelClass;