const app = require("./src/app");

const server = app.listen(3052, () => {
    console.log('start %d', 3052);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('end');
    });
});