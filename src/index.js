const express = require('express')
const {serverConfig,loggerConfig} = require('./config')
const amqp = require('amqplib');
const app = express();
const apiRouter = require('./routes')
const CRON = require('./utils/common/cron')

async function queueConnect(){
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    channel.assertQueue('noti_queue');
    setInterval(()=>{
      channel.sendToQueue('noti_queue', Buffer.from('hello world1'));
    },1000)
  } catch (error) {
    console.log(error)
  }
}
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api',apiRouter);

app.listen(serverConfig.PORT,()=>{
  console.log(`Server started on port ${serverConfig.PORT}`);
  CRON.scheduleCornJob();
  queueConnect();
})