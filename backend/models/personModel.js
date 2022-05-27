const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let personSchema = Schema({
	name: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 40
	},
    director: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
    writer: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
    actor: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
});

// Instance method: Find top 5 collaborators of a person, returns 
personSchema.methods.top5Collaborators = function (callback) {
    // Find movies where current person was part of cast
    let name = this.name;
    this.populate('director', 'title directors actors writers').
    populate('writer', 'title directors actors writers').
    populate('actor', 'title directors actors writers').
    execPopulate(function(err,person){
        // Creating object with key = person name, value = times collaborated
        if (err) throw err;
        let map = {};
        let movies = person.director.concat(person.writer).concat(person.actor)
        movies.forEach(movie => {
            for (const director of movie.directors) {
                if (director == name) continue;
                if (map[director]) map[director]++;
                else map[director] = 1;
            }
            for (const actor of movie.actors) {
                if (actor == name) continue;
                if (map[actor]) map[actor]++;
                else map[actor] = 1;
            }
            for (const writer of movie.writers) {
                if (writer == name) continue;
                if (map[writer]) map[writer]++;
                else map[writer] = 1;
            }
        });
        // Creating collaborators list
        let collaborators = [];
        for (const person in map) {
            if (collaborators.length == 0) {
                if(!collaborators.includes(person)) collaborators.push(person);
            }
            else{
                for (let i = 0; i < collaborators.length; i++) {
                    if (map[person] >= map[collaborators[i]] && !collaborators.includes(person)){
                        collaborators.splice(i,0,person);
                        collaborators = collaborators.slice(0,5);
                        break;
                    } 
                    else if (collaborators.length < 5 && !collaborators.includes(person)) collaborators.push(person);
                }
            }
        }
        callback(err,collaborators);
    });
};

// Instance method: Find all users that follow this person
personSchema.methods.findFollowers = function (callback) {
    this.model("User").find().
    where("peopleFollowing").in(this._id).
    select('notifications').
    exec(callback);
}

// Instance method: Sends given notification object to all followers
personSchema.methods.sendNotification = function (notification, callback) {
    this.findFollowers((err,followers) => {if (err) console.log(err);
        followers.forEach((follower) =>{
            follower.notifications.push(notification);
            follower.save(callback);
        })
    });
}

module.exports = mongoose.model("Person", personSchema);