# node
install the packages:
```
npm i node-rdkafka @elastic/elasticsearch dotenv
```
# elasticsearch

create a docker elasticsearch image:
```
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.6.2
```

run the container:
```
docker run --name es01 -p 9200:9200 -e discovery.type=single-node -e xpack.security.enabled=false -e action.destructive_requires_name=false -it docker.elastic.co/elasticsearch/elasticsearch:8.6.2
```
you can view the process using:
```
docker ps
```
