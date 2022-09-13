const express = require('express');
var cors = require("cors");
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');

const app = express();
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
})

const httpServer = app.listen(process.env.PORT || 8000);

const peerServer = ExpressPeerServer(httpServer, {
    debug: true,
});

app.use("/peerjs", peerServer);

peerServer.on('connection',(client)=>{console.log(`Peer Connected`, client.id)})
peerServer.on('disconnect',()=>{console.log(`Peer DisConnected`)})

const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});
io.on("connection", (socket) => {
    console.log(`New Client connected ${socket.id}`);
    socket.on('new-connection',(peerId)=>{
        console.log('New connection request');
        socket.broadcast.emit('user-add',peerId);
    })
});


