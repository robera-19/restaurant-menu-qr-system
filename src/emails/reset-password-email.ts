export function resetPasswordEmail(
  fullName: string,
  resetUrl: string,
) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">

      <h2>Hello ${fullName}</h2>

      <p>
        Someone requested to reset your password.
      </p>

      <a
        href="${resetUrl}"
        style="
          background:#dc2626;
          color:white;
          padding:14px 22px;
          border-radius:8px;
          text-decoration:none;
          display:inline-block;
          margin:20px 0;
        "
      >
        Reset Password
      </a>

      <p>
        This link expires in 1 hour.
      </p>

      <p>
        If you didn't request this, simply ignore this email.
      </p>

    </div>
  `;
}