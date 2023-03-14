function create_cards(info) {
   console.log(info)
     return [
        { title: "open orders", value: info[0], unit: "orders",  icon: "local_pizza" , color: "card-header-danger" },
        { title: "number of orders today", value: info[1], unit: "orders",  icon: "assignment_turned_in", color: "card-header-success" },
        { title: "number of open branchs", value: info[2], unit: "branch",  icon: "info", color: "card-header-info"},
        { title: "order average time", value: info[3], unit: "minutes",  icon: "local_shipping", color: "card-header-primary" }
     ]
}

function create_chart(info) {
  label = []
  data = []
  for (let i = 0; i < info.length; i++) {
    label.push(info[i][0])
    data.push(info[i][1])
   }
   return {label: label, data: data};
}


module.exports = {
  create_cards:create_cards,
  create_chart:create_chart
}