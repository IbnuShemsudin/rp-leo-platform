import { supabase } from "../config/supabase.js";

/*
USER SCHEMA STYLE (for reference only)
*/

const UserSchema = {
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "staff", "executive"],
    default: "staff",
  },
};

/*
USER MODEL (Supabase version)
*/

const User = {
  /*
  CREATE USER
  */
  create: async (payload) => {
    return await supabase
      .from("users")
      .insert([
        {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role || "staff",
        },
      ])
      .select()
      .single();
  },

  /*
  FIND USER BY EMAIL
  */
  findByEmail: async (email) => {
    return await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
  },

  /*
  FIND USER BY ID
  */
  findById: async (id) => {
    return await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
  },

  /*
  GET ALL USERS
  */
  find: async () => {
    return await supabase
      .from("users")
      .select("*")
      .order("created_at", {
        ascending: false,
      });
  },

  /*
  UPDATE USER
  */
  updateById: async (id, updates) => {
    return await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
  },

  /*
  DELETE USER
  */
  deleteById: async (id) => {
    return await supabase
      .from("users")
      .delete()
      .eq("id", id);
  },
};

export default User;