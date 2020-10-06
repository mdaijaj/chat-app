const express = require('express')
const app = express()

const http = require('http').createServer(app)
app.use(express.static(__dirname + '/public'))



// use of Socket tools
const io = require('socket.io')(http)

//endpoint
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const users={};

//connect to new user and other users
var i=0
io.on('connection', (socket) => {
    console.log("connected.." ) 
    socket.on("new_user_jointed", (name)=>{
        console.log("new user;-", name)
        var aa=users[socket.id]=name;
        console.log("aa:-", aa)
        socket.broadcast.emit('user_jointed', name)
        var sum=i+1
    })
    
    
    //message sent 
    socket.on('message', (name) => {
        console.log("api is working here.....")
        console.log("new user", name)
        users[socket.id]=name
        socket.broadcast.emit('message', name)
    })

    //disconnect to users
    socket.on('disconnect', (message, name) => {
        console.log("users detail:-",users[socket.id])
        // console.log("new_mesasge:-",  message)
        socket.broadcast.emit('left', users[socket.id]=name);
        delete users[socket.id]
    })
})

//server connected
const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})