"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationEmail = verificationEmail;
function verificationEmail(fullName, verificationUrl) {
    return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">

      <h2>Welcome ${fullName} 👋</h2>

      <p>
        Thank you for creating your Restaurant Menu account.
      </p>

      <p>
        Please verify your email by clicking the button below.
      </p>

      <a
        href="${verificationUrl}"
        style="
          background:#2563eb;
          color:white;
          padding:14px 22px;
          border-radius:8px;
          text-decoration:none;
          display:inline-block;
          margin:20px 0;
        "
      >
        Verify Email
      </a>

      <p>
        If you didn't create this account, you can ignore this email.
      </p>

      <hr>

      <small>
        Restaurant Menu System
      </small>

    </div>
  `;
}
