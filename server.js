//database requirements
var express = require("express");
var mongoose = require("mongoose");

//scraping tools
var cheerio = require("cheerio");
var axios = require("axios");

//display requirements
var expHb = require("express-handlebars");

//Require all models
var db = require("./models");

var PORT = 3000;

//Initialize Express
var app = express();

//Configure middleware

//Parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Made public a static folder
app.use(express.static("./public"));

//Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, function(err){
    if(err) throw err;
    console.log("Mongoose connection successful");
});

//A GET route for scraping the NYT website
app.get("/scrape", function(req, res) {
    //First, grab the body of the html with axios
    axios.get("https://www.nytimes.com/").then(function(response){
        //Load that into cheerio and save it to $ for shorthand
        var $ = cheerio.load(response.data);

        $("h2").each(function(i, element) {
            //Save an empty result object
            var result = {};

            //Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).text;
            result.link = $(this)
                .parent("div")
                .parent("a")
                .attr("href");

            //Create a new Article using the 'result' object built from scraping

            db.Article.create(result)
                .then(function(dbArticle) {
                    //View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    //If an error occurs, log it
                    console.log(err);
                });
        });

        //send a message to the client
        res.send("Scrape Complete");
    });
});

//Route for getting all the Articles from the db
app.get("/article", function(req, res) {
    db.Article.find({})
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json(data);
        })
});

//Route for grabbing a pecific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    db.Article.findOneAndUpdate({_id:req.params.id})
        .populate("note")
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
});

//Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
        .then(function(dbNote){
            console.log(dbNote);
            return db.Article.findOneAndUpdate({_id:req.params.id}, {note: dbNote._id}, {new: true});
        })
        .then(function(dbArticle){
            console.log(dbArticle);
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
});

//Start the server
app.listen(PORT, function() {
    console.log("App running on port" + PORT + "!");
});



