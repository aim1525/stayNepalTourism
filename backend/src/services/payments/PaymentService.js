class PaymentService {
  constructor(adapter) {
    if (!adapter) {
      throw new Error('PaymentService requires a concrete PaymentAdapter implementation');
    }
    this.adapter = adapter;
  }

  async initiatePayment(bookingId, amount, returnUrl) {
    return await this.adapter.initiate(bookingId, amount, returnUrl);
  }

  async verifyPayment(transactionDetails) {
    return await this.adapter.verify(transactionDetails);
  }
}

module.exports = PaymentService;
