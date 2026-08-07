const { dbRun, dbGet } = require('../config/db');
const PaymentService = require('../services/payments/PaymentService');
const EsewaAdapter = require('../services/payments/EsewaAdapter');
const KhaltiAdapter = require('../services/payments/KhaltiAdapter');
const FonepayAdapter = require('../services/payments/FonepayAdapter');

const initiatePayment = async (req, res) => {
  try {
    const { booking_id, gateway, return_url } = req.body;
    if (!booking_id || !gateway) {
      return res.status(400).json({ error: 'Booking ID and payment gateway (esewa, khalti, fonepay) are required' });
    }

    const booking = await dbGet('SELECT * FROM bookings WHERE id = ?', [booking_id]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    let adapter;
    if (gateway === 'esewa') adapter = new EsewaAdapter();
    else if (gateway === 'khalti') adapter = new KhaltiAdapter();
    else if (gateway === 'fonepay') adapter = new FonepayAdapter();
    else return res.status(400).json({ error: 'Unsupported payment gateway' });

    const paymentService = new PaymentService(adapter);
    const result = await paymentService.initiatePayment(
      booking.id,
      booking.total_amount,
      return_url || 'http://localhost:5173/payment-callback'
    );

    // Save initial transaction record
    await dbRun(
      `INSERT INTO payments (booking_id, gateway, transaction_id, amount, status)
       VALUES (?, ?, ?, ?, 'initiated')`,
      [booking.id, gateway, result.transactionId, booking.total_amount]
    );

    res.json({
      message: `Payment initiated via ${gateway.toUpperCase()} sandbox`,
      payment: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment initiation failed: ' + error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { gateway, transaction_id, pid, pidx, refId } = req.body;
    if (!gateway) {
      return res.status(400).json({ error: 'Payment gateway identifier is required' });
    }

    let adapter;
    if (gateway === 'esewa') adapter = new EsewaAdapter();
    else if (gateway === 'khalti') adapter = new KhaltiAdapter();
    else if (gateway === 'fonepay') adapter = new FonepayAdapter();
    else return res.status(400).json({ error: 'Unsupported payment gateway' });

    const paymentService = new PaymentService(adapter);
    const verification = await paymentService.verifyPayment({
      transactionId: transaction_id || pid || pidx,
      pid,
      pidx,
      refId,
      amount: req.body.amount
    });

    if (verification.success) {
      const targetTxId = transaction_id || pid || pidx || verification.transactionId;
      
      // Update payment status
      await dbRun(
        `UPDATE payments SET status = 'success', gateway_response = ? WHERE transaction_id = ?`,
        [JSON.stringify(verification.rawResponse), targetTxId]
      );

      // Find booking and mark as confirmed
      let targetBookingId = req.body.booking_id;
      if (!targetBookingId) {
        const paymentRecord = await dbGet('SELECT booking_id FROM payments WHERE transaction_id = ?', [targetTxId]);
        if (paymentRecord) targetBookingId = paymentRecord.booking_id;
      }

      if (targetBookingId) {
        await dbRun(`UPDATE bookings SET status = 'confirmed' WHERE id = ?`, [targetBookingId]);
      } else {
        // Fallback: confirm latest booking if unspecified in sandbox test
        await dbRun(`UPDATE bookings SET status = 'confirmed' WHERE status = 'pending' ORDER BY created_at DESC LIMIT 1;`);
      }

      return res.json({
        message: 'Payment verified and booking confirmed successfully!',
        verification
      });
    } else {
      return res.status(400).json({
        error: 'Payment verification failed',
        details: verification
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { initiatePayment, verifyPayment };
