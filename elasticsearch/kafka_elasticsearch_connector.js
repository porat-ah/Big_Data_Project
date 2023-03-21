const Kafka = require("node-rdkafka");
require('dotenv').config({ path: './.env' })
const { Client } = require('@elastic/elasticsearch');


// Connection URL
const url = `http://localhost:9200`;


const kafkaConf = {
  "group.id": `${process.env.KAFKA_USER_NAME}-consumer`,
  "metadata.broker.list": [`${process.env.KAFKA_SERVER_1}`,`${process.env.KAFKA_SERVER_2}`,`${process.env.KAFKA_SERVER_3}`],
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-512",
  "sasl.username": `${process.env.KAFKA_USER_NAME}`, 
  "sasl.password": `${process.env.KAFKA_PASSWORD}`,
  "debug": "generic,broker,security"
};


const topic = `${process.env.KAFKA_TOPIC_NAME}`;  

const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning"
});

const client = new Client({ node: url });



consumer.on("error", function(err) {
  console.error(err);
});


consumer.on("ready", async function(arg) {
  console.log(`Consumer ${arg.name} ready ES`);
  consumer.subscribe(topics);
  consumer.consume();
});

consumer.on('data', async function(m) {
  m = JSON.parse(m.value.toString());
  if (m["message_type"] == "order") {
	  
	  try{
		await setIndex(m);
	  }catch(error){
		console.log(error);  
	  }
	  
  }
});

consumer.on("disconnected", async function(arg) {
  console.log(`Consumer ${arg.name} disconnected ES`);
  process.exit();
});

consumer.on('event.error', function(err) {
  console.error(err);
  process.exit(1);
});

consumer.on('event.log', function(log) {
  // console.log(log);
});


async function setIndex(m){
	var ind = indexName(m['branch_name']);
	var fullDate = new Date(m["time"]);
	m['date'] = fullDate.getDate()+'-'+(fullDate.getMonth()+1)+'-'+fullDate.getFullYear();
	m['timestamp'] = Date.parse(m["time"]);
	m['order_duration'] = 'pending';
	var numId = m['id'];
	delete m.branch_name;
	const exists = await client.exists({
    index: ind,id: numId
	});
	if (exists){
		const result = await client.search({index:ind,query:{match:{id:numId}}});
		var start = (result.hits.hits)[0]._source.timestamp;
		var duration = (m['timestamp'] - start)/60000;
		var durationTime = Math.round(duration) + " minutes";
		await client.update({index:ind,id:numId,
		doc:{
			'order_duration': durationTime,'order_status':m['order_status']}});
	} else{				
		await client.index({
			index: ind,
			id: numId,
			document: m
		});
	}
}
function indexName(ind){
	var newInd = ind.toLowerCase();
	return newInd.replace(/[\s_,-\/\\\*\?"<>\|]/g,"");
}


async function deleteAll(ind){
	await client.indices.delete({
    index: ind
}, function(err, res) {

    if (err) {
        console.error(err.message);
    } else {
        console.log('Indexes have been deleted!');
    }
});
	console.log('deleted indices...');
}

consumer.connect();
//deleteAll('*');


