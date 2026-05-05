import nodemailer from 'nodemailer';

function createTransporter() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  // Sin SMTP configurado: modo dev (Ethereal auto-account)
  return null;
}

export async function sendOtpEmail(email, code) {
  const transporter = createTransporter();

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#F9FFF9;border-radius:16px;border:1.5px solid #C8E6C9">
      <div style="text-align:center;margin-bottom:24px">
        <div style="display:inline-block;background:linear-gradient(135deg,#1B5E20,#43A047);color:#fff;font-size:22px;font-weight:900;padding:12px 20px;border-radius:12px;letter-spacing:-1px">I+</div>
        <h2 style="color:#1B5E20;margin:12px 0 4px;font-size:22px">INTEGRA+</h2>
        <p style="color:#666;font-size:13px;margin:0">Cálculo Integral</p>
      </div>
      <p style="color:#333;font-size:15px;margin-bottom:8px">Tu código de verificación es:</p>
      <div style="background:#fff;border:2px solid #2E7D32;border-radius:14px;padding:20px;text-align:center;margin:16px 0">
        <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:#2E7D32">${code}</span>
      </div>
      <p style="color:#888;font-size:12px;text-align:center">Válido por <strong>5 minutos</strong>. No compartas este código.</p>
    </div>`;

  if (!transporter) {
    // Modo dev: imprime en consola
    console.log(`\n📧 OTP para ${email}: ${code}\n`);
    return;
  }

  await transporter.sendMail({
    from: `"INTEGRA+" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${code} — Tu código de verificación INTEGRA+`,
    html,
  });
}

export async function sendResetEmail(email, code) {
  const transporter = createTransporter();

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#FFF8E1;border-radius:16px;border:1.5px solid #FFE082">
      <div style="text-align:center;margin-bottom:24px">
        <div style="display:inline-block;background:linear-gradient(135deg,#1B5E20,#43A047);color:#fff;font-size:22px;font-weight:900;padding:12px 20px;border-radius:12px;letter-spacing:-1px">I+</div>
        <h2 style="color:#1B5E20;margin:12px 0 4px;font-size:22px">INTEGRA+</h2>
        <p style="color:#666;font-size:13px;margin:0">Restablecer contraseña</p>
      </div>
      <p style="color:#333;font-size:15px;margin-bottom:8px">Recibiste este correo porque solicitaste restablecer tu contraseña.</p>
      <p style="color:#333;font-size:15px;margin-bottom:8px">Tu código de recuperación es:</p>
      <div style="background:#fff;border:2px solid #F57F17;border-radius:14px;padding:20px;text-align:center;margin:16px 0">
        <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:#E65100">${code}</span>
      </div>
      <p style="color:#888;font-size:12px;text-align:center">Válido por <strong>5 minutos</strong>. Si no solicitaste esto, ignora este correo.</p>
    </div>`;

  if (!transporter) {
    console.log(`\n🔑 RESET para ${email}: ${code}\n`);
    return;
  }

  await transporter.sendMail({
    from: `"INTEGRA+" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${code} — Restablecer contraseña INTEGRA+`,
    html,
  });
}
