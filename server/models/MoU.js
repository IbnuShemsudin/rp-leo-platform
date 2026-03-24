// server/models/MoU.js
const mongoose = require('mongoose');

const MoUSchema = new mongoose.Schema({
  partnerName: { type: String, required: true },
  country: { type: String, required: true },
  
  // Article 5: Objectives
  objectives: { type: String, required: true },
  
  // Article 10: Funding
  fundingType: { 
    type: String, 
    enum: ['Non-funded', 'Jointly Funded', 'External Grant'], 
    default: 'Non-funded' 
  },
  
  // Article 9: Confidentiality
  confidentiality: { type: String, default: 'Standard' },
  
  // Article 12: Duration
  duration: { type: String },
  
  // Workflow Progress (Steps 1-10)
  currentStep: { type: Number, default: 1 },
  status: { 
    type: String, 
    enum: ['Draft', 'Under Review', 'Signed', 'Active', 'Terminated'], 
    default: 'Draft' 
  },
  
  signedDocumentUrl: { type: String }, // Link to PDF (Cloudinary/S3)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoU', MoUSchema);