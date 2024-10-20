const {StatusCodes} = require('http-status-codes')
const { AppError } = require('../utils/errors/app-error')
async function ping(req,res) {
  return res.status(StatusCodes.OK).json({
    success:true,
    message:'API is live',
    data:{},
    error:{}
  })
}

module.exports = {
  ping
}