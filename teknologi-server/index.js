var axios = require('axios');
const mqtt = require('mqtt');

const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)

app.use(express.static('public'))

server.listen(4000, () => {
  console.log('client available on on *:4000');
  const client = mqtt.connect('wss://mqtt.nextservices.dk')

  client.on('connect', function () {
    console.log('connected')  
    client.publish('anbefaling', '25')    
  })
})
