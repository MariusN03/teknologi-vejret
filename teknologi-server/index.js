var axios = require('axios');
const mqtt = require('mqtt');
var dayAgo = 0
const day =  new Date()
let hourd = day.getHours()
let hour = 24 - hourd
let anbefaling
console.log(hour)

let clients = [];

var data = JSON.stringify({
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


const client = mqtt.connect('wss://mqtt.nextservices.dk')


  
  


client.on('connect', function () {
    console.log('connected')
    
    setTimeout(() => {
      let besked = Math.round(anbefaling)
      
      console.log("besked: " + besked)
    client.publish('anbefaling',String(besked))
    }, 500);
})



client.subscribe('vejret-new')

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
    
  }
})


