'use strict ';

require('dotenv').config();
const server = require('./lib/server.js');
const mongoose = require('mongoose');


const MONGOOSE_URI = 'mongodb://localhost:27017/LAB15';


mongoose.connect(MONGOOSE_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

server.start();