const express = require('express')
const app = express();
// var server = require('http').createServer(app);
const socketIO = require('socket.io');
const dashboard = require('./dashboard');
const redis = require('./redis_connector')
const port=3000;

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  var data = {
    cards: dashboard.create_cards(await redis.cards_info()),
  };
  res.render("pages/dashboard", data)
})


const server = express()
  .use(app)
  .listen(3000, () => console.log(`Listening Socket on http://localhost:3000`));
const io = socketIO(server);

io.on("connection", async (socket) => {  
  console.log("conncted");
  io.emit("top_5_branches", dashboard.create_bar_chart(await redis.top_5_branches()));
  io.emit("top_5_toppings", dashboard.create_bar_chart(await redis.top_5_toppings()));
});

io.on("update", async (msg)=>{
  console.log('update')
  io.emit("top_5_branches", dashboard.create_bar_chart(await redis.top_5_branches()));
  io.emit("top_5_toppings", dashboard.create_bar_chart(await redis.top_5_toppings()));
})


