const Kafka = require("node-rdkafka");
const redis = require('redis-promisify');
const schedule = require('node-schedule');
require('dotenv').config({ path: './.env' })
var utils = require('./utils');

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

const client = redis.createClient();

consumer.on("error", function(err) {
  console.error(err);
});


consumer.on("ready", function(arg) {
  console.log(`Consumer ${arg.name} ready redis`);
  consumer.subscribe(topics);
  consumer.consume();
});

consumer.on('data', function(m) {
  m = JSON.parse(m.value.toString());
  if (m["message_type"] == "branch status") {
      utils.branch_message(m, client);
  }
  else if (m["message_type"] == "branch created") {
	  utils.branch_setup(m, client);
  }
  else{
    utils.order_message(m, client);
  }
});

consumer.on("disconnected", function(arg) {
  console.log(`Consumer ${arg.name} disconnected redis`);
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


schedule.scheduleJob({hour: 0, minute: 0}, function(){
  utils.day_reset(client);
});

consumer.connect();

utils.setup(client);


