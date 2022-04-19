var axios = require('axios');
var data = JSON.stringify({
  "query": "query Dataset {forecasts_hour(where: {PriceArea: {_eq: \"DK2\"}} order_by: {HourUTC: desc} limit: 6 offset: 0){HourUTC HourDK PriceArea ForecastType ForecastDayAhead ForecastIntraday Forecast5Hour Forecast1Hour ForecastCurrent TimestampUTC TimestampDK }}"
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
    console.log(response.data.data.forecasts_hour[0].ForecastType);
    //response.data.data.forecasts_hour.map(o => console.log(o))
})
.catch(function (error) {
  console.log(error);
});