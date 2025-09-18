import QRCode from 'qrcode'

export async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text)
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    return ''
  }
}

export function generatePaymentText(registrationId: string, eventTitle: string): string {
  return `Pagamento PIX para o evento: ${eventTitle} - Registro: ${registrationId}`
}