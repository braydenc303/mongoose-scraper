var mongoose = require("mongoose");

//Save a reference to the constructor

var Schema = mongoose.Schema;

//Using the constuctor, create a new Schema similar to a Sequelize model
var HeadlineSchema = new Schema({
    //"title" is required and of type String
    title: {
        type: String,
        required: true
    },
    //"link" is required and of type String
    link: {
        type: String,
        required: true
    },
    //"note" is an object that stores a Note id. The ref property links the ObjectId to the Note model. This allows us to populate the Article with an associated Note.
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Headline = mongoose.model("Headline", HeadlineSchema);

//Export the Article model
module.exports = Headline;