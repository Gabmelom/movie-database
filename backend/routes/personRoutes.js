const asyncHandler = require('express-async-handler');
const router = require('express').Router();
const Person = require('../models/personModel');

// router.get('/', paginationParser,queryParser,searchDatabase,sendPeople);
// router.post('/', authorize,createPerson, updateMovies, sendNotifications);
// router.param("id",findPerson);
// router.get('/:id', isFollower, loadPerson);

router.get('/', asyncHandler(async (req, res) => {
    const MAX_RESULTS = 30;
    let query = Person.find().select('name');
    
    // Parse pagination parameters
    req.query.page = Number(req.query.page);
    if (!req.query.page || req.query.page < 1) 
        req.query.page = 1;
    query = query.limit(MAX_RESULTS).skip((req.query.page-1) * MAX_RESULTS);

    // Parse person query parameters
    if (req.query.name) query = query.where('name').regex(new RegExp(`.*${req.query.name}.*`, 'i'));
    
    const persons = await query.exec();
    res.status(200).json(persons);
}));

router.post('/', asyncHandler(async (req,res) => {
    try {
        let person = await Person.create({...req.body});
        res.status(201).json(person);   
    } catch (error) {
        if (error.name === 'ValidationError')
            res.status(400)
        throw error
    }
}));

router.param('id', async (req, res, next, id) => {
    try {
        req.person = await Person.findById(id);
        if (req.person === null){
            res.status(404);
            return next(new Error('Person not found'));
        }
        next();
    } catch (error) {
        if (error.name === 'CastError') 
            res.status(404);
        next(error);
    }
});

router.get('/:id', asyncHandler(async (req,res) => {
    res.json(req.person);
}));

router.delete('/:id', asyncHandler(async (req,res) => {
    await req.person.remove();
    res.status(204).send();
}));

module.exports = router;