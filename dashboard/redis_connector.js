const redis = require('redis-promisify');


const client = redis.createClient();


async function cards_info() {
    return [await client.getAsync('open_orders'), await client.getAsync('num_of_orders_today'),
    await client.getAsync('num_of_open_branches'), (Number(await client.getAsync('avg_time'))).toFixed()];
    
}

async function orders_time() {

    
}

async function top_5_toppings(){
    toppings = []
    for (let i = 1; i < 6; i++) {
        topping = await client.getAsync(`topping_num_${i}`)
        topping = [topping, await client.getAsync(`${topping}_ordered`)];
        toppings.push(topping);
    }
    console.log(toppings)
    return toppings;
}

async function top_5_branches() {
    branches = []
    for (let i = 1; i < 6; i++) {
        branch = [await client.getAsync(`branch_num_${i}_name`), (Number(await client.getAsync(`branch_num_${i}_time`))).toFixed()];
        branches.push(branch);
    }
    console.log(branches)
    return branches;
}

module.exports = {cards_info: cards_info, top_5_branches:top_5_branches, top_5_toppings: top_5_toppings}
