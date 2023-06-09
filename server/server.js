const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const http = require('http');

const { Server } = require('socket.io');
const server = http.createServer(app);

const personController = require('./controller/peopleController');
const categoryController = require('./controller/categoryController');

const mongoURI = process.env.NODE_ENV === 'test' ? 'mongodb://localhost/Rank-dtest' : 'mongodb://localhost/Rank-ddev';
mongoose.connect(mongoURI);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log('connected!')
    socket.on('update', () => {
        console.log('updated!')
    })
})

// app.get('/getAllPeople', personController.getAllPeople, (req,res) => {
//     res.status(200)
// })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, '../dist')))


app.get('/people/getAllPeople', personController.getAllPeople, categoryController.getRandomCategory, (req, res) => {
    res.status(200).json({people: res.locals.people, category: res.locals.category})
})

app.post('/people/addAllPeople', personController.addPeople, (req, res) => {
    res.sendStatus(200)
})

app.post('/people/addAllCategories', categoryController.addCategory, (req, res) => {
    res.sendStatus(200)
})

server.listen(PORT, () => {
    console.log('Server running on PORT:3000')
})








//{
// const wss = new WebSocketServer({ server: server });

// app.use(express.json())

// wss.on('connection', () => {
//     console.log('connected')
// })

// wss.onopen = () => {
//     console.log('Opened!')
// }

// wss.onclose = (evt) => {
//     console.log('Opened!')
//     wss.send('Websocket says Hello!')
// }

// // console.log(wss)

// wss.onerror = (error) => {
//     console.log(`WebSocket Error: ${error.message}`)
// }

// console.log(wss)


//}