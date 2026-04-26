import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SubscriptionEmailParams {
  to: string;
  tier: string;
  amount: number;
}

export async function sendSubscriptionEmail({ to, tier, amount }: SubscriptionEmailParams) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log('SMTP not configured, skipping email notification');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #141414; color: white; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { color: #e50914; font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 2rem; }
        .card { background: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid rgba(255,255,255,0.1); }
        .badge { display: inline-block; background: #e50914; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
        h1 { font-size: 1.5rem; margin: 1rem 0; }
        .details { background: rgba(255,255,255,0.05); border-radius: 8px; padding: 16px; margin: 1rem 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .detail-row:last-child { border-bottom: none; }
        .label { color: #999; }
        .value { font-weight: 600; }
        .footer { text-align: center; color: #666; font-size: 0.8rem; margin-top: 2rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">▶ Cinway</div>
        <div class="card">
          <div class="badge">${tier} Plan</div>
          <h1>Subscription Confirmed!</h1>
          <p style="color: #ccc;">Thank you for subscribing to Cinway. Your premium access is now active.</p>
          <div class="details">
            <div class="detail-row">
              <span class="label">Plan</span>
              <span class="value">${tier}</span>
            </div>
            <div class="detail-row">
              <span class="label">Amount</span>
              <span class="value">₹${amount}/month</span>
            </div>
            <div class="detail-row">
              <span class="label">Status</span>
              <span class="value" style="color: #46d369;">Active</span>
            </div>
          </div>
          <p style="color: #999; font-size: 0.9rem;">Enjoy unlimited ad-free streaming across all your devices.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Cinway. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Cinway" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: `Cinway — ${tier} Subscription Confirmed`,
      html,
    });
    console.log(`Subscription email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
