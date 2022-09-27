const mongoose = require('mongoose');
const dbURL = "mongodb+srv://nitinegi:nitinegi126@onboardingprojectcluste.u5dhert.mongodb.net/?retryWrites=true&w=majority";

// connect to mongoDB
function connect() {
    mongoose.connect(dbURL).then(() => {
        console.log("connected to MongoDB");
    }).catch((err) => {
        console.error(err);
    });
}

module.exports.connect = connect;
