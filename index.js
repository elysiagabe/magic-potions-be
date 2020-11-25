const server = require('./src/api/server.js');

const port = process.env.port || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port}**\n`));