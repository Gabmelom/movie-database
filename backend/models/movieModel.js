const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let movieSchema = Schema({
	title: {
		type: String,
		required: true,
		minlength: 1,
	},
    // TODO maybe change this to Number?
	year: { type: String, required: true },
	rated: { type: String, required: true },
	released: String,
	runtime: { type: String, required: true },
    genre: { type: [String], required: true },
    directors: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    writers: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    actors: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    plot: { type: String, required: true },
    awards: { type:String, default:''},
    // TODO change this to a user provided picture type: Image might be a thing?
    poster: { type:String, default: (Math.floor(Math.random()*2))? "/images/defaultPoster1.jpeg":"/images/defaultPoster2.jpeg" },
    reviews: [{ 
        user: { type: String, ref: 'User'},
        summary: String,
        comment: String,
        rating: Number
    }],
    reviewCount: {type:Number,default:0},
    averageRating: {type:Number, default:0}
});

// TODO change byCastName to byCastID and pass ID as value to match

// Query helper: match movies whose cast's names include given name
movieSchema.query.byCastID = function (cast){
    return this.find().or([
		{directors: { $in: cast}},
		{writers: { $in: cast}},
		{actors: { $in: cast}}
	])
};

// Query helper: match movies with cast member matching exactly given name
movieSchema.query.matchNames = function (names){
    return this.or([
		{directors: { $in: names}},
		{writers: { $in: names}},
		{actors: { $in: names}}
	])
};

// Instance method: Find 5 similar movies based on genre
movieSchema.methods.findSimilarMovies = function() {
    return this.find().
    where("genre").in(this.genre).
    where("_id").ne(this._id).
    select('title poster').
    limit(5);
};

// Static method: Find top 20 rated movies
movieSchema.statics.topRated = function() {
    return this.find().
    sort("-averageRating").
    limit(20);
}

module.exports = mongoose.model("Movie", movieSchema);