const express = require('express');
const cors = require('cors')
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 8888;

app.use(express.static(path.join(__dirname, 'dist')));

//allow cross origin
app.use(cors());

app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname,'dist/index.html'));
});

const server = http.createServer(app);

const io =  socketIO(server);

io.on('connection', (socket) => {
    
    socket.on('room.join', (room) => {
        // console.log(socket.rooms);
        //to leave any rooms which the socket(client) was belonged. if key is (socket).id no nedd to worry. 
        Object.keys(socket.rooms).filter((r) => r != socket.id)
            .forEach((r) => socket.leave(r));
        
        //used settimeout for async purpose
        setTimeout(() => {
            socket.join(room);
            // socket.emit('chat', 'Joind' + room);
        }, 0);  
    });

    socket.on('chat', (data) => {
        if(data.room){
            io.sockets.in(data.room).emit('chat', data);
        }  
    });
});

server.listen(port, () =>{
    console.log(`server running on port ${port}`);
})
