const nodemailer = require("nodemailer");
const hits = new Map();
const EM = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clip = (s, n) => String(s == null ? "" : s).slice(0, n);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return res.status(500).json({ ok: false, error: "Email is not configured" });

  // basic abuse protection: 5 emails per IP per hour (per server instance)
  const ip = String(req.headers["x-forwarded-for"] || "x").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 36e5);
  if (recent.length >= 5) return res.status(429).json({ ok: false, error: "Too many requests" });
  recent.push(now); hits.set(ip, recent);

  let b = req.body;
  try { if (typeof b === "string") b = JSON.parse(b); } catch (e) { return res.status(400).json({ ok: false }); }
  b = b || {};

  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  const from = `"MediCare Hub (DEMO)" <${user}>`;
  try {
    if (b.type === "booking") {
      if (!EM.test(b.to || "") || !b.ref) return res.status(400).json({ ok: false, error: "Invalid request" });
      const rows = [["Reference", b.ref], ["Patient", b.name], ["Doctor", b.doctor + " (" + b.spec + ")"], ["Date", b.date], ["Time", b.time], ["Type", b.mode], ["Reason", b.reason || "-"]]
        .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#5f7186">${esc(k)}</td><td style="padding:6px 12px"><b>${esc(clip(v, 300))}</b></td></tr>`).join("");
      const html = `<div style="font-family:Arial,sans-serif;max-width:520px"><div style="background:#b91c1c;color:#fff;padding:8px 12px;font-weight:bold">DEMO WEBSITE - NOT A REAL OR VERIFIED MEDICAL FACILITY</div><h2 style="color:#0f766e">Appointment request received</h2><table>${rows}</table><p style="color:#5f7186;font-size:13px">This email comes from a student demo project. No real appointment has been made. In an emergency call 911.</p></div>`;
      await transporter.sendMail({ from, to: b.to, bcc: user, subject: `Your appointment request ${clip(b.ref, 20)} (DEMO)`, html, text: `Appointment request ${b.ref}\n${b.doctor}\n${b.date} ${b.time}\nThis is a demo; no real appointment exists.` });
    } else if (b.type === "contact") {
      if (!EM.test(b.email || "") || !b.message) return res.status(400).json({ ok: false, error: "Invalid request" });
      await transporter.sendMail({ from, to: user, replyTo: b.email, subject: "MediCare Hub contact form", html: `<p><b>${esc(clip(b.name, 80))}</b> (${esc(b.email)})</p><p>${esc(clip(b.message, 1500)).replace(/\n/g, "<br>")}</p>` });
    } else return res.status(400).json({ ok: false, error: "Unknown type" });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: "Email failed" });
  }
};
