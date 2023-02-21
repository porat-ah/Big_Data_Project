socket.on("top_5_branches", (msg)=> {
    console.log(msg);
    md.initDashboardPageBarChart("#top_5_branches",msg.label, msg.data)
  })

socket.on("top_5_toppings", (msg)=> {
    console.log(msg);
    md.initDashboardPageBarChart("#top_5_toppings",msg.label, msg.data)
  })

socket.on("orders_time", (msg)=> {
    console.log(msg);
    md.initDashboardPageLineChart("#orders_time",msg.label, msg.data)
  })

socket.on("orders_location", (msg)=> {
    console.log(msg);
    md.initDashboardPagePieChart("#orders_location",msg.label, msg.data)
  })

  