const asyncHandler = require('express-async-handler')
const router = require('express').Router();
const Movie = require('../models/movieModel');

// TODO Movie page should show review count, average rating, and review comments <- needs to be queried apart

// DONE router.post('/', authorize,createMovie, updatePeople, sendNotifications);
// DONE router.param("id",findMovie);
// DONE router.get('/:id', inWatchlist, loadMovie);
// router.get('/:id/reviews', paginationParser, loadReviews);
// router.post('/:id/reviews', addReview);

router.get('/', asyncHandler(async (req,res) => {
    const MAX_RESULTS = 30;
    let query = Movie.find().select('title poster');
    
    // Parse pagination parameters
    req.query.page = Number(req.query.page);
    if (!req.query.page || req.query.page < 1) 
        req.query.page = 1;
    query = query.limit(MAX_RESULTS).skip((req.query.page-1) * MAX_RESULTS);

    // Parse movie query parameters
    req.query.year = Number(req.query.year);
    if (req.query.title) query = query.where('title').regex(new RegExp(`.*${req.query.title}.*`, 'i'));
    if (req.query.genre) query = query.where('genre').regex(new RegExp(`.*${req.query.genre}.*`, 'i'));
    if (req.query.year)  query = query.where('year').gte(req.query.year);
    
    const movies = await query.exec();
    res.status(200).json(movies);
}));

router.param('id', async (req, res, next, id) => {
    try {
        req.movie = await Movie.findById(id);
        if (req.movie === null){
            res.status(404);
            return next(new Error('Movie not found'));
        }
        next();
    } catch (error) {
        if (error.name === 'CastError') 
            res.status(404);
        next(error);
    }
});

router.get('/:id', asyncHandler(async (req,res) => {
    res.status(200).json(req.movie);
}));

router.post('/', asyncHandler(async (req,res) => {
    try {
        let movie = await Movie.create({...req.body});
        res.status(201).json(movie);   
    } catch (error) {
        if (error.name === 'ValidationError')
            res.status(400)
        throw error
    }
}));

router.delete('/:id', asyncHandler(async (req,res) => {
    await req.movie.remove();
    res.status(204).send();
}));

module.exports = router;