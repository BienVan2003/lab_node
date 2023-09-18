require('dotenv').config()
const express = require('express')
const socketio = require('socket.io')

const app = express()
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/chat', (req, res) => {
    res.render('chat')
})

const port = process.env.PORT || 8080
const httpServer = app.listen(port, () => console.log('http://localhost:' + port))
const io = socketio(httpServer)

io.on('connection', client => {
    console.log(`Client ${client.id} connected`)

    let users = Array.from(io.sockets.sockets.values())
                .map(socket => ({id: socket.id, name: socket.name}))
    console.log(users)

    client.on('disconnect', () => {

        console.log(`\t\t${client.id} has left`)

        // thông báo cho all user còn lại trước khi mình thoảt
        client.broadcast.emit('user-leave', client.id)

    })

    client.on('register-name', username => {
        client.username = username

        // gửi thông tin reg cho all user còn lại
        client.broadcast.emit('register-name', {id: client.id, username: username})
    })
    
    // gửi danh sách user đang online cho người mới
    client.emit('list-users', users)

    // gửi thông tin người mới cho tất cả những người trước đó
    client.broadcast.emit('new-user', {id: client.id, name: client.name})

})