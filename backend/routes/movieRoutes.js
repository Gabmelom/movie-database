const express = require('express');
const router = express.Router();
const Movie = require('../models/movieModel');

// TODO Movie page should show review count, average rating, and review comments

router.get('/', async (_,res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).send('Database error');
    }
});

router.post('/', async (_,res) => {
    res.json({ message: 'POST movies' });
});

module.exports = router