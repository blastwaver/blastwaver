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
    res.sendFile(path.join(__dirname,'dist/index.html'));
});

const server = http.createServer(app);

const io =  socketIO(server);

io.on('connection', (socket) => {
    
    socket.on('room.join', (room) => {
        // console.log(socket.rooms);
        //to leave any rooms which the socket(client) was belonged. if key is (socket).id no need to worry. 
        // console.log(socket.id)
        // console.log(socket.rooms)
        Object.keys(socket.rooms).filter((r) => r != socket.id)
            .forEach((r) => socket.leave(r));
        
        //used settimeout for async purpose
        setTimeout(() => {
            socket.join(room);
            // socket.emit('chat', 'Joind' + room);
        }, 0);  
    });

    //for chat
    socket.on('chat', (data) => {
        if(data.room){
            io.sockets.in(data.room).emit('chat', data);
        }  
    });
    
    //for typing
    socket.on('typing', (data) => {
        if(data.room) {
            io.sockets.in(data.room).emit('typing', data);
        }
    })

    //for message
    socket.on('message', (data) => {
        if(data.to){
            //when user close browser without logout it hadle on server side.
            if(data.type == 'DISCONNECT_NOTICE'){
                 data.to.forEach((destination) =>{
                    let newData = {from:data.from, to: destination, message: data.message, type: data.type}; 
                    io.sockets.in(destination).emit('message', newData); 
                });
            } else {
                io.sockets.in(data.to).emit('message', data);
            }
            
        }  
    });
});

server.listen(port, () =>{
    console.log(`server running on port ${port}`);
})
