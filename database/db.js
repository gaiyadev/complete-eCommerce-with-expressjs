const mongoose = require('mongoose');

async function ConnectDb() {
    await mongoose.connect('mongodb://localhost:27017/nodeStore').
        then(() => console.log('Connected to Database Successfully...'))
        .catch(err => console.error('Failed Could not connect to Database', err));
}

ConnectDb();