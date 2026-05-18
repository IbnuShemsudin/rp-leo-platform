import { supabase } from "../config/supabase.js";

/*
NOTIFICATION SCHEMA STYLE
(Supabase Compatible)
*/

const NotificationSchema = {
  title: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    default: "info",
  },

  read: {
    type: Boolean,
    default: false,
  },
};

/*
NOTIFICATION MODEL
(Supabase Methods)
*/

const Notification = {
  /*
  CREATE NOTIFICATION
  */
  create: async (payload) => {
    return await supabase
      .from("notifications")
      .insert([payload])
      .select()
      .single();
  },

  /*
  GET ALL NOTIFICATIONS
  */
  find: async () => {
    return await supabase
      .from("notifications")
      .select("*")
      .order("created_at", {
        ascending: false,
      });
  },

  /*
  FIND ONE NOTIFICATION
  */
  findById: async (id) => {
    return await supabase
      .from("notifications")
      .select("*")
      .eq("id", id)
      .maybeSingle();
  },

  /*
  UPDATE NOTIFICATION
  */
  updateById: async (id, updates) => {
    return await supabase
      .from("notifications")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
  },

  /*
  DELETE NOTIFICATION
  */
  deleteById: async (id) => {
    return await supabase
      .from("notifications")
      .delete()
      .eq("id", id);
  },
};

export default Notification;