const express = require('express');
const { bookingController } = require('../../controllers');
const {BookingMiddleware} = require('../../middlewares')
const router = express.Router();

router.post('/',BookingMiddleware.validateBookingCreate,bookingController.createBooking);
router.post('/payments',BookingMiddleware.validateMakePayment,bookingController.makePayment);

module.exports = router;