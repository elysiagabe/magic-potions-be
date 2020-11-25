const express = require('express');
const cors = require('cors');

// Routers
const potionsRouter = require('../potions/potions-router');

const server = express();

server.use(express.json());
server.use(cors())

server.use('/api/magic', potionsRouter);

server.get("/", (req, res) => {
    res.json({ api: "Up & running!"});
});

module.exports = server;