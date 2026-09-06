import { supabase } from "../config/supabase.js";

/*
MOU SCHEMA STYLE
(Supabase Compatible)
*/

const MoUSchema = {
  partnerName: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  sector: {
    type: String,
  },

  description: {
    type: String,
  },

  objectives: {
    type: String,
  },

  fundingType: {
    type: String,
    enum: [
      "Non-funded",
      "Jointly Funded",
      "External Grant",
    ],
    default: "Non-funded",
  },

  confidentiality: {
    type: String,
    default: "Standard",
  },

  duration: {
    type: String,
  },

  // Added (from frontend)
  expectedDuration: {
    type: String,
  },

  // Workflow
  currentStep: {
    type: Number,
    default: 1,
  },

  status: {
    type: String,
    enum: [
      "Draft",
      "Pending Validation",
      "Under Review",
      "Signed",
      "Active",
      "Terminated",
    ],
    default: "Draft",
  },

  // Files
  initialDocumentUrl: {
    type: String,
  },

  fileUrl: {
    type: String,
  },

  signedDocumentUrl: {
    type: String,
  },

  // Tracking
  createdBy: {
    type: String,
    ref: "User",
  },

  lastModifiedBy: {
    type: String,
    ref: "User",
  },

  signingDate: {
    type: Date,
  },

  // Added (from frontend)
  dateInitiated: {
    type: Date,
  },
};

/*
MOU MODEL
(Supabase Methods)
*/

const MoU = {
  /*
  CREATE MOU
  */
  create: async (payload) => {
    return await supabase
      .from("mous")
      .insert([
        {
          partnerName: payload.partnerName,
          country: payload.country,
          sector: payload.sector,
          description: payload.description,
          objectives: payload.objectives,
          funding_type: payload.fundingType,
          confidentiality: payload.confidentiality,
          duration: payload.duration,
          expected_duration:
            payload.expectedDuration,
          current_step: payload.currentStep,
          status: payload.status,
          initial_document_url:
            payload.initialDocumentUrl,
          file_url: payload.fileUrl,
          signed_document_url:
            payload.signedDocumentUrl,
          created_by: payload.createdBy,
          last_modified_by:
            payload.lastModifiedBy,
          signing_date: payload.signingDate,
          date_initiated:
            payload.dateInitiated,
        },
      ])
      .select()
      .single();
  },

  /*
  GET ALL MOUS
  */
  find: async () => {
    return await supabase
      .from("mous")
      .select("*")
      .order("created_at", {
        ascending: false,
      });
  },

  /*
  FIND ONE MOU
  */
  findById: async (id) => {
    return await supabase
      .from("mous")
      .select("*")
      .eq("id", id)
      .maybeSingle();
  },

  /*
  UPDATE MOU
  */
  updateById: async (id, updates) => {
    return await supabase
      .from("mous")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
  },

  /*
  DELETE MOU
  */
  deleteById: async (id) => {
    return await supabase
      .from("mous")
      .delete()
      .eq("id", id);
  },
};

export default MoU;