const express = require('express')
const router = express.Router()
// const dashboard = require('./dashboard');
// const redis = require('./redis_connector')
// const io = require('../app')


router.get('/search', async (req, res) => {
  d = new Date()
  var hr = d.getHours();
  var min = d.getMinutes();
  if (min < 10) {
      min = "0" + min;
  }
  var data = {
    show_list: false,
    time: `${hr}:${min}`,
    association_active: "",
    dashboard_active: "",
    search_active: "active",
    page_title: "Search"
  };
  res.render("pages/search", data)
})

router.post("/search", (req, res)=> {
  console.log(req.body)
  d = new Date()
  var hr = d.getHours();
  var min = d.getMinutes();
  if (min < 10) {
      min = "0" + min;
  }
  var data = {
    show_list: true,
    rows: [
  ],
    time: `${hr}:${min}`,
    association_active: "",
    dashboard_active: "",
    search_active:"active",
    page_title: "Search"
  };
  res.render("pages/search", data)
})

module.exports = router


