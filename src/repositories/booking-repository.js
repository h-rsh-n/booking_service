const {Booking} = require('../models')
const CrudRepository = require('./curd-repository');
const {AppError} = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes')

class BookingRepository extends CrudRepository{
  constructor(){
    super(Booking)
  }
  async createBooking(data,transaction){
    const response = await Booking.create(data,{transaction:transaction});
    return response;
  }

  async get(id,transaction){
    const response = await Booking.findByPk(id,{transaction:transaction});
    if(!response){
      throw new AppError('Requested item not found',StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async update(id,data,transaction){
    const response = await Booking.update(data,{
      where:{
        id:id
      },
      transaction:transaction
    })
    if(!response[0]){
      throw new AppError('Requested item not found',StatusCodes.NOT_FOUND);
    }
    return response[0];
  }
}

module.exports = {
  BookingRepository
}