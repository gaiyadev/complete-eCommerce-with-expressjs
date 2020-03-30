require('dotenv').config();
const mongoose = require('mongoose');

async function ConnectDb() {
    await mongoose.connect(process.env.APP_DB_CONNECTION).
        then(() => console.log('Connected to Database Successfully...'))
        .catch(err => console.error('Failed Could not connect to Database', err));
}

ConnectDb();