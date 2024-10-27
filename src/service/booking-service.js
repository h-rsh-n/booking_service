const { default: axios } = require("axios")
const { AppError } = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const db = require('../models')
const {serverConfig} = require('../config');
const { BookingRepository } = require("../repositories/booking-repository");
const {ENUMS} = require('../utils/common');
const {BOOKED,CANCELLED} = ENUMS.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
    const flightData = flight.data.data;
    if(data.noOfSeats > flightData.totalSeats){
      throw new AppError(`Not enough seats availablt`,StatusCodes.BAD_REQUEST);
    }
    const totalBookingCost = data.noOfSeats*flightData.price;
    const bookingPayload = {...data,totalCost:totalBookingCost};
    const booking = await bookingRepository.createBooking(bookingPayload,transaction);
    const result = await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
      seats:data.noOfSeats
    });
    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    throw new AppError(error.message,StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function makePayment(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const booking = await bookingRepository.get(data.bookingId,transaction);
    if(booking.status == CANCELLED){
      throw new AppError(`Booking has expired`,StatusCodes.BAD_REQUEST);
    }
    const bookingTime = new Date(booking.createdAt);
    const currentTime = new Date();
    if(currentTime - bookingTime >300000){
      await cancelBooking(booking.id)
      throw new AppError(`Booking has expired`, StatusCodes.BAD_REQUEST)
    }
    if(booking.userId != data.userId){
      throw new AppError(`Wrong userId provided`,StatusCodes.BAD_REQUEST);
    }else if(booking.totalCost != data.cost){
      throw new AppError(`Wrong amount entered`,StatusCodes.BAD_REQUEST)
    }
    await bookingRepository.update(booking.id,{status:BOOKED},transaction)
    await transaction.commit();
    return true;
  } catch (error) {
    console.log(error)
    await transaction.rollback();
    if(error instanceof AppError){
      throw error;
    }
    throw new AppError(`Something went wrong while making payment`,StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function cancelBooking(bookingId) {
  const transaction = await db.sequelize.transaction();
  try {
    const booking = await bookingRepository.get(bookingId,transaction);
    if(booking.status == CANCELLED){
      await transaction.commit();
      return true;
    }
    await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${booking.flightId}/seats`,{
      seats:booking.noOfSeats,
      dec:0
    })
    await bookingRepository.update(bookingId,{status:CANCELLED},transaction);
    await transaction.commit();
  } catch (error) {
    console.log(error)
    await transaction.rollback();
    throw new AppError(`Something went wrong while CANCELLING the booking`,StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function cancelOldBookings() {
  const transaction = await db.sequelize.transaction();
  try {
    const time = new Date(new Date() - 5*60*1000) //get time before 5mins
    const response = await bookingRepository.cancelOldBookings(time,transaction);
    const extracedData = response.map((data)=>{
      return {
        bookingId:data.dataValues.id,
        flightId:data.dataValues.flightId,
        noOfSeats:data.dataValues.noOfSeats
      }
    })

    const bookingUpdatePromise = extracedData.map((item)=>{
      return bookingRepository.update(item.bookingId,{status:CANCELLED},transaction)
    })

    const seatUpdatePromise = extracedData.map((item)=>{
      return axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${item.flightId}/seats`,{
        seats:item.noOfSeats,
        dec:0
      })
    })

    await Promise.all(bookingUpdatePromise);
    await Promise.all(seatUpdatePromise);

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw new AppError("Something went wrong",StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  createBooking,
  makePayment,
  cancelOldBookings
}