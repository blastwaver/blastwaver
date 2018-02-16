const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const chat = require('./server/routes/chatApi');
const socketIO = require('socket.io');

// API file for interacting with MongoDB
const user = require('./server/routes/userApi');
const friends =require('./server/routes/friendsApi');
const upload = require('./server/routes/uploadApi');
const messages = require('./server/routes/messagesApi');
//allow cross origin
app.use(cors());

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/images',express.static(path.join(__dirname,'/images')))

/* API location */
//MONGO API
app.use('/api/users', user);
app.use('/api/upload', upload);
app.use('/api/friends', friends);
app.use('/api/messages', messages);
//REDIS API
app.use('/api/chat', chat);


// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});


/* SOCKET.IO */

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




/* Set Port */
const port = process.env.PORT || '3000';
app.set('port', port);

server.listen(port, () => console.log(`Running on localhost:${port}`));



