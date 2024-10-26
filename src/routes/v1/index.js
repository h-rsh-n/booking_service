const express = require('express');
const router = express.Router();
const {pingController} = require('../../controllers')
const bookingRouter = require('./booking-routes')

router.use('/bookings',bookingRouter)
router.get('/ping',pingController.ping)

module.exports = router;