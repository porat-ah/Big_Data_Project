const express = require('express')
const app = express()
var bodyParser = require('body-parser');
const socketIO = require('socket.io');
const server = express()
  .use(app)
  .listen(3000, () => console.log(`Listening Socket on http://localhost:3000`));
const io = socketIO(server);
module.exports = io

app.set('views', './app/views');
app.set('view engine', 'ejs');
app.use(express.static('./app/public'));
app.use( bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const dashboard = require('./dashboard/controller')
app.use(dashboard)



const association = require('./association/controller')
app.use(association)

const search = require('./search/controller')
app.use(search)

