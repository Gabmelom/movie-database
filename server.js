require('dotenv').config();
const path = require('path')
const express = require('express');
const mongoose = require('mongoose');

// Initializing application
const PORT = process.env.PORT || 3000;
const app = express();

// Express middleware
app.set('views');
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', (_,res) => { res.send('Hello! Your app is working!')});


// Connecting to Mongo Atlas database
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology:true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to database'));
db.once('open', function() {
	app.listen(PORT, () => console.log(`Server listening at ${PORT}`));
});