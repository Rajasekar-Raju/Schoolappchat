const express = require('express');
const http = require('http');
const path = require('path');
const io = require("socket.io");
// const {Pool} = require('pg');
const bodyParser = require("body-parser");
const app = express();
const server = http.createServer(app);
const socket = io(server);

// const DB_USER = '';
// const DB_PASSWORD = '';
// const DB_HOST = '';
// const DB_PORT = '';
// const DB_DATABASE = '';
// const CONNECTION_STRING = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// const pool = new Pool({
//   connectionString: CONNECTION_STRING,
//   ssl: true,
// });

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
var users = [];

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/', (req, res) => res.sendFile(INDEX, { root: __dirname }));
// app.post('/getmessages', (req, res) => {
//   const {sender, receiver} = req.body;
//   pool.query(`SELECT * FROM messages WHERE (sender = "${sender}" AND receiver = "${receiver}") OR (sender = "${receiver}" AND receiver ="${sender}")`, (error, results) => {
//     if (error) {
//       throw error
//     }
//     res.status(200).json(results.rows);
//   });
// });

server.listen(PORT, () => console.log(`Connected in ${PORT}`));

socket.on('connection', (data) => {
  console.log("Client connected", data.id);
  data.on('user_connected', (username) => {
    users[username] = data.id;
    socket.emit("user_connected", username);
  });

  data.on("send_message", function (res) {
    const {sender, receiver, message} = res;
    var socketId = users[receiver];
    socket.to(socketId).emit("new_message", res);
    // pool.query(`INSERT INTO messages (sender, receiver, message) VALUES ("${sender}", "${receiver}", "${message}")`, (error, results) => {
    //   if (error) {
    //     throw error
    //   }
    // });
  });
});

// broadcast settings
// setInterval(() => {
//   wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
//   });
// }, 1000);