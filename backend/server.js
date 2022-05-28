const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const express = require('express');

const PORT = process.env.PORT || 8000;
const app = express();

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');
app.use(express.static(path.resolve(__dirname,'../','frontend','public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (_,res) => res.render('home'));
app.use('/movies', require('./routes/movieRoutes'));

// Connecting to Mongo Atlas database
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology:true});
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