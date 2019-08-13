var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var p5SocketId = '';
var clientColorArray = {};
var clientLastMousePosition = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
    console.log('a User is connected with id : ' + socket.id);
    clientColorArray[socket.id] = getPaletteColor();
    
    socket.on('p5socket', (data) => {
        p5SocketId = data.idp5
        console.log('Received p5 id : ' + data.idp5);
    });
    
    socket.on('background', function (data) {
        console.log('received socket color ' + getRandomColor());
        io.to(p5SocketId).emit('click2', {'color' : getRandomColor()});
    });

    socket.on('mouse', function (data) {
        let clientId = data.clientId;
        console.log('mouse : ' + data.x + ' ' + data.y + 'for user : ' + clientId);
        if (clientLastMousePosition[clientId] != {} && clientLastMousePosition[clientId] != undefined){
            io.to(p5SocketId).emit('mouse2', {
                'x' : data.x, 
                'y': data.y, 
                'lastX' : clientLastMousePosition[clientId].x,
                'lastY' : clientLastMousePosition[clientId].y,
                'color' : clientColorArray[data.clientId],
                'clientId' : clientId
                 });
        }
        clientLastMousePosition[clientId] = {'x' : data.x, 'y': data.y, 'color' : clientColorArray[data.clientId]};
        
    });

    socket.on('scroll', function (data) {
        io.to(p5SocketId).emit('scroll', {
            'position' : data.position,
            'speed': data.speed,
            'color' : clientColorArray[data.clientId],
            'clientId' : data.clientId,
            'lastX' : (clientLastMousePosition[data.clientId] != undefined)? clientLastMousePosition[data.clientId].x : 0,
            'lastY' : (clientLastMousePosition[data.clientId] != undefined)? clientLastMousePosition[data.clientId].y : 0,
         });
        //console.log('scroll : ' + data.position + ' ' + data.speed);
    });

    socket.on('click', function (data) {
        console.log('Received click message');
        io.to(p5SocketId).emit('clickEvent', {'x' : data.x, 'y': data.y,'color' : getRandomColor()});
    });

    
});


// UTILS
function getRandomColor (){
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function getPaletteColor(){
    let palet =['#00429d', '#56408c', '#793e7b', '#943b6b', '#ac385a', '#c23249', '#d72a37', '#eb1e22', '#ff0000'];
    return palet[Math.floor(Math.random() * palet.length)]; 
}


