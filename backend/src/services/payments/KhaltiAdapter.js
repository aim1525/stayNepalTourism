class KhaltiAdapter {
  constructor() {
    this.publicKey = process.env.KHALTI_PUBLIC_KEY || 'Key 80007a50700e46978835c9261322080c';
    this.sandboxUrl = 'https://a.khalti.com/api/v2/epayment/initiate/';
  }

  async initiate(bookingId, amount, returnUrl) {
    const transactionId = `KHALTI-STAYNEPAL-${bookingId}-${Date.now()}`;
    const amountInPaisa = Math.round(amount * 100);

    return {
      gateway: 'khalti',
      transactionId,
      paymentUrl: 'https://test-pay.khalti.com/',
      pidx: 'khalti_pidx_' + Math.random().toString(36).substring(2, 9),
      amount: amountInPaisa,
      returnUrl: `${returnUrl}?gateway=khalti&pid=${transactionId}`
    };
  }

  async verify(transactionDetails) {
    const { pidx, pid, token } = transactionDetails;
    if (pidx || pid || token) {
      return {
        success: true,
        gateway: 'khalti',
        transactionId: pid || pidx || 'KHALTI-TXN-' + Date.now(),
        refId: 'KHALTI-REF-' + Math.floor(Math.random() * 899999 + 100000),
        status: 'success',
        rawResponse: { state: { idx: pidx, name: 'Completed' } }
      };
    }
    return {
      success: false,
      gateway: 'khalti',
      status: 'failed',
      error: 'Khalti payment verification token missing'
    };
  }
}

module.exports = KhaltiAdapter;
