const Kafka = require("node-rdkafka");
require('dotenv').config({ path: '../.env' })
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
console.log(topic)
const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning"
});

const client = new MongoClient(url);

consumer.on("error", function(err) {
  console.error(err);
});


consumer.on("ready", function(arg) {
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics);
  consumer.consume();
});

consumer.on('data', async function(m) {
  m = JSON.parse(m.value.toString());
  console.log(m);
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('Orders');

  if (m["message_type"] == "order") {
  }
});

consumer.on("disconnected", function(arg) {
  console.log(`Consumer ${arg.name} disconnected`);
  process.exit();
});

consumer.on('event.error', function(err) {
  console.error(err);
  process.exit(1);
});

consumer.on('event.log', function(log) {
  // console.log(log);
});

client.on("error", error => {
  console.error("ERROR***",error);
});

console.log('connecting..');
consumer.connect();



