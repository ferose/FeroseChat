var express = require('express')
  , exphbs  = require('express3-handlebars')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

app.use(
  "/static", //the URL throught which you want to access to you static content
  express.static(__dirname + "/static") //where your static content is located in your filesystem
);

app.engine('handlebars', exphbs({}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('index');
});

io.sockets.on('connection', function (socket) {
  socket.on('message', function(message) {
    socket.broadcast.emit('message', message);
  })
  socket.on('typing', function(message) {
    socket.broadcast.emit('typing', message);
  })
});

var port = Number(process.env.PORT || 3000);
server.listen(port);