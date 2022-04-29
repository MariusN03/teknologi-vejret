var axios = require('axios');
const mqtt = require('mqtt');

const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)

app.use(express.static('public'))

server.listen(4000, () => {
  console.log('client available on on *:4000');
  
})

var dayAgo = 0
let hur
let status = 0
let day =  new Date()
let today = day.getDate() + 1
let month = day.getMonth() + 1
let year = day.getFullYear()
if(today < 10){
  today = "0"+today
}
if(month < 10){
  month = "0"+month
}


let hourd = day.getHours()
let oldHour = hourd
if(day.getHours() < 10){
  hur = "0" + day.getHours()
}
let hour = 24 - day.getHours()
// let hour = 6
let anbefaling
console.log(hour)

let clients = [{
  "id": "42069",
  "points": 20
},];
var data
const dataFetch = () => {
data = JSON.stringify({
  "query": "query Dataset {forecasts_hour(where: {PriceArea: {_eq: \"DK2\"}} order_by: {HourUTC: desc} limit: 72 offset: " + dayAgo * 72 + "){HourUTC HourDK PriceArea ForecastType ForecastDayAhead ForecastIntraday Forecast5Hour Forecast1Hour ForecastCurrent TimestampUTC TimestampDK }}"
});



var config = {
  method: 'post',
  url: 'https://data-api.energidataservice.dk/v1/graphql',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};



axios(config)
.then(function (response) {
    //response.data.data.forecasts_hour.map(o => console.log(o))
    console.log(response.data.data.forecasts_hour[0])
    if("'" + year + "-" + month + "-" + today + "T" + hur + ":00:00'" == response.data.data.forecasts_hour[(hour*3)-1].HourDK){
      dayAgo = 1
      status = 0
      console.log("resetting")
    }else{
      dayAgo = 0
      status = 1
    }
    console.log(response.data.data.forecasts_hour[(hour*3)-1].HourDK)
    let sumval = 0
    for (var i = 0; i<71; i++){
      
      sumval = sumval + response.data.data.forecasts_hour[i].ForecastCurrent
    }
    console.log("samlet produktion af energi inden for døgn: "+sumval)
    let snit = sumval / 24
    console.log("snit: " + snit)
    let sumhour = 0
    console.log("hour: "+hour)
    for (let i = (hour*3-3); i < ((hour*3)); i++){
      
      sumhour = sumhour + response.data.data.forecasts_hour[i].ForecastCurrent
      console.log(i + ": " + response.data.data.forecasts_hour[i].ForecastCurrent)
    }
    console.log("klokken "+ (24 - hour) + ": " + sumhour)
    let afvig = (sumhour-snit)/snit*100
    
    
    if(17 <= (24-hour) && (24-hour) <= 20){
      afvig = afvig - 100
    }
    if(0 <= (24-hour) && (24-hour) <= 6){
      afvig = afvig + 230
    }

    console.log("afvigelse: " +afvig)
    
    if(afvig > -70&& afvig < 155){
    anbefaling = (50/255)*(afvig+70)
  }else if(afvig < -70){
    anbefaling = 0
  }else if(afvig > 150){
    anbefaling = 50
  }
    console.log("anbefaling: "+anbefaling)
  
})
.catch(function (error) {
  console.log(error);
});

}
dataFetch()


const client = mqtt.connect('wss://mqtt.nextservices.dk')

client.on('connect', function () {
    console.log('connected')
    
    setTimeout(() => {
      let besked = Math.round(anbefaling)
      
      console.log("besked: " + besked)
      client.publish('anbefaling',String(besked))
    }, 1500);
    
    client.publish('point-app',String(clients[0].points))

})



client.subscribe('vejret-new')
client.subscribe('point-server')
client.subscribe('online')

client.on('message', function (topic, message) {
  // message is Buffer
  
  if(topic=='vejret-new'){
    console.log('new client: ' + message.toString())
    //tjek om klienten findes i forvejen
    let exist = clients.find(o => o.id == message.toString())
    if(exist){
      console.log("client: " + message.toString() + " already exists")
    }else{
      //ellers læg den i arrayet med klienter
      clients.push({
        "id": message.toString(),
        "points": 10
      })
      console.log(clients)
    }
    client.publish('point-app', String(clients[0].points))
  }if(topic=='point-server'){
    clients[0].points = clients[0].points + parseInt(message)
    
    if(clients[0].points > 50){
      clients[0].points = 50
    }
    if(clients[0].points < 0){
      clients[0].points = 0
    }

    console.log(clients)
    client.publish('point-app',String(clients[0].points))
    console.log('published: ' + clients[0].points)
  }else if(topic=='online'){
    let besked = Math.round(anbefaling)

    console.log('testbesked: '+besked)
    client.publish('anbefaling', String(besked))
    
  }
})



setTimeout(() => {
  setInterval(() => {
    if(status==0){
      dataFetch()
      console.log('reset')
    }else if(status==1){
      // console.log('finished')
    }
    status=1

    // hourd = day.getMinutes()
  }, 1000);
}, 1500);

setInterval(() => {
  if(oldHour != hourd){
    day = new Date()
    hourd = day.getHours()
    hour = 24 - day.getHours()
    dataFetch()
  
    setTimeout(() => {
      let besked = Math.round(anbefaling)
      
      console.log("besked: " + besked)
      client.publish('anbefaling',String(besked))
    }, 1500);
    day = new Date()
    hourd = day.getHours()
    oldHour = hourd

  }
  day = new Date()
  hourd = day.getHours()
  // console.log("old: " + oldHour + " hournow: " + hourd)

}, 500);
