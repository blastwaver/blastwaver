const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

// API file for interacting with MongoDB
const user = require('./server/routes/userApi');
const friends =require('./server/routes/friendsApi');
const upload = require('./server/routes/uploadApi');
//allow cross origin
app.use(cors());


// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/images',express.static(path.join(__dirname,'/images')))

// API location
app.use('/api/users', user);
app.use('/api/upload', upload);
app.use('/api/friends', friends);


// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));

