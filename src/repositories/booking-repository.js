const {Booking} = require('../models')
const CrudRepository = require('./curd-repository');

class BookingRepository extends CrudRepository{
  constructor(){
    super(Booking)
  }
}

module.exports = {
  BookingRepository
}