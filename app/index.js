let client
let info

function setup(){
    info = select('#info')
    client = mqtt.connect('wss://mqtt.nextservices.dk')
    client.on('connect', (response)=>{
        console.log(response);
        info.html('<b>Connected to nextblablabla.dk</b>')

        client.subscribe('programmering')

        client.on('message', (topic, message) => {
            info.html('<b>Modtog besked:</b> ' + message + ' <b>på emnet:</b> ' + topic)
        })
    })
}

function draw(){
}