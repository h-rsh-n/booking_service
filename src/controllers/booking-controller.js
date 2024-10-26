const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../service");
const {successMessage,errorMessage} = require('../utils/common')

async function createBooking(req,res){
  try {
    const booking = await BookingService.createBooking({
      flightId:req.body.flightId,
      userId:req.body.userId,
      noOfSeats:req.body.noOfSeats
    })
    //console.log(booking)
    successMessage.data = booking;
    return res.status(StatusCodes.OK).json(successMessage);
  } catch (error) {
    console.log(error)
    errorMessage.error = error;
    return res.status(error.statusCode).json(errorMessage);
  }
}

async function makePayment(req,res) {
  try {
    const payment = await BookingService.makePayment({
      userId:req.body.userId,
      bookingId:req.body.bookingId,
      cost:req.body.cost
    })
    successMessage.data = payment;
    return res.status(StatusCodes.OK).json(successMessage);
  } catch (error) {
    errorMessage.error = error;
    return res.status(error.statusCode).json(errorMessage);
  }
}

module.exports = {
  createBooking,
  makePayment
}