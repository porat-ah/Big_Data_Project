
function branch_message(message, client) {
    if (message['status'] == 'open') {
        client.incr('num_of_open_branchs')
    }
    else{
        client.decr('num_of_open_branchs')
    }
}


function order_message(message, client) {
    if (message['order_status'] == 'finished') {
        client.decr('open_orders');
        avg_time(message, client);
        order_dist_by_location(message, client);
        order_to_time(message, client);

    }
    else{
        client.incr('open_orders');
        client.incr('num_of_order_today');
        client.incr('num_of_orders');
        client.set(`order_${message['id']}_time`, message['time']);
        toppings_5(message, client);
    }
}

function avg_time(message, client){
    var new_time_f = new Date(message['time']);
    var new_time_s = new Date(client.get(`order_${message['id']}_time`));
    var diff = diff_minutes(new_time_f, new_time_s);
    var old_avg = client.get('avg_time');
    var num = client.get('num_of_finished_orders');
    old_avg *= num;
    old_avg += diff;
    num++;
    old_avg /= num;
    client.set('avg_time', old_avg);
    client.set('num_of_finished_orders', num);


    var old_avg = client.get(`avg_time_branch_${message['branch_id']}`);
    var num = client.get(`num_of_finished_orders_branch_${message['branch_id']}`);
    old_avg *= num;
    old_avg += diff;
    num++;
    old_avg /= num;
    client.set(`avg_time_branch_${message['branch_id']}`, old_avg);
    client.set(`num_of_finished_orders_branch_${message['branch_id']}`, num);
    var branch_id = message['branch_id'];
    var branch_name = message['branch_name'];
    var branch_avg_time = old_avg;
    for (let i = 1; i < 6; i++) {
        var avg_time_of_branch = client.get(`branch_num_${i}_time`);
        if (branch_avg_time < avg_time_of_branch) {
            var temp_name = client.get(`branch_num_${i}_name`);
            client.set(`branch_num_${i}_name`, branch_name);
            branch_name = temp_name;
            var temp_id = client.get(`branch_num_${i}_id`);
            client.set(`branch_num_${i}_id`, branch_id);
            branch_id = temp_id;
            client.set(`branch_num_${i}_time`, branch_avg_time);
            branch_avg_time = avg_time_of_branch;
        } 
    }
}

// https://www.w3resource.com/javascript-exercises/javascript-date-exercise-44.php
function diff_minutes(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
 }


 function toppings_5(message, client) {
    var toppings = ['olive', 'mushrooms', 'corn', 'onion', 'tuna', 'jalapeno'];
    var number_of_toppings_ordered = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]];
    for (let i = 0; i < message['number_of_toppings']; i++) {
        client.incr(`${message['toppings'][i]}_ordered`);
    }
    for (let i = 0; i < 6; i++) {
        number_of_toppings_ordered[i][0] = client.get(`${toppings[i]}_ordered`) 
    }
    number_of_toppings_ordered.sort((a,b) => a[0] > b[0]);
    for (let i = 1; i < 6; i++) {
        client.set(`topping_num_${i}`, toppings[number_of_toppings_ordered[i-1][1]]) 
    }
 }

 function order_dist_by_location(message, client) {
    client.incr(`ordered_finishied_in_${message['location']}`)
 }

 function order_to_time(message, client)  {
    var _time = new Date(message['time']);
    client.incr(`num_of_orders_in_time_${_time.getHours()}:${_time.getMinutes()}`)
 }

 module.exports ={order_message: order_message,branch_message: branch_message } 