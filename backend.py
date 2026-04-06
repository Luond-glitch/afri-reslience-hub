"""
ARHICA Backend - Flask API
Handles newsletter subscriptions via Jetsmail and contact form emails.

Setup:
  pip install flask flask-cors requests python-dotenv

Run:
  python backend.py

Environment variables (.env file):
  JETSMAIL_API_KEY=your_api_key_here
  JETSMAIL_LIST_ID=your_list_id_here
  CONTACT_EMAIL=arhicakis@gmail.com
  SECRET_KEY=your_secret_key
"""

import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:*", "https://arhica.org", "https://www.arhica.org"])
app.secret_key = os.getenv("SECRET_KEY", "arhica-secret-2025")

# ── CONFIG ──────────────────────────────────────────────────────
JETSMAIL_API_KEY = os.getenv("JETSMAIL_API_KEY", "")
JETSMAIL_LIST_ID = os.getenv("JETSMAIL_LIST_ID", "")
JETSMAIL_BASE_URL = "https://api.jetsmail.net/v1"  # Update with real Jetsmail API base URL

CONTACT_EMAIL = os.getenv("CONTACT_EMAIL", "arhicakis@gmail.com")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")


# ── HELPERS ─────────────────────────────────────────────────────

def jetsmail_subscribe(email: str, name: str = "") -> dict:
    """Add subscriber to Jetsmail list."""
    headers = {
        "Authorization": f"Bearer {JETSMAIL_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "email": email,
        "list_id": JETSMAIL_LIST_ID,
        "status": "active",
        "merge_fields": {
            "FNAME": name,
            "SOURCE": "ARHICA Website",
        }
    }
    try:
        resp = requests.post(
            f"{JETSMAIL_BASE_URL}/subscribers",
            headers=headers,
            json=payload,
            timeout=10
        )
        return {"ok": resp.status_code in (200, 201), "status": resp.status_code, "body": resp.json()}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def send_email(to_email: str, subject: str, body_html: str, body_text: str = "") -> bool:
    """Send email via SMTP."""
    if not SMTP_USER or not SMTP_PASS:
        print(f"[EMAIL SKIPPED] To: {to_email} | Subject: {subject}")
        return True  # Dev mode: skip sending

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"ARHICA <{SMTP_USER}>"
    msg["To"] = to_email

    if body_text:
        msg.attach(MIMEText(body_text, "plain"))
    msg.attach(MIMEText(body_html, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, to_email, msg.as_string())
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False


# ── ROUTES ──────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def index():
    return jsonify({"status": "ARHICA API running", "version": "1.0"})


@app.route("/api/subscribe", methods=["POST"])
def subscribe():
    """Newsletter subscription via Jetsmail."""
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    name = (data.get("name") or "").strip()

    if not email or "@" not in email:
        return jsonify({"success": False, "message": "Valid email required"}), 400

    result = jetsmail_subscribe(email, name)

    if result.get("ok"):
        # Send welcome email
        welcome_html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#0b5e3e;padding:32px;text-align:center;">
            <h1 style="color:white;font-size:2rem;margin:0;">ARHICA</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Building Resilience. Leaving No One Behind.</p>
          </div>
          <div style="padding:32px;background:#f8faf7;">
            <h2 style="color:#0b5e3e;">Welcome to the ARHICA Community!</h2>
            <p>Thank you for subscribing, {name or 'friend'}. You'll now receive updates on our initiatives across the Lake Victoria Basin — from sustainable aquaculture and climate action to youth empowerment and food systems.</p>
            <a href="https://arhica.org" style="display:inline-block;background:#0b5e3e;color:white;padding:12px 28px;border-radius:30px;text-decoration:none;font-weight:600;margin-top:16px;">Visit Our Website</a>
          </div>
          <div style="padding:20px 32px;background:#073d27;text-align:center;">
            <p style="color:rgba(255,255,255,0.5);font-size:0.8rem;margin:0;">
              ARHICA · Kisumu City, Lake Victoria Basin, Kenya<br>
              arhicakis@gmail.com · +254728697188
            </p>
          </div>
        </div>
        """
        send_email(email, "Welcome to ARHICA — Thank You for Subscribing!", welcome_html)

        return jsonify({"success": True, "message": "Successfully subscribed!"}), 201

    body = result.get("body", {})
    msg = body.get("message", "") if isinstance(body, dict) else ""
    if "already" in msg.lower():
        return jsonify({"success": True, "message": "You are already subscribed!"}), 200

    return jsonify({"success": False, "message": "Subscription failed. Please try again."}), 500


@app.route("/api/contact", methods=["POST"])
def contact():
    """Handle contact form submissions."""
    data = request.get_json(silent=True) or {}

    name    = (data.get("name") or "").strip()
    email   = (data.get("email") or "").strip()
    subject = (data.get("subject") or "Website Enquiry").strip()
    message = (data.get("message") or "").strip()
    org     = (data.get("organization") or "").strip()

    if not all([name, email, message]):
        return jsonify({"success": False, "message": "Name, email and message are required"}), 400

    # Email to ARHICA team
    team_html = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#0b5e3e;padding:24px;color:white;">
        <h2 style="margin:0;">New Contact Form Submission — ARHICA Website</h2>
      </div>
      <div style="padding:24px;background:#f8faf7;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:600;width:140px;">Name:</td><td style="padding:8px;">{name}</td></tr>
          <tr><td style="padding:8px;font-weight:600;">Email:</td><td style="padding:8px;"><a href="mailto:{email}">{email}</a></td></tr>
          {"<tr><td style='padding:8px;font-weight:600;'>Organization:</td><td style='padding:8px;'>" + org + "</td></tr>" if org else ""}
          <tr><td style="padding:8px;font-weight:600;">Subject:</td><td style="padding:8px;">{subject}</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:white;border-left:4px solid #0b5e3e;border-radius:4px;">
          <strong>Message:</strong><br><br>
          {message.replace(chr(10), "<br>")}
        </div>
      </div>
    </div>
    """

    # Auto-reply to sender
    reply_html = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#0b5e3e;padding:32px;text-align:center;">
        <h1 style="color:white;margin:0;">ARHICA</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">AfriResilience Hub for Inclusive Climate Action</p>
      </div>
      <div style="padding:32px;background:#f8faf7;">
        <h2 style="color:#0b5e3e;">Thank you, {name}!</h2>
        <p>We've received your message and will get back to you within 2 business days.</p>
        <div style="background:white;border-left:4px solid #d97706;padding:16px;border-radius:4px;margin:20px 0;">
          <strong>Your message:</strong><br><br>{message[:300]}{"..." if len(message) > 300 else ""}
        </div>
        <p style="color:#4b5563;font-size:0.9rem;">
          In the meantime, explore our work at <a href="https://arhica.org" style="color:#0b5e3e;">arhica.org</a>
          or follow us on social media for the latest updates.
        </p>
      </div>
      <div style="padding:20px;background:#073d27;text-align:center;">
        <p style="color:rgba(255,255,255,0.5);font-size:0.8rem;margin:0;">
          ARHICA · Kisumu City, Lake Victoria Basin, Kenya<br>
          +254728697188 · arhicakis@gmail.com
        </p>
      </div>
    </div>
    """

    team_ok = send_email(CONTACT_EMAIL, f"[ARHICA Contact] {subject} — from {name}", team_html)
    send_email(email, "ARHICA: We've received your message", reply_html)

    if team_ok:
        return jsonify({"success": True, "message": "Message sent! We'll be in touch soon."}), 200
    return jsonify({"success": False, "message": "Failed to send. Please email us directly at arhicakis@gmail.com"}), 500


@app.route("/api/partner", methods=["POST"])
def partner():
    """Handle partnership enquiries."""
    data = request.get_json(silent=True) or {}
    name    = (data.get("name") or "").strip()
    email   = (data.get("email") or "").strip()
    org     = (data.get("organization") or "").strip()
    interest = (data.get("interest") or "General Partnership").strip()
    message = (data.get("message") or "").strip()

    if not all([name, email]):
        return jsonify({"success": False, "message": "Name and email are required"}), 400

    html = f"""
    <div style="font-family:sans-serif;max-width:600px;">
      <div style="background:#073d27;padding:24px;color:white;">
        <h2 style="margin:0;">🤝 New Partnership Enquiry — ARHICA</h2>
      </div>
      <div style="padding:24px;background:#f8faf7;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:600;width:160px;">Name:</td><td style="padding:8px;">{name}</td></tr>
          <tr><td style="padding:8px;font-weight:600;">Email:</td><td style="padding:8px;">{email}</td></tr>
          <tr><td style="padding:8px;font-weight:600;">Organization:</td><td style="padding:8px;">{org or "N/A"}</td></tr>
          <tr><td style="padding:8px;font-weight:600;">Interest Area:</td><td style="padding:8px;">{interest}</td></tr>
        </table>
        {f'<div style="margin-top:16px;padding:14px;background:white;border-left:4px solid #0b5e3e;">{message}</div>' if message else ""}
      </div>
    </div>
    """

    send_email(CONTACT_EMAIL, f"[ARHICA Partnership] {interest} — {name} ({org})", html)
    return jsonify({"success": True, "message": "Partnership enquiry received. We'll be in touch!"}), 200


# ── START ────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    print(f"\n🌿 ARHICA Backend running on http://localhost:{port}")
    print(f"   Jetsmail Key: {'✓ Set' if JETSMAIL_API_KEY else '✗ Not set (configure in .env)'}")
    print(f"   SMTP: {'✓ Set' if SMTP_USER else '✗ Not set (emails will be skipped in dev)'}\n")
    app.run(host="0.0.0.0", port=port, debug=debug)
