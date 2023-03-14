const express = require('express')
const router = express.Router()
// const dashboard = require('./dashboard');
// const redis = require('./redis_connector')
// const io = require('../app')


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
      {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'},
    {Antecedent: 'olive', Consequent: 'mashroom', Support: '70',Confidance: '30'}
  ],
    time: `${hr}:${min}`,
    association_active: "active",
    dashboard_active: "",
    search_active: "",
    page_title: "Association"
  };
  res.render("pages/association", data)
})

module.exports = router


