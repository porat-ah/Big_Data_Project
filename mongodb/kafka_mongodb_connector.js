const Kafka = require("node-rdkafka");
require('dotenv').config({ path: './.env' })
const MongoClient = require("mongodb").MongoClient;


// Connection URL
const url = `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@middlepizza.25kej0v.mongodb.net/?retryWrites=true&w=majority`;


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

const client = new MongoClient(url);




consumer.on("error", function(err) {
  console.error(err);
});


consumer.on("ready", async function(arg) {
  console.log(`Consumer ${arg.name} ready mongoDB`);
  consumer.subscribe(topics);
  consumer.consume();
  try{
		await client.connect();
     }catch(err){
	 console.log(err);
	 }
});

consumer.on('data', async function(m) {
  m = JSON.parse(m.value.toString());
  if (m["message_type"] == "order") {
	  
	  try{
		const database = client.db("Pizza");
        const orders = database.collection("Orders");
		m["timestamp"] = Date.parse(m["time"])
		const result = await orders.insertOne(m);
	  }catch(err){
	  console.log(err);
	  }
  }
  
});

consumer.on("disconnected", async function(arg) {
  console.log(`Consumer ${arg.name} disconnected mongoDB`);
  try{
	  await client.close();
  }catch(err){
	console.log(err);
  }
  process.exit();
});

consumer.on('event.error', function(err) {
  console.error(err);
  process.exit(1);
});

consumer.on('event.log', function(log) {
  // console.log(log);
});


consumer.connect();



