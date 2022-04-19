let client
let info
let el = document.querySelector('#container')
let x = document.querySelector('#container').style.width
box1 = document.querySelector('#box1')
box2 = document.querySelector('#box2')
box3 = document.querySelector('#box3')
box4 = document.querySelector('#box4')

colorChange = () => {
    if(box1.style.backgroundColor == 'red'){
        box1.style.backgroundColor = 'green'
        box2.style.backgroundColor = 'blue'
        box3.style.backgroundColor = 'red'
        box4.style.backgroundColor = 'yellow'
    }
    else if(box1.style.backgroundColor == 'green'){
        box1.style.backgroundColor = 'blue'
        box2.style.backgroundColor = 'yellow'
        box3.style.backgroundColor = 'green'
        box4.style.backgroundColor = 'red'
    }
    else if(box1.style.backgroundColor == 'blue'){
        box1.style.backgroundColor = 'yellow'
        box2.style.backgroundColor = 'red'
        box3.style.backgroundColor = 'blue'
        box4.style.backgroundColor = 'green'
    }
    else{
        box1.style.backgroundColor = 'red'
        box2.style.backgroundColor = 'green'
        box3.style.backgroundColor = 'yellow'
        box4.style.backgroundColor = 'blue'
    }
}

colorChangePlain = () => {
    box1.style.backgroundColor = 'pink'
    if(box1.style.backgroundColor == 'pink'){
        box1.style.backgroundColor = 'orange'
        box2.style.backgroundColor = 'orange'
        box3.style.backgroundColor = 'orange'
        box4.style.backgroundColor = 'orange'
    }
    else if(box1.style.backgroundColor == 'orange'){
        box1.style.backgroundColor = 'chartreuse'
        box2.style.backgroundColor = 'chartreuse'
        box3.style.backgroundColor = 'chartreuse'
        box4.style.backgroundColor = 'chartreuse'
    }
    else{
        box1.style.backgroundColor = 'pink'
    }
}

sizeChangeUp = () => {
    let height = el.offsetHeight
    let width = el.offsetWidth
    let newHeight = height + 100
    let newWidth = width + 100
    el.style.height = newHeight + 'px'
    el.style.width = newWidth + 'px'
}

sizeChangeDown = () => {
    let height = el.offsetHeight
    let width = el.offsetWidth
    let newHeight = height - 100
    let newWidth = width - 100
    el.style.height = newHeight + 'px'
    el.style.width = newWidth + 'px'
}

function setup(){
    info = select('#info')
    client = mqtt.connect('wss://mqtt.nextservices.dk')
    client.on('connect', (response)=>{
        console.log(response);
        info.html('<b>Connected to nextblablabla.dk</b>')

        client.subscribe('programmering')

        client.on('message', (topic, message) => {
            info.html('<b>Modtog besked:</b> ' + message + ' <b>på emnet:</b> ' + topic)
            if(message == 'colorChange'){
                colorChange()
                console.log('It changes color!');
            }
            else if(message == 'colorChangePlain'){
                colorChangePlain()
                console.log('It changes plain color!');
            }
            else if(message == 'sizeChangeUp'){
                sizeChangeUp()
                console.log('It scales up!');
            }
            else if(message == 'sizeChangeDown'){
                sizeChangeDown()
                console.log('It scales down!');
            }
            else{false}
        })
    })
}

function draw(){
}