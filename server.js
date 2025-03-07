const app = require("./src/app");

const server = app.listen(3055, () => {
    console.log('start');
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('end');
    });
});