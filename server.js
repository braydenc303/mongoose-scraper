




var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, function(err){
    if(err) throw err;
    console.log("Mongoose connection successful");
});