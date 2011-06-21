# Healthety OSX Client

This is a client for a Healthety Server written in javascript.

The client connects to the server and provides growl notifications if defined limits are exceeded. He also writes a status file which can be used for geektool.

## Installation

First of all you need to install [Node](https://github.com/joyent/node/wiki/Installation) and the packet manager [npm](https://github.com/isaacs/npm#readme).

Then install Healthety OSX Client by running:

    $ git clone repo; cd repo
    $ git submodule init; git submodule update
    $ npm install growl

## Usage

Change the limits at the beginning of main.js to your needs and run the client with:

    $ ./main.js

## Geektool

Create a command geeklet and paste the following command:

    cat $FOLDER/status
