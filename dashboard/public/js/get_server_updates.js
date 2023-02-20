socket.on("top_5_branches", (msg)=> {
    console.log(msg);
    md.initDashboardPageBarChart("#top_5_branches",msg.label, msg.data)
  })

socket.on("top_5_toppings", (msg)=> {
    console.log(msg);
    md.initDashboardPageBarChart("#top_5_toppings",msg.label, msg.data)
  })