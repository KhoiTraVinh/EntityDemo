'use strict'
const os = require('os');
const process = require('process');
const mongoose = require('mongoose');
const sec = 5000;
//count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    return numConnection;
}

//check overload
const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections = numCores * 5;

        console.log('active con: %d', numConnection);
        console.log('memory: %d', memoryUsage / 1024 / 1024);

        if(numConnection > maxConnections)
        {
            console.log('over load');
        }

    }, sec)
}

module.exports = {
    countConnect,
    checkOverLoad
}