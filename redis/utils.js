async function setup(client) {
    client.setAsync( 'avg_time', '0')
    client.setAsync('open_orders', '0');
    client.setAsync('num_of_orders_today', '0');
    client.setAsync('num_of_orders', '0');
    client.setAsync('num_of_finished_orders', '0');
    client.setAsync('num_of_open_branches', '0');
    reset_location(client);
    reset_toppings(client);
    reset_order_to_time(client);
}

async function branch_setup(message, client) {
    client.saddAsync('branches_id',`${message['branch_id']}`);
    client.setAsync(`branch_id_${message['branch_id']}_name`, message['branch_name']);
    client.setAsync(`avg_time_branch_${message['branch_id']}`, '0');
    client.setAsync(`num_of_finished_orders_branch_${message['branch_id']}`, '0');
}

async function branch_message(message, client) {
    if (message['status'] == 'open') {
        client.incrAsync('num_of_open_branches')
    }
    else{
        client.decrAsync('num_of_open_branches')
    }
}

async function order_message(message, client) {
    if (message['order_status'] == 'finished') {
        client.decrAsync('open_orders');
        avg_time(message, client);
        branch_avg_time(message, client);
        order_dist_by_location(message, client);
        order_to_time(message, client);
        client.delAsync(`order_${message['id']}_time`)

    }
    else{
        client.incrAsync( 'open_orders');
        client.incrAsync('num_of_orders_today');
        client.incrAsync('num_of_orders');
        client.setAsync(`order_${message['id']}_time`, message['time']);
        number_of_toppings_ordered(message, client);
    }
}

async function avg_time(message, client){
    var new_time_f = new Date(message['time']);
    var new_time_s = new Date(await client.getAsync(`order_${message['id']}_time`));
    var diff = diff_minutes(new_time_f, new_time_s);
    var old_avg = Number(await client.getAsync('avg_time'));
    var num = Number(await client.getAsync('num_of_finished_orders'));
    old_avg *= num;
    old_avg += diff;
    num++;
    old_avg /= num;
    client.setAsync('avg_time', `${old_avg}`);
    client.setAsync('num_of_finished_orders', `${num}`); 
}

async function branch_avg_time(message, client) {
    var new_time_f = new Date(message['time']);
    var new_time_s = new Date(await client.getAsync(`order_${message['id']}_time`));
    var diff = diff_minutes(new_time_f, new_time_s);
    var old_avg = Number(await client.getAsync(`avg_time_branch_${message['branch_id']}`));
    var num = Number(await client.getAsync(`num_of_finished_orders_branch_${message['branch_id']}`));
    old_avg *= num;
    old_avg += diff;
    num++;
    old_avg /= num;
    client.setAsync(`avg_time_branch_${message['branch_id']}`, `${old_avg}`);
    client.setAsync(`num_of_finished_orders_branch_${message['branch_id']}`, `${num}`);
    
    
}

async function number_of_toppings_ordered(message, client) {
    for (let i = 0; i < message['number_of_toppings']; i++) {
        client.incrAsync(`${message['toppings'][i]}_ordered`);
    }
}

async function order_dist_by_location(message, client) {
    client.incrAsync( `ordered_finishied_in_${message['location']}`)
}

async function order_to_time(message, client)  {
    var _time = new Date(message['time']);
    client.incrAsync( `num_of_orders_in_time_${_time.getHours()}`)
}

async function day_reset(client) {
    client.setAsync('num_of_orders_today', '0');
    reset_location(client);
    reset_toppings(client);
    reset_branch_data(client);
    reset_order_to_time(client);
}

async function reset_toppings(client){
    var toppings = ['olive', 'mushrooms', 'corn', 'onion', 'tuna', 'jalapeno'];
    for (let i = 0; i < toppings.length; i++) {
        client.setAsync(`${toppings[i]}_ordered`, '0');
    }
}

async function reset_location(client){
    var location = ['North', 'Haifa', 'Dan', 'Central', 'South']
    for (let i = 0; i < location.length; i++) {
        client.setAsync(`ordered_finishied_in_${location[i]}`, '0');  
    }
}

async function reset_branch_data(client){
    const branches_id = await client.smembersAsync('branches_id');
    branches_id = branches_id.map(Number);
    branches_id.forEach(id => {
        client.setAsync(`avg_time_branch_${id}`, '0');
        client.setAsync(`num_of_finished_orders_branch_${id}`, '0');
    });
}

async function reset_order_to_time(client){
    for (let i = 0; i < 24; i++) {
        client.setAsync(`num_of_orders_in_time_${i}`, '0');
    }
}

// ----- time functions -----

// https://www.w3resource.com/javascript-exercises/javascript-date-exercise-44.php
function diff_minutes(dt2, dt1) 
{
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

module.exports ={
    order_message: order_message,
    branch_message: branch_message,
    setup: setup,
    branch_setup: branch_setup,
    day_reset: day_reset
} 