const express = require('express')
const router = express.Router()
const bigML = require('./big_ml_connector')

router.get('/association', async (req, res) => {
  d = new Date()
  var hr = d.getHours();
  var min = d.getMinutes();
  if (min < 10) {
      min = "0" + min;
  }
  var data = {
    show_list: false,
    time: `${hr}:${min}`,
    association_active: "active",
    dashboard_active: "",
    search_active: "",
    page_title: "Association"
  };
  res.render("pages/association", data)
})

router.post("/association", (req, res)=> {
  d = new Date()
  var hr = d.getHours();
  var min = d.getMinutes();
  if (min < 10) {
      min = "0" + min;
  }
  var data = {
    show_list: true,
    rows: [],
    time: `${hr}:${min}`,
    association_active: "active",
    dashboard_active: "",
    search_active: "",
    page_title: "Association"
  };
  sr = bigML.create_sendResults(data, res);
  bigML.createPredictions(req.body.start,req.body.end,sr);
})

module.exports = router


