import os
from uuid import uuid4
from confluent_kafka import Producer
from dotenv import load_dotenv

load_dotenv()
info = {
    'kafka_topic_name': str(os.getenv('KAFKA_TOPIC_NAME')),
    'conf':  {
        'bootstrap.servers':str(os.getenv('KAFKA_SERVER')) ,
        #'session.timeout.ms': 6000,
        #'default.topic.config': {'auto.offset.reset': 'smallest'},
        'security.protocol': 'SASL_SSL',
        'sasl.mechanisms': 'SCRAM-SHA-256',
        'sasl.username': str(os.getenv('KAFKA_USER_NAME')),
        'sasl.password': str(os.getenv('KAFKA_PASSWORD'))
    }
}

def delivery_report(errmsg, msg):
    """
    Reports the Failure or Success of a message delivery.
    Args:
        errmsg  (KafkaError): The Error that occurred while message producing.
        msg    (Actual message): The message that was produced.
    Note:
        In the delivery report callback the Message.key() and Message.value()
        will be the binary format as encoded by any configured Serializers and
        not the same object that was passed to produce().
        If you wish to pass the original object(s) for key and value to delivery
        report callback we recommend a bound callback or lambda where you pass
        the objects along.
    """   
    if errmsg is not None:
        print("Delivery failed for Message: {} : {}".format(msg.key(), errmsg))
        return
    print('Message: {} successfully produced to Topic: {} Partition: [{}] at offset {}'.format(
        msg.key(), msg.topic(), msg.partition(), msg.offset()))

def init_kafka():

    print("Starting Kafka Producer")   

            
    print("connecting to Kafka topic...")
    # producer1 = Producer(conf)
   

    producer = Producer(**info['conf'])
    
    # Trigger any available delivery report callbacks from previous produce() calls
    producer.poll(0)
    return producer

def produce(message, producer):
    if message == None:
        return
    try:
        print("message: ", str(message))
        # Asynchronously produce a message, the delivery report callback
        # will be triggered from poll() above, or flush() below, when the message has
        # been successfully delivered or failed permanently.
        producer.produce(topic=info['kafka_topic_name'], key=str(uuid4()), value=message.encode(), on_delivery=delivery_report)
        
        # Wait for any outstanding messages to be delivered and delivery report
        # callbacks to be triggered.
        producer.flush()
     
    except Exception as ex:
        print("Exception happened :",ex)
     
