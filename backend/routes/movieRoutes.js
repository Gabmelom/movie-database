const express = require('express');
const router = express.Router();
const Movie = require('../models/movieModel');

// TODO Movie page should show review count, average rating, and review comments <- needs to be queried apart

// router.post('/', authorize,createMovie, updatePeople, sendNotifications);
// router.param("id",findMovie);
// router.get('/:id', inWatchlist, loadMovie);
// router.get('/:id/reviews', paginationParser, loadReviews);
// router.post('/:id/reviews', addReview);

router.get('/', async (req,res) => {
    const MAX_RESULTS = 30;
    let query = Movie.find().select('title poster');
    
    // Parse pagination params
    req.query.page = Number(req.query.page);
    if (!req.query.page || req.query.page < 1) 
        req.query.page = 1;
    query = query.limit(MAX_RESULTS).skip((req.query.page-1) * MAX_RESULTS);

    // Parse movie query params
    req.query.year = Number(req.query.year);
    if (req.query.title) query = query.where('title').regex(new RegExp(`.*${req.query.title}.*`, 'i'));
    if (req.query.genre) query = query.where('genre').regex(new RegExp(`.*${req.query.genre}.*`, 'i'));
    if (req.query.year)  query = query.where('year').gte(req.query.year);
    
    try {
        const movies = await query.exec();
        res.json(movies);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.param('id', async (req, res, next, id) => {
    try {
        req.movie = await Movie.findById(id);
        if (req.movie === null)
            return res.status(404).send('Not Found');
    } catch (error) {
        if (error.name === 'CastError') 
            return res.status(400).send('Bad request')
        return res.status(500).send('Server error');
    }
    next();
});

router.get('/:id', async (req,res) => {
    res.json(req.movie);
});

router.post('/', async (_,res) => {
    res.json({ message: 'POST movies' });
});

module.exports = router