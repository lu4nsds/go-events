import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail(
  to: string,
  eventTitle: string,
  qrCode: string
) {
  // For development, we'll still log to console but also try to send
  if (process.env.NODE_ENV === 'development') {
    console.log('=== EMAIL DE CONFIRMAÇÃO ===')
    console.log(`Para: ${to}`)
    console.log(`Assunto: Confirmação de Pagamento - ${eventTitle}`)
    console.log(`QR Code: ${qrCode}`)
    console.log('============================')
  }

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️ RESEND_API_KEY não configurada. Email não será enviado.')
    return
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Go Events <onboarding@resend.dev>', // Email padrão do Resend para testes
      to: [to],
      subject: `Confirmação de Pagamento - ${eventTitle}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb; text-align: center;">🎉 Pagamento Confirmado!</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #374151; margin: 0;">
              Seu pagamento para o evento <strong style="color: #2563eb;">${eventTitle}</strong> foi confirmado com sucesso!
            </p>
          </div>

          <div style="background: #1f2937; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #fbbf24;">🎫 Seu QR Code de Entrada:</h3>
            <div style="background: white; color: black; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px; word-break: break-all; text-align: center;">
              ${qrCode}
            </div>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>📱 Importante:</strong> Apresente este QR Code no evento para entrada. 
              Recomendamos salvar este email ou fazer um print da tela.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
            Go Events - Sistema de Gerenciamento de Eventos
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('❌ Erro ao enviar email via Resend:', error)
      return
    }

    console.log('✅ Email enviado com sucesso via Resend:', data?.id)
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
  }
}