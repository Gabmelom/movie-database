const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let movieSchema = Schema({
    title: {
        type: String,
        minlength: 1,
        required: [true, 'Movie title not specified'],
        index: true,
    },
    year: { 
        type: Number, 
        required: [true, 'Year not specified'], 
    },
    rated: { 
        type: String,
        default: 'R',
    },
    runtime: { 
        type: Number,
        default: 90,
    },
    genre: { 
        type: [String],
        required: [true, 'Genre not specified'],
    },
    actors: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    directors: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    writers: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    plot: { 
        type: String, 
        required: [true, 'Plot not specified'],
    },
    awards: { 
        type: String,
        default: '', 
    },
    poster: {
        type: String,
        default: Math.floor(Math.random() * 2)
            ? '/img/defaultPoster1.jpeg'
            : '/img/defaultPoster2.jpeg',
    },
});

// TODO improve below
// Query helper: match movies whose cast's names include given ID
movieSchema.query.byCastID = function (castID) {
    return this.find().or([
        { directors: { $in: castID } },
        { writers: { $in: castID } },
        { actors: { $in: castID } },
    ]);
};

// Instance method: Find 5 similar movies based on genre
movieSchema.methods.findSimilarMovies = function () {
    return this.find()
        .where('genre')
        .in(this.genre)
        .where('_id')
        .ne(this._id)
        .select('title poster')
        .limit(5);
};

// Static method: Find top 20 rated movies
movieSchema.statics.topRated = function () {
    return this.find().sort('-averageRating').limit(20);
};

module.exports = mongoose.model('Movie', movieSchema);
