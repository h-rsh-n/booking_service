const cron = require('node-cron');
const {BookingService} = require('../../service')

function scheduleCornJob(){
  cron.schedule('*/30 * * * *',async()=>{
    const response = await BookingService.cancelOldBookings();
  })
}

module.exports = {
  scheduleCornJob
}