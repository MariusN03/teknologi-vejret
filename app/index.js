let client
let info
let id
let amount

function setup(){
    noCanvas()
    amount = select('#points')
    let params = getURLParams()
    id = params.id
    client = mqtt.connect('wss://mqtt.nextservices.dk')
    client.on('connect', (response)=>{
        console.log(response);
        console.log('<b>Connected to nextblablabla.dk</b>')
        client.publish("vejret-new", id)

        client.subscribe('point-app')

        client.on('message', (topic, message) => {
            if (topic == "point-app"){

                if(message > 50){
                    message = 50
                }
                
                if(message < 0){
                    message = 0
                }
                
                points = parseInt(message)
                amount.html('Du har ' + message + ' point')
            }
        })
    })
}

function draw(){
    if (points <= 5){
        document.getElementById('img-container').style.backgroundImage = "url('./assets/1.png')"
    }
    else if(points > 5 && points <= 20){
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

    
}