This folder contains a nodejs connector that consumes data from [cloudkarafka](https://www.cloudkarafka.com/) to a local docker container redis server

# node
install the packages:
```
npm i node-rdkafka redis node-schedule dotenv
```
# redis

create a docker redis image:
```
docker pull redis
```

run the container:
```
docker run -d -p 6379:6379 --name redis redis
```
you can view the process using:
```
docker ps
```
you can view the logs:
```
docker logs redis
```
to interact with redis:
```
docker exec -it redis sh

redis-cli
```

[redis commands](https://redis.io/commands/)


