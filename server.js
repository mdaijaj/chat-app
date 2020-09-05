const express = require('express')

const app = express()

const http = require('http').createServer(app)

app.use(express.static(__dirname + '/public'))

//endpoint
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


// use of Socket 
const io = require('socket.io')(http)

//connect to new users
var i=0
io.on('connection', (socket) => {
    console.log("connected..")
    var sum=i+1
    socket.on('message', (name) => {
        console.log("new user", name)
        socket.broadcast.emit('message', name)
    })

})

//server connected
const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})