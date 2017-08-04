
var express = require('express');
var app = express();
var socketIO = require('socket.io');

app.set('port', (process.env.PORT || 36118));       // set port to run into
app.use(express.static(__dirname + '/')); // app root dir

var io = socketIO.listen(app.listen(app.get('port'), function(){
  console.log("Server run on port ".concat(app.get('port')));
}))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('raspi-gps',function(json){
  	// console.log('GPS : '+json);
  	io.emit('gps-data',json);
  });

  socket.on('gps-on',function(msg){
  	console.log("GPS on");
  	io.emit('raspi-gps-on',msg);
  });

  socket.on('gps-off',function(msg){
  	console.log("GPS off");
  	io.emit('raspi-gps-off',msg);	
  });

  socket.on('capture-cam', function(msg){
    console.log("camera captured");
    io.emit('raspi-capture-cam', msg);
  });

  socket.on('raspi-photo-result', function(base64Photo){
    io.emit('result-capture-cam', base64Photo);
    console.log("base64 : " +base64Photo);
  })

});
 
// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });