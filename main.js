#!/usr/bin/env /usr/local/bin/node

// configure limits.
var limits = {
  load_average: {'.*': 9},
  memory: {'.*': 12000}
}

// lets start with a hack. Needed to not quit, but wait for events...
require('http').createServer(function(req, res) {})
  .listen(1338, "127.0.0.1");

var growl = require('growl');
var io = require("./lib/node-socket.io-client/socket.io").io;
var socket = new io.Socket('overminda.kaeuferportal.eu', {port: '8124'});
var fs = require('fs');
socket.connect();

var memo = {load_average: {}, memory: {}}

socket.on('message', function(data){
  var json = JSON.parse(data);
  if(json.name === 'load_average' || json.name === 'memory'){
    memo[json.name][json.host.split('.')[0]] = json.value;
  }
});

Object.prototype.foreach = function( callback ) {
  for( var k in this ) {
    if(this.hasOwnProperty(k)) { callback( k, this[ k ] ); }
  }
}

setInterval(
  function(){
    // check agains limits
    limits.foreach(function(report_type, v){
      v.foreach(function(expr, limit){
        memo[report_type].foreach(function(host, curr){
           if(host.match(expr) && curr > limit){
             var message = report_type + ' on ' + host + ' to high!';
             growl.notify(
               message, {title: 'Healthety', image: 'chart.png'}
             );
          }
        });
      });
    });
    // save state to file
    var filestr = '';
    var sortable_mem = [];
    for(var host in memo.memory){
      if(host !== 'foreach')
        sortable_mem.push([host, memo.memory[host]])
    }
    var sortable_load = [];
    for(var host in memo.load_average){

        sortable_load.push([host, memo.load_average[host]])
    }

    sortable_mem.sort(function(a,b){return b[1] - a[1]});
    sortable_load.sort(function(a,b){return b[1] - a[1]});

    for(e in sortable_load){
      var host = sortable_load[e][0];
      var load = sortable_load[e][1];
      var mem = ''
      if(typeof sortable_mem[e] != 'undefined')
        mem = sortable_mem[e][1];
      if(host !== 'foreach' && typeof host != 'undefined' && !host.match(/lvps/))
        filestr += pad_str_right(host + ':', 8) + pad_str_left(load, 4) + ' / ' + mem + '\n';
    }

    fs.writeFile('/Users/hans/development/observer/status', filestr);
  },
  1000
)
function pad_number(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}
function pad_str_right(string, length) {
  var str = '' + string;
  while (str.length < length) {
    str = str + ' ';
  }
  return str;
}
function pad_str_left(string, length) {
  var str = '' + string;
  while (str.length < length) {
    str = ' ' + str;
  }
  return str;
}
