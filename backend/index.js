let { WebSocketServer } = require('ws');
const handleMessage = require('./handleMessage');
const { Level } = require('level')
const userAccounts = new Level('userAccounts', { valueEncoding: 'json' })
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(socket) {
    let session = {
        socket,
        login: null,
        items: new Array(20).fill(null),
        equipment: [],
        send: (payload) => {
            if (socket.readyState == 1) { //opened
                socket.send(JSON.stringify(payload))
            }
        }
    }
    socket.on('message', function message(data) {

        let msg;
        try {
            msg = JSON.parse(data ? data.toString() : "")
        } catch (e) {
            msg = {}
        }
        handleMessage(msg, session)
    });


});