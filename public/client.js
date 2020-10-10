const socket = io()
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
var audio=new Audio('message.mp3');
var join_user=new Audio('whatsapp.mp3')

// message area append message func
const append =(message, postion)=>{
    const message_element= document.createElement("div");
    message_element.innerText= message
    message_element.classList.add('message')
    message_element.classList.add(postion)
    messageArea.append(message_element)
}

//valid input
do {
    name = prompt('Please enter your name: ')
} while(!name)

//connect to new users
socket.emit('new_user_jointed', name)

//user jonted
socket.on('user_jointed', (name)=>{
    append(`${name} jointed group`, 'incoming')
    join_user.play();
})

// message sent process when click enter
textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        console.log("element", e)
        sendMessage(e.target.value)
    }
})

//sent message after click
function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()
    // audio.play();

    // Send to server 
    socket.emit('message', msg)
}

//message are append message
function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)

}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    audio.play();
    scrollToBottom()
})



// //user jonted
// socket.on('user_jointed', (name)=>{
//     append(`${name} jointed group`, 'incoming')
//     join_user.play();
// })


// left chat
socket.on('left',(message)=>{
    append(`${message} left the chat`, 'incoming')
})

//for scroll bar extend mesage
function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}



