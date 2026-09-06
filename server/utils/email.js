import nodemailer from "nodemailer";

// Initialize Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailNotification = async ({ to, subject, htmlContent }) => {
  try {
    if (!to) {
      console.warn("⚠️ Email skipped: No target email address provided.");
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"SSGI RP-LEO System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    // Verify transporter connection first
    await transporter.verify();
    console.log("⚡ SMTP Connection Verified!");

    const info = await transporter.sendMail(mailOptions);
    console.log("✉️ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
  console.error("❌ NODEMAILER ERROR DETAILED:", error);
  throw error;
}
};