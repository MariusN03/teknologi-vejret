let client
let info
let id
let points = 50

function setup(){
    let params = getURLParams()
    id = params.id
    info = select('#info')
    info.html('Mit id er ' + id)
    client = mqtt.connect('wss://mqtt.nextservices.dk')
    client.on('connect', (response)=>{
        console.log(response);
        console.log('<b>Connected to nextblablabla.dk</b>')

        client.subscribe('programmering')

        client.on('message', (topic, message) => {
            info.html('<b>Modtog besked:</b> ' + message + ' <b>på emnet:</b> ' + topic)
        })
    })
}

function draw(){
}