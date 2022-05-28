const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let reviewSchema = Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'No user specified'],
    },
    movie: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'No movie specified'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        require: [true, 'No rating specified'],
    },
    comment: {
        type: String,
        minlength: 1,
        maxlength: [255, 'Character limit for comments is 255'],
    }
});

module.exports = mongoose.model('Review', reviewSchema);
