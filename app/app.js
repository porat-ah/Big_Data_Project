const express = require('express')
const app = express()
const socketIO = require('socket.io');
const server = express()
  .use(app)
  .listen(3000, () => console.log(`Listening Socket on http://localhost:3000`));
const io = socketIO(server);
module.exports = io

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'))


const dashboard = require('./dashboard/controller')
app.use(dashboard)



const association = require('./association/controller')
app.use(association)
