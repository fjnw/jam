const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const bodyParser = require("body-parser");
const routes = require('./routes/api/routes');

const PORT = process.env.PORT || 3001;

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// our server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);

// Serve up static assets
app.use(express.static(path.join(__dirname,"../build")));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname+'./index.html');
});

//Prod socket
require('./routes/sockets/product.js')(io);

// Routes
// =============================================================
app.use(routes);

server.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});