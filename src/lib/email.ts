import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendConfirmationEmail(
  to: string,
  eventTitle: string,
  qrCode: string
) {
  // For development, we'll just log the email content
  if (process.env.NODE_ENV === 'development') {
    console.log('=== EMAIL DE CONFIRMAÇÃO ===')
    console.log(`Para: ${to}`)
    console.log(`Assunto: Confirmação de Pagamento - ${eventTitle}`)
    console.log(`Conteúdo: Seu pagamento foi confirmado! QR Code: ${qrCode}`)
    console.log('============================')
    return
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Confirmação de Pagamento - ${eventTitle}`,
      html: `
        <h2>Pagamento Confirmado!</h2>
        <p>Seu pagamento para o evento <strong>${eventTitle}</strong> foi confirmado com sucesso.</p>
        <p>Seu QR Code de entrada:</p>
        <div style="font-family: monospace; font-size: 12px; background: #f5f5f5; padding: 10px; border-radius: 4px;">
          ${qrCode}
        </div>
        <p>Apresente este QR Code no evento para entrada.</p>
      `,
    })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
  }
}