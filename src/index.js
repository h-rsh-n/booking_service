const express = require('express')
const {serverConfig,loggerConfig} = require('./config')
const app = express();
const apiRouter = require('./routes')

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api',apiRouter);

app.listen(serverConfig.PORT,()=>{
  console.log(`Server started on port ${serverConfig.PORT}`);
})