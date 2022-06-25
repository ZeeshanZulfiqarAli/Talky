const express = require('express');
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require('path');

const app = express();
// const httpServer = require('http').Server(app);

const httpServer = createServer(app);

console.log('======', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'production') {
  // Have Node serve the files for our built React app
  app.use(express.static(path.resolve(__dirname, '../client/build')));
}

const io = new Server(httpServer, {
  cors: {
    // origin: 'http://localhost:3000'
    origin: '*'
  }
});

let connections = {};
let users = {};
// let candidates = {};

io.on("connection", (socket) => {
  // ...
  connections[socket.id] = {};
  socket.on("ice candidates", (newIceCandidates) => {
    if (!connections[socket.id].iceCandidates) {
      connections[socket.id].iceCandidates = {};
    }
    connections[socket.id].iceCandidates = newIceCandidates;
  })

  socket.on("name", (name) => {
    if (users[name]) {
      // emit error
      socket.emit('username exists');
    } else {
      users[name] = socket.id;
      connections[socket.id].name = name;
      socket.emit('username assigned');
    }
  });

  socket.on("request answer", (targetName) => {
    if (!users[targetName] && connections[socket.id].name && connections[socket.id].iceCandidates) {
      // emit error
      socket.emit('error');
    } else {
      socket.to(users[targetName]).emit('request answer', connections[socket.id].name, connections[socket.id].iceCandidates);
    }
  });

  socket.on("propagate answer", (targetName, answer) => {
    if (!users[targetName] && connections[socket.id].name) {
      // emit error
      socket.emit('error');
    } else {
      socket.to(users[targetName]).emit('answer', connections[socket.id].name, answer);
    }
  });

  socket.on("disconnect", () => {
    if (connections[socket.id].name && users[connections[socket.id].name]) {
      // emit error
      delete users[connections[socket.id].name];
    }
    delete connections[socket.id];
  });
});

// app.get('/api/customers', cors(), (req, res) => {
//   const customers = [
//     {id: 1, firstName: 'John', lastName: 'Doe'},
//     {id: 2, firstName: 'Brad', lastName: 'Traversy'},
//     {id: 3, firstName: 'Mary', lastName: 'Swanson'},
//   ];

//   res.json(customers);
// });

const port = process.env.PORT || 5000;
const server_host = process.env.YOUR_HOST || '0.0.0.0';

httpServer.listen(port, server_host, () => `Server running on port ${port}`);