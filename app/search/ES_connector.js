require('dotenv').config({ path: './.env' })
const { Client } = require('@elastic/elasticsearch');


// Connection URL
const url = `http://localhost:9200`;

const client = new Client({ node: url });

function indexName(ind){
	var newInd = ind.toLowerCase();
	return newInd.replace(/[\s_,-\/\\\*\?"<>\|]/g,"");
}

async function eSearchAll(ind,q){
	const result = await client.search({index:ind,body:{query:{match_all:q}}},{ignore:[404]});
	if ('hits' in result){
		return result.hits.hits;
	}else{
		return [];
	}
}

async function search(branch_name, date) {
	var data_arr = await eSearchAll(indexName(branch_name), {'date':date});
	res = [];
	for (row in data_arr){
		var currRow = data_arr[row]._source;
		res.push({'time':getTime(currRow.time),'order_duration':currRow.order_duration,'number_of_toppings':currRow.number_of_toppings,'toppings':(currRow.toppings).toString()});
	}
    return res; 
}

function getTime(fullDate){
	var date = new Date(fullDate);
	return date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
}

module.exports = {
    search: search
}