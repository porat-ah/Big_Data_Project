const express = require('express')
const app = express()
const socketIO = require('socket.io');
const server = express()
  .use(app)
  .listen(3000, () => console.log(`Listening Socket on http://localhost:3000`));
const io = socketIO(server);
module.exports = io

app.set('views', './dashboard/views');
app.set('view engine', 'ejs');
app.use(express.static('./dashboard/public'))

const dashboard = require('./dashboard/controller')
app.use(dashboard)
