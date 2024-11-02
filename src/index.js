const express = require('express')
const {serverConfig,loggerConfig} = require('./config')
const {Queue} = require('./utils/common')
const amqp = require('amqplib');
const app = express();
const apiRouter = require('./routes')
const CRON = require('./utils/common/cron')


app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api',apiRouter);

app.listen(serverConfig.PORT,()=>{
  console.log(`Server started on port ${serverConfig.PORT}`);
  CRON.scheduleCornJob();
  Queue.connectQueue();
})