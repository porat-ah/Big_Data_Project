const ES = require('../../elasticsearch/kafka_elasticsearch_connector')

async function search(branch_name, date) {
	console.log(branch_name);
	var data_arr = await ES.eSearchAll(ES.indexName(branch_name), {'date':date});
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