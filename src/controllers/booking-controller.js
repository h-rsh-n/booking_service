const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../service");
const {successMessage,errorMessage} = require('../utils/common')
const inMemoryDB = {}

async function createBooking(req,res){
  try {
    const booking = await BookingService.createBooking({
      flightId:req.body.flightId,
      userId:req.headers['x-user-id'],
      email:req.headers['x-user-gmail'],
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
    const idempotencyKey = req.headers['x-idempotency-key'];
    if(!idempotencyKey){
      errorMessage.error = `Missing idempotency key`
      return res.status(StatusCodes.BAD_REQUEST).json(errorMessage);
    }
    if(inMemoryDB[idempotencyKey] = idempotencyKey && inMemoryDB[idempotencyKey]!=undefined){
      errorMessage.error = `Cannot retry on a successful payment`
      return res.status(StatusCodes.BAD_REQUEST).json(errorMessage)
    }
    const payment = await BookingService.makePayment({
      userId:req.headers['x-user-id'],
      email:req.headers['x-user-gmail'],
      bookingId:req.body.bookingId,
      cost:req.body.cost
    })
    inMemoryDB[idempotencyKey] = idempotencyKey;
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