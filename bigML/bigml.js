const bigml = require('bigml');
const fs = require('fs');
require('dotenv').config({ path: '../.env' })
const MongoClient = require("mongodb").MongoClient;



const url = `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@middlepizza.25kej0v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url);

const connection = new bigml.BigML(`${process.env.BIGML_USER_NAME}`,`${process.env.BIGML_API_KEY}`);


async function createPredictions(startDate,endDate,cb) {
  try {
	await client.connect();
    const database = client.db("Pizza");
    const orders = database.collection("Orders");

    const result = await orders.find({timestamp:{$gt:startDate,$lt:endDate}},{projection: {toppings:1} }).toArray();
	jsonResult = JSON.stringify(result,null,'\t');
	jsonObj = JSON.parse(jsonResult);
    //console.log(`${jsonResult}`);
	for (var key in jsonObj){
		var obj = jsonObj[key];
		var toppings = obj.toppings;
		for (var i=0;i<2;i++){
			obj[`topping-${i+1}`] = "";
		}
		for (var i=0;i<toppings.length;i++){
			obj[`topping-${i+1}`] = obj.toppings[i];
		}
		delete obj.toppings;
	}
	newJson = JSON.stringify(jsonObj,null,'\t');
	//console.log(newJson);
	fs.writeFileSync('orders.json',newJson);
  } finally {
    await client.close();
  }
  var results = [];
  var source = new bigml.Source(connection);
  source.create('./orders.json',function(error,sourceInfo){
	  if(!error && sourceInfo){
	  var dataset = new bigml.Dataset(connection);
	  dataset.create(sourceInfo,function(error,datasetInfo){
		  if (!error && datasetInfo){
			  var model = new bigml.Model(connection);
			  model.create(datasetInfo,function(error,modelInfo){
				  if (!error && modelInfo){
					var toppings = ['olive', 'mushrooms', 'corn', 'onion', 'tuna', 'jalapeno'];
					for (var i =0;i<toppings.length;i++){
						var prediction	= new bigml.Prediction(connection);
						prediction.create(modelInfo, {'topping-1': toppings[i] },function(error, pred) {
							var antecedent = pred.object.input_data['topping-1'];
							var consequent = pred.object.output;
							var count = pred.object.prediction_path.objective_summary.categories; 
							var consequentCount=0;
							var totalCount=0;
							for (topping in count){
								if (count[topping][0] != consequent){
									totalCount+=count[topping][1];
								}else{
									consequentCount+=count[topping][1];
									totalCount+=count[topping][1];
								}
							}
							var support = Math.round(consequentCount/totalCount*100000) / 100000;
							var confidence = pred.object.confidence;
							results.push({'Antecedent': antecedent,'Consequent':consequent,'Support':support,'Confidence':confidence});
							if (results.length >= toppings.length){ // last callback ended
								deleteSource(source,sourceInfo);
								cb(results);
							}
							});
					}
				  }
			  });
		  }
	  });
	  }
  });
}
/*
function sendResult(results){
	console.log(JSON.stringify(results, null,'\t'));
}
createPredictions(Date.parse('24 Feb 2023 00:00:00 GMT'),Date.parse('24 Feb 2023 23:59:59 GMT'),sendResult).catch(console.dir);
*/
async function deleteSource(source,sourceInfo){// cannot delete all from node...
	  source.delete(sourceInfo,true,function(error,result){
		  if(!error && result){
			  console.log(result);
		  }
	  });
  }

  module.exports = {
    createPredictions:createPredictions
}
