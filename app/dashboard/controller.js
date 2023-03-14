const express = require('express')
const router = express.Router()
const dashboard = require('./dashboard');
const redis = require('./redis_connector')
const io = require('../app')


router.get('/', async (req, res) => {
  d = new Date()
  var hr = d.getHours();
  var min = d.getMinutes();
  if (min < 10) {
      min = "0" + min;
  }
  var data = {
    cards: dashboard.create_cards(await redis.cards_info()),
    time: `${hr}:${min}`,
    association_active: "",
    dashboard_active: "active",
    search_active: "",
    page_title: "Dashboard"
  };
  res.render("pages/dashboard", data)
})

io.on("connection", async (socket) => {  
  console.log("conncted");
  io.emit("top_5_branches", dashboard.create_chart(await redis.top_5_branches()));
  io.emit("top_5_toppings", dashboard.create_chart(await redis.top_5_toppings()));
  io.emit("orders_time", dashboard.create_chart(await redis.orders_time()));
  io.emit("orders_location", dashboard.create_chart(await redis.orders_location()));
});


module.exports = router


