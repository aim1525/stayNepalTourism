class FonepayAdapter {
  constructor() {
    this.merchantCode = process.env.FONEPAY_MERCHANT_CODE || 'FONEPAYTEST';
  }

  async initiate(bookingId, amount, returnUrl) {
    const transactionId = `FONEPAY-STAYNEPAL-${bookingId}-${Date.now()}`;
    return {
      gateway: 'fonepay',
      transactionId,
      qrCodeData: `fonepay://pay?merchant=${this.merchantCode}&amount=${amount}&ref=${transactionId}`,
      paymentUrl: 'https://dev-fonepay.com/api/merchantRequest',
      instructions: 'Scan QR code or confirm via FonePay mobile app.'
    };
  }

  async verify(transactionDetails) {
    const { PRN, PID, transactionId } = transactionDetails;
    if (PRN || PID || transactionId) {
      return {
        success: true,
        gateway: 'fonepay',
        transactionId: transactionId || PRN || PID,
        refId: 'FONEPAY-REF-' + Math.floor(Math.random() * 899999 + 100000),
        status: 'success',
        rawResponse: { responseCode: '00', responseDescription: 'Success' }
      };
    }
    return {
      success: false,
      gateway: 'fonepay',
      status: 'failed',
      error: 'Fonepay payment verification failed'
    };
  }
}

module.exports = FonepayAdapter;
