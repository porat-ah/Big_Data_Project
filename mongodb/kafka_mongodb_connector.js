const Kafka = require("node-rdkafka");
require('dotenv').config({ path: '../.env' })
const MongoClient = require("mongodb").MongoClient;


// Connection URL
const url = `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@middlepizza.25kej0v.mongodb.net/?retryWrites=true&w=majority`;

console.log(url)
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
console.log(topic)
const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning"
});

const client = new MongoClient(url);




consumer.on("error", function(err) {
  console.error(err);
});


consumer.on("ready", async function(arg) {
  console.log(`Consumer ${arg.name} ready`);
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
  //console.log(m);
  if (m["message_type"] == "order") {
	  console.log("order");
	  try{
		const database = client.db("Pizza");
        const orders = database.collection("Orders");
		m["timestamp"] = Date.parse(m["time"])
		const result = await orders.insertOne(m);
		console.log(`collected order. id branch ${m["id"]}, id order ${m["branch_id"]}`);
	  }catch(err){
	  console.log(err);
	  }
  }
  
});

consumer.on("disconnected", async function(arg) {
  console.log(`Consumer ${arg.name} disconnected`);
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

/*const u = `mongodb+srv://pi:pi@middlepizza.25kej0v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(u);

async function run() {
  try {
	await client.connect();
	console.log('server');
    const database = client.db("Pizza");
    const haiku = database.collection("Orders");
    // create a document to insert
    const doc = {
      title: "Record of a Shriveled Datum",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    }
    const result = await haiku.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
*/
console.log('connecting..');
consumer.connect();



