import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/*
GET notifications
*/

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(20);

    if (error) {
      return res.status(500).json({
        message: "Failed to fetch notifications",
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
});

/*
CREATE notification
*/

router.post("/", async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      role,
      link,
    } = req.body;

    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          title,
          message,
          type,
          role,
          link,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        message: "Failed to create notification",
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create notification",
    });
  }
});

export default router;