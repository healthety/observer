# Healthety OSX Client

This is a client for a Healthety Server written in javascript. CAUTION: its very messy!

The client connects to the server and provides growl notifications if defined limits are exceeded. He also writes a status file which can be used for geektool.

## Installation

First of all you need to install [Node](https://github.com/joyent/node/wiki/Installation) and the packet manager [npm](https://github.com/isaacs/npm#readme).

Then install Healthety by running:

    $ git clone repo; cd repo
    $ git submodule init; git submodule udpdate
    $ npm install growl

## Usage

    var server = require('healthety');
    server.run(
      8124, // http server port
      41234 // UDP server port
    );

Open http://localhost:8124 in your browser.

To report data you can use our worker. Currently there is a [Ruby](https://github.com/healthety/ruby_worker) and [PHP](https://github.com/healthety/php_worker) worker. We'll publish very soon a JavaScript worker library.

## Basic Auth

Optional you can use basic auth to protect your reports.

    var server = require('healthety');
    server.run(
      8124, // http server port
      41234, // UDP server port,
      {basicAuth: {user: 'admin', pass: 'secret'}}
    );

