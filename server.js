const app = require("./src/app");
const {app: {port}} = require('./src/configs/config.dynamodb');

const server = app.listen(port, () => {
    console.log('start %d', port);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('end');
    });
});