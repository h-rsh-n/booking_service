const amqp = require('amqplib');
const {serverConfig} = require('../../config');

let connection,channel
async function connectQueue(){
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue(serverConfig.QUEUE);
  } catch (error) {
    throw error;
  }
}

async function sendData(data){
  try {
    await channel.sendToQueue(serverConfig.QUEUE,Buffer.from(JSON.stringify(data)));
  } catch (error) {
    throw error;
  }
}

module.exports = {
  connectQueue,
  sendData
}