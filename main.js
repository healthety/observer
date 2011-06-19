// lets start with a hack. Needed to not quit, but wait for events...
require('http').createServer(function(req, res) {})
  .listen(1337, "127.0.0.1");

var growl = require('growl');
var io = require("./lib/node-socket.io-client/socket.io").io;
var socket = new io.Socket('overminda.kaeuferportal.eu', {port: '8124'});
socket.connect();

var limits = {
  load_average: {'raynor': '>8', 'tychus|egon|': '>6'},
  memory: {'.*': 5000}
}
var memo = {load_average: {}, memory: {}}

socket.on('message', function(data){
  var json = JSON.parse(data);
  if(json.name === 'load_average' || json.name === 'memory'){
    memo[json.name][json.host.split('.')[0]] = json.value;
  }
});

setInterval(
  function(){
    // check agains limits
    if(false){
      growl.notify('XXX to high!', {image: 'chart.png'});
    }
  },
  1000
)
