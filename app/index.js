let client
let info
let id
let amount
let points = 25



function setup(){
    noCanvas()
    amount = select('#points')
    let params = getURLParams()
    id = params.id
    client = mqtt.connect('wss://mqtt.nextservices.dk')
    client.on('connect', (response)=>{
        console.log(response);
        console.log('<b>Connected to nextblablabla.dk</b>')

        client.subscribe('point')

        client.on('message', (topic, message) => {
            if (topic == "point"){
                tal = parseInt(message)
                points = points + tal
                console.log(tal);
            }
        })
    })
    
    minus = () => {
        points = points - 10
    }

    plus = () => {
        points = points + 10
    }
}

function draw(){
    if (points <= 10){
        document.getElementById('img-container').style.backgroundImage = "url('./assets/1.png')"
    }
    else if(points > 10 && points <= 20){
        document.getElementById('img-container').style.backgroundImage = "url('./assets/2.png')"
    }
    else if(points > 20 && points <= 30){
        document.getElementById('img-container').style.backgroundImage = "url('./assets/3.png')"
    }
    else if(points > 30 && points <= 40){
        document.getElementById('img-container').style.backgroundImage = "url('./assets/4.png')"
    }
    else if(points > 40 && points <= 50){
        document.getElementById('img-container').style.backgroundImage = "url('./assets/5.png')"
    }

    else if (points > 50) {
        points = 50
    }
    
    if (points < 0){
        points = 0
    }

    amount.html('Du har ' + points + ' points')
}