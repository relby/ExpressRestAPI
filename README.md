# Express REST API
The REST API on [Node.js](https://nodejs.org) implemented with [Express framework](http://expressjs.com) and [MongoDB](https://www.mongodb.com).
## Start
To start you need to download MongoDB [here](https://www.mongodb.com/try/download/community)
or download it as [docker](https://www.docker.com/) container like this
```console
$ docker run --name mongodb -p 27017:27017 -d mongo:latest
$ docker start mongodb
```
Then start the application
```console
$ npm install .
$ npm run start
```
