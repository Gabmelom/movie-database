const asyncHandler = require('express-async-handler');
const router = require('express').Router();
const Person = require('../models/personModel');

// router.get('/', paginationParser,queryParser,searchDatabase,sendPeople);
// router.post('/', authorize,createPerson, updateMovies, sendNotifications);
// router.param("id",findPerson);
// router.get('/:id', isFollower, loadPerson);

router.get('/', asyncHandler(async (req, res) => {
    
}));

module.exports = router;