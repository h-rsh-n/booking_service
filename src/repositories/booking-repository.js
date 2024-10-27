const {Booking} = require('../models')
const CrudRepository = require('./curd-repository');
const {AppError} = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const { Op } = require('sequelize');
const {ENUMS} = require('../utils/common');
const {BOOKED,CANCELLED} = ENUMS.BOOKING_STATUS;

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

  async cancelOldBookings(time,transaction){
    try {
      const cancelBooking = await Booking.findAll(
        {
          where: {
            [Op.and]: [
              { createdAt: { [Op.lt]: time } },
              { status: { [Op.ne]: BOOKED } },
              { status: { [Op.ne]: CANCELLED } },
            ],
          },
          logging: console.log, // Logs only this specific query
          transaction:transaction
        },
      );
      return cancelBooking;
    } catch (error) {
      console.log(error)
      throw new AppError('Something went wrong while deleteing ',StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}

module.exports = {
  BookingRepository
}