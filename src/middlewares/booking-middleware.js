const {StatusCodes} = require('http-status-codes');
const { AppError } = require('../utils/errors/app-error');
const { errorMessage } = require('../utils/common');

function validateBookingCreate(req,res,next){
  const validateFileds = ['flightId','noOfSeats'];
  const missingFileds = [];

  validateFileds.forEach((field)=>{
    if(!req.body[field]){
      missingFileds.push(`${field} is missing in the request body`);
    }
  })

  if(missingFileds.length>0){
    errorMessage.message = `Something went wrong while creating booking`;
    errorMessage.error = new AppError(missingFileds,StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessage);
  }
  next();
}

function validateMakePayment(req,res,next){
  const validate = ['bookingId','cost'];
  const missingFields = []

  validate.forEach((field)=>{
    if(!req.body[field]){
      missingFields.push(`${field} is missing in the req body`);
    }
  })

  if(missingFields.length>0){
    errorMessage.message = 'Something went wrong while making payment';
    errorMessage.error = new AppError(missingFields,StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessage);
  }

  next();
}

module.exports = {
  validateBookingCreate,
  validateMakePayment
}