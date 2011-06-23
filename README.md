# Healthety OSX Client

This is a client for a Healthety Server written in javascript.

The client connects to the server and provides growl notifications if defined limits are exceeded. He also writes a status file which can be used for geektool.

## Installation

First of all you need to install [Node](https://github.com/joyent/node/wiki/Installation) and the packet manager [npm](https://github.com/isaacs/npm#readme).

Then install by running:

    $ git clone git://github.com/healthety/osx_growl_geektool_client.git; cd osx_growl_geektool_client
    $ git submodule init; git submodule update
    $ cd lib/node-socket.io-client; git submodule init; git submodule update; cd ../..
    $ npm install growl

## Usage

Configure the limits and the socket endpoint at the beginning of main.js to your needs and run the client with:

    $ ./main.js

## Geektool

Create a shell geeklet and paste the following command:

    cat /path/to/osx_growl_geektool_client/status
