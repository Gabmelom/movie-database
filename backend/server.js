const path = require('path')
const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

// Initializing application
const PORT = process.env.PORT || 3000;
const app = express();

// Express middleware
app.set('views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_,res) => { res.send('Hello! Your app is working!') });

// Connecting to Mongo Atlas database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology:true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to database'));
db.once('open', () => {
	app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Server terminated');
        process.exit(0);
    });
});