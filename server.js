var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//var io = require('socket.io');

var PORTCONFIG = 4000;

var p5SocketId = '';
var clientColorArray = {};
var clientLastMousePosition = {};
var users= {};

// Routes configs
app.get('/', function(req, res){
    res.sendFile(__dirname + '/front/home.html');
});


app.get('/1', function(req, res){
    res.sendFile(__dirname + '/front/sketch2.html');
});

app.get('/2', function(req, res){
    res.sendFile(__dirname + '/front/sketch2.html');
});

// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, '/public')));

http.listen(PORTCONFIG, function(){
  console.log('listening on *:' + PORTCONFIG);
});


// Socket actions
io.on('connection', function(socket){
    
       
    clientColorArray[socket.id] = getPaletteColor();

    socket.on('setUserSessionId', (data) => {
        var userId = data.userSessionId;
        console.log('Set user session init : ' + userId);
        // si user n'est pas dans notre liste, lajouter dans le sketch et MAJ liste
        if (users[userId]==null || users[userId].id==''){
            console.log('Store user : ' + userId);
            io.to(p5SocketId).emit('newUser', {'userId' : userId});
            users[userId] = {'id' : userId };
        }
    });
    
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

    socket.on('visited', function (data) {
        console.log('Received visited message: ' + data.title);
        // todo create timeline for each user:
        let userSessionId = data.userSessionId;
        io.to(p5SocketId).emit('visited', data);
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


