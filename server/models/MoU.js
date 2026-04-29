const mongoose = require('mongoose');

const MoUSchema = new mongoose.Schema({
  partnerName: { type: String, required: true },
  country: { type: String, required: true },
  
  sector: { type: String }, 
  
  description: { type: String },

  objectives: { type: String },
  
  fundingType: { 
    type: String, 
    enum: ['Non-funded', 'Jointly Funded', 'External Grant'], 
    default: 'Non-funded' 
  },
  
  confidentiality: { type: String, default: 'Standard' },
  
  duration: { type: String },

  // Added (from frontend)
  expectedDuration: { type: String },

  // Workflow
  currentStep: { type: Number, default: 1 },
  
  status: { 
    type: String, 
    enum: [
      'Draft',
      'Pending Validation',
      'Under Review',
      'Signed',
      'Active',
      'Terminated'
    ], 
    default: 'Draft' 
  },

  // Files
  initialDocumentUrl: { type: String },
  fileUrl: { type: String },
  signedDocumentUrl: { type: String },

  // Tracking
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  signingDate: { type: Date },

  // Added (from frontend)
  dateInitiated: { type: Date }

}, { 
  timestamps: true 
});

module.exports = mongoose.model('MoU', MoUSchema);