const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
	username: {
		type: String, 
		required: true,
		minlength: 1,
		maxlength: 32
	},
    password: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 256
    },
    contributing: { type: Boolean, default: false },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    usersFollowing: [{ type: String, ref: 'User' }],
    peopleFollowing: [{ type: String, ref: 'Person' }],
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }]
},
{
    timestamps: true
});

// Instance method: Find recommended movies based on people following and highest rated movies, excludes movies already in watchlist
userSchema.methods.findRecommendedMovies = function (callback) {
    //TODO
};

// Instance method: Find all other users that follow this user
userSchema.methods.findFollowers = function (callback) {
    //TODO
}

// Instance method: Sends given notification object to all of user's followers
userSchema.methods.sendNotification = function (notification, callback) {
 //TODO ??   
}

module.exports = mongoose.model("User", userSchema);