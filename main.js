#!/usr/bin/env /usr/local/bin/node

// configure limits.
var limits = { '.*': [8, 12000] };

// configure socket Endpoint
var socketEndpoint = 'overminda.kaeuferportal.eu';

var fs = require('fs');
var io = require("./lib/node-socket.io-client/socket.io").io;
var socket = new io.Socket(socketEndpoint, {port: '8124'});
var growl = require('growl');

socket.connect();

var hosts = []
var memo = []
var typePostions = { load_average: 0, memory: 1 }

socket.on('message', function(data){
  var json = JSON.parse(data);
  if(
    (json.name === 'load_average' || json.name === 'memory') &&
    !json.host.match(/lvps/)
  ){
    var host = json.host.split('.')[0];
    var hostPostion = hosts.indexOf(host);
    if(hostPostion == -1) {
      hosts.push(host);
      hostPostion = hosts.indexOf(host);
      memo[hostPostion] = []
    }

    memo[hostPostion][typePostions[json.name]] = json.value;
  }
});

setInterval(checkAndWrite, 1000)

function checkAndWrite(){
  checkLimits();
  writeStatusFile();
}

function checkLimits() {
  for(var regexp in limits){
    var loadLimit = limits[regexp][typePostions['load_average']];
    var memoryLimit = limits[regexp][typePostions['memory']];

    for(var i in memo) {
      var host = hosts[i];
      var load = memo[i][typePostions['load_average']];
      var memory = memo[i][typePostions['memory']];

      if( memory > memoryLimit || load > loadLimit) {
        growl.notify(
          host + ' goes crazy!!', {title: 'Healthety', image: 'chart.png'}
        );
      }
    }
  }
}

function writeStatusFile() {
  var fileContent = [];
  for(var i in memo) {
    var host = hosts[i];
    var load = memo[i][typePostions['load_average']];
    var memory = memo[i][typePostions['memory']];
    fileContent.push([
      padStrRight(host + ':', 8),
      padStrLeft(load, 4),
      ' / ' + memory
    ]);
  }
  fileContent.sort( function(a, b) { return b[1] - a[1] } );
  fileContentMerged = [];
  for(var i in fileContent) {
    fileContentMerged.push(fileContent[i].join(''))
  }
  fs.writeFile('./status', fileContentMerged.join('\n'));
}

function padStrRight(string, length) {
  var str = '' + string;
  while (str.length < length) {
    str = str + ' ';
  }
  return str;
}
function padStrLeft(string, length) {
  var str = '' + string;
  while (str.length < length) {
    str = ' ' + str;
  }
  return str;
}
