const socket = io.connect('http://localhost:8000');
const peer = new Peer(undefined, {
    host: "localhost",
    port: 8000,
    path: "/peerjs",
});

// HTML elements
const videoEl = document.querySelector('.stream');

navigator.mediaDevices.getUserMedia({
    video: true,
    // audio: true,
}).then(stream => {
    videoEl.srcObject = stream;
    videoEl.addEventListener('loadedmetadata', () => {
        videoEl.play();
    });
    peer.on("call", (call) => {
        call.answer(stream);
    });
    socket.on("user-add", (newPeerID) => {
        // let connection = peer.connect(newPeerID);
        let call = peer.call(newPeerID, stream);
        call.on("stream", (remoteStream) => {
            console.log('stream received');
            let newvideo = document.createElement('video');
            newvideo.srcObject = remoteStream;
            newvideo.addEventListener("loadedmetadata", () => {
                newvideo.play();
            });
            document.body.appendChild(newvideo);
        })
    })

}).catch(err => console.log('Error retrieving webcam', err));

socket.on("connection", () => console.log('Connected to server'));

peer.on('open', (id) => {
    setTimeout(() => {
        socket.emit("new-connection", peer.id);
    }, 2000);

    console.log('Peer ID', id);
})

peer.on("connection", function (conn) {
    conn.on("data", function (data) {
        console.log(data);
    })
})