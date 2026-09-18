import nodemailer from 'nodemailer'
import logger from '../utils/logger.js'

// Envio de correo por SMTP. Con Gmail hay que usar una contrasena de
// aplicacion (no la del correo) y dejar SMTP_HOST=smtp.gmail.com.
//
// Variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
//
// Si no estan configuradas, el correo no se manda y el contenido queda en el
// log del servidor: asi la recuperacion sigue siendo usable en desarrollo sin
// credenciales, y en produccion el problema se ve en el log en vez de romper
// la peticion del usuario.

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env

export const mailConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS)

let transporter = null
function getTransporter() {
  if (!mailConfigured) return null
  if (!transporter) {
    const port = Number(SMTP_PORT || 587)
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465, // 465 va cifrado desde el inicio; 587 usa STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    })
  }
  return transporter
}

export async function sendMail({ to, subject, html, text }) {
  const from = MAIL_FROM || SMTP_USER || 'no-reply@yenyleths.com'
  const tx = getTransporter()

  if (!tx) {
    logger.warn(
      `SMTP sin configurar: no se envio "${subject}" a ${to}. ` +
      `Contenido:\n${text || html}`
    )
    return { sent: false, reason: 'smtp-no-configurado' }
  }

  await tx.sendMail({ from, to, subject, html, text })
  logger.info(`Correo enviado a ${to}: ${subject}`)
  return { sent: true }
}

export function passwordResetEmail({ username, url, minutes }) {
  return {
    subject: 'Recupera tu contraseña — Yenyleths Boutique',
    text:
      `Hola ${username}:\n\n` +
      `Pediste recuperar tu contraseña. Abre este enlace para elegir una nueva:\n${url}\n\n` +
      `El enlace vence en ${minutes} minutos y sirve una sola vez.\n` +
      `Si no fuiste tú, ignora este correo: tu contraseña no cambia.\n\n` +
      `Yenyleths Boutique`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 520px; margin: 0 auto; color: #3b2f2a;">
        <div style="background: #8a4b1c; padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 20px;">Yenyleths Boutique</h1>
        </div>
        <div style="border: 1px solid #ecdfd4; border-top: 0; border-radius: 0 0 16px 16px; padding: 28px;">
          <p style="margin: 0 0 16px;">Hola <strong>${username}</strong>:</p>
          <p style="margin: 0 0 24px;">Pediste recuperar tu contraseña. Toca el botón para elegir una nueva.</p>
          <p style="text-align: center; margin: 0 0 24px;">
            <a href="${url}" style="display: inline-block; background: #8a4b1c; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600;">
              Elegir nueva contraseña
            </a>
          </p>
          <p style="margin: 0 0 8px; font-size: 13px; color: #6b5b53;">
            El enlace vence en ${minutes} minutos y sirve una sola vez.
          </p>
          <p style="margin: 0 0 16px; font-size: 13px; color: #6b5b53;">
            Si no fuiste tú, ignora este correo: tu contraseña no cambia.
          </p>
          <p style="margin: 0; font-size: 12px; color: #9a8b83; word-break: break-all;">${url}</p>
        </div>
      </div>
    `
  }
}
