const redis = require('redis-promisify');


const client = redis.createClient();


async function cards_info() {
    return [await client.getAsync('open_orders'), await client.getAsync('num_of_orders_today'),
    await client.getAsync('num_of_open_branches'), (Number(await client.getAsync('avg_time'))).toFixed()];
    
}

async function orders_time() {
    var num_of_oreders_in_time = []
    for (let i = 0; i < 24; i++) {
        num_of_oreders_in_time.push([`${i}`, await client.getAsync(`num_of_orders_in_time_${i}`)] )
    }
    return num_of_oreders_in_time;
    
}

async function top_5_toppings(){
    var toppings = ['olive', 'mushrooms', 'corn', 'onion', 'tuna', 'jalapeno'];
    var number_of_toppings_ordered = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]];
    
    for (let i = 0; i < 6; i++) {
        number_of_toppings_ordered[i][0] = Number(await client.getAsync(`${toppings[i]}_ordered`));
    }

    number_of_toppings_ordered.sort((a,b) => b[0] - a[0]);
    toppings_5 = []
    for (let i = 0; i < 5; i++) {
        toppings_5.push([toppings[number_of_toppings_ordered[i][1]], number_of_toppings_ordered[i][0]]);
    }
    return toppings_5;
}

async function top_5_branches() {
    var branches_id = await client.smembersAsync('branches_id');
    branches_id = branches_id.map(Number);
    branches_time = []
    for (let i = 0; i < branches_id.length; i++) {
        var avg_time_of_branch = Number(await client.getAsync(`avg_time_branch_${branches_id[i]}`));
        if (avg_time_of_branch == 0) {
            avg_time_of_branch = 999;
        }
        branches_time.push([avg_time_of_branch, i]);
    }
    branches_time.sort((a,b) => a[0] - b[0]);
    branches = []
    for (let i = 0; i < 5; i++) {
        branch = [await client.getAsync(`branch_id_${branches_id[branches_time[i][1]]}_name`), (branches_time[i][0]).toFixed()];
        branches.push(branch);
    }
    return branches;
}

async function orders_location(){
    var location = ['North', 'Haifa', 'Dan', 'Central', 'South']
    var num_of_oreders_in_location = [];
    var sum = 0;
    var num;
    n = location.length
    for (let i = 0; i < n; i++) { 
        num = Number(await client.getAsync(`ordered_finishied_in_${location[i]}`))
        sum += num
        num_of_oreders_in_location.push([location[i],num] )
    }
    
    for (let i = 0; i < n; i++) { 
        num_of_oreders_in_location[i][1] = (num_of_oreders_in_location[i][1]*100)/sum;
    }
    num_of_oreders_in_location = [
        [ 'North', 15 ],
        [ 'Haifa', 66.66666666666667 ],
        [ 'Dan', 20 ],
        [ 'Central', 33.333333333333336 ],
        [ 'South', 75 ]
      ]
    return num_of_oreders_in_location;
}

module.exports = {
    cards_info: cards_info,
    top_5_branches:top_5_branches, 
    top_5_toppings: top_5_toppings,
    orders_time: orders_time,
    orders_location:orders_location
}
