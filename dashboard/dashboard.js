

function create_cards(info) {
   console.log(info)
     return [
        { title: "open orders", value: info[0], unit: "orders",  icon: "local_pizza" },
        { title: "number of orders today", value: info[1], unit: "orders",  icon: "assignment_turned_in" },
        { title: "number of open branchs", value: info[2], unit: "branch",  icon: "info" },
        { title: "order average time", value: info[3], unit: "minutes",  icon: "local_shipping" }
     ]
}

function create_bar_chart(info) {
  label = []
  data = []
  for (let i = 0; i < info.length; i++) {
    label.push(info[i][0])
    data.push(info[i][1])
   }
   return {label: label, data: data};
}
function create_line_chart(info, id){
   return line_md = {
      initLineChart: function() {
          data = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
              [42, 17, 7, 17, 23, 18, 38]
            ]
          };
    
          options = {
            lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
            }),
            low: 0,
            high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
          }
    
          var Chart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);
    
          md.startAnimationForLineChart(Chart);
      },
    
    
      startAnimationForLineChart: function(chart) {
    
        chart.on('draw', function(data) {
          if (data.type === 'line' || data.type === 'area') {
            data.element.animate({
              d: {
                begin: 600,
                dur: 700,
                from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                to: data.path.clone().stringify(),
                easing: Chartist.Svg.Easing.easeOutQuint
              }
            });
          } else if (data.type === 'point') {
            seq++;
            data.element.animate({
              opacity: {
                begin: seq * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
          }
        });
    
        seq = 0;
      },
    }
}






module.exports = {create_cards: create_cards, create_bar_chart:create_bar_chart}