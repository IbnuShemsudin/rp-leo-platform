const escapeHtml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const getMouSubmittedTemplate = (partnerName, country, description, mouId, creatorName) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0c10; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
    <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
      <span style="color: #DE984B; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">SSGI RP-LEO System</span>
      <h2 style="color: #ffffff; margin: 8px 0 0 0; font-size: 20px;">New MoU Submission Received</h2>
    </div>

    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">A new partnership request has been filed and requires administrative validation:</p>

    <div style="background-color: rgba(255,255,255,0.03); padding: 20px; border-left: 4px solid #DE984B; border-radius: 8px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #DE984B;">Partner:</strong> ${escapeHtml(partnerName)} (${escapeHtml(country)})</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #DE984B;">Submitted By:</strong> ${escapeHtml(creatorName || "Unknown")}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #DE984B;">Description:</strong> ${escapeHtml(description || "No description provided")}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #DE984B;">MoU ID:</strong> ${escapeHtml(mouId)}</p>
      <p style="margin: 0; font-size: 14px;"><strong style="color: #DE984B;">Status:</strong> Pending Validation</p>
    </div>

    <p style="color: #64748b; font-size: 12px; margin-top: 32px;">This is an automated notification from the SSGI Regional Partnership platform.</p>
  </div>
`;

export const getMouSignedTemplate = (partnerName, contactPerson, mouId, signedDate, signerName) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0c10; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
    <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
      <span style="color: #DE984B; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">SSGI RP-LEO System</span>
      <h2 style="color: #ffffff; margin: 8px 0 0 0; font-size: 20px;">MoU Signed &amp; Activated</h2>
    </div>

    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">A Memorandum of Understanding has been signed and is now Active:</p>

    <div style="background-color: rgba(255,255,255,0.03); padding: 20px; border-left: 4px solid #10b981; border-radius: 8px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #DE984B;">Partner:</strong> ${escapeHtml(partnerName)}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #DE984B;">Contact Person:</strong> ${escapeHtml(contactPerson || "N/A")}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #DE984B;">Signed By:</strong> ${escapeHtml(signerName || "Executive")}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #DE984B;">Signed Date:</strong> ${escapeHtml(signedDate || new Date().toLocaleDateString())}</p>
      <p style="margin: 0; font-size: 14px;"><strong style="color: #DE984B;">MoU ID:</strong> ${escapeHtml(mouId)}</p>
    </div>

    <p style="color: #64748b; font-size: 12px; margin-top: 32px;">This is an automated notification from the SSGI Regional Partnership platform.</p>
  </div>
`;

export const getMouStatusTemplate = (partnerName, newStatus, currentStep, mouUrl) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0c10; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
    <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
      <span style="color: #DE984B; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">SSGI RP-LEO System</span>
      <h2 style="color: #ffffff; margin: 8px 0 0 0; font-size: 20px;">MoU Status Updated</h2>
    </div>

    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">The status of your MoU with <strong>${escapeHtml(partnerName)}</strong> has been updated:</p>
    
    <div style="background-color: rgba(255,255,255,0.03); padding: 20px; border-left: 4px solid #1C5675; border-radius: 8px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #DE984B;">New Status:</strong> ${escapeHtml(newStatus)}</p>
      <p style="margin: 0; font-size: 14px;"><strong style="color: #DE984B;">Current Step:</strong> Step ${currentStep} of 7</p>
    </div>

    ${mouUrl ? `
      <div style="margin: 28px 0 8px 0;">
        <a href="${escapeHtml(mouUrl)}" style="display: inline-block; background: #DE984B; color: #111827; padding: 13px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none;">View your MoU</a>
      </div>
    ` : ""}

    <p style="color: #64748b; font-size: 12px; margin-top: 24px;">This is an automated notification from the SSGI Regional Partnership platform.</p>
  </div>
`;
