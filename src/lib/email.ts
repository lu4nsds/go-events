import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(
  to: string,
  eventTitle: string,
  qrCode: string
) {
  // For development, we'll still log to console but also try to send
  if (process.env.NODE_ENV === "development") {
    console.log("=== EMAIL DE CONFIRMAÇÃO ===");
    console.log(`Para: ${to}`);
    console.log(`Assunto: Confirmação de Pagamento - ${eventTitle}`);
    console.log(`QR Code: ${qrCode}`);
    console.log("============================");
  }

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.log("⚠️ RESEND_API_KEY não configurada. Email não será enviado.");
    return;
  }

  try {
    // Para plano gratuito do Resend, só pode enviar para o email do proprietário
    const isFreePlan = !process.env.RESEND_VERIFIED_DOMAIN;
    const emailTo = isFreePlan ? "luan.s9d7s@gmail.com" : to;

    if (isFreePlan && to !== "luan.s9d7s@gmail.com") {
      console.log(
        `⚠️ Plano gratuito: Redirecionando email de ${to} para luan.s9d7s@gmail.com`
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Go Events <onboarding@resend.dev>", // Email padrão do Resend para testes
      to: [emailTo],
      subject: `Confirmação de Pagamento - ${eventTitle}${isFreePlan ? ` (enviado para ${to})` : ""}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb; text-align: center;">🎉 Pagamento Confirmado!</h2>
          
          ${
            isFreePlan && to !== emailTo
              ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>📧 Nota:</strong> Este email era para ser enviado para <strong>${to}</strong>, 
              mas devido às limitações do plano gratuito do Resend, foi redirecionado para seu email.
            </p>
          </div>
          `
              : ""
          }

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #374151; margin: 0;">
              ${isFreePlan && to !== emailTo ? `O usuário <strong>${to}</strong> teve seu` : "Seu"} pagamento para o evento <strong style="color: #2563eb;">${eventTitle}</strong> foi confirmado com sucesso!
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
    });

    if (error) {
      console.error("❌ Erro ao enviar email via Resend:", error);
      return;
    }

    console.log("✅ Email enviado com sucesso via Resend:", data?.id);
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
  }
}
