//Import express
var express = require("express");
// var app = express();

//Other requirements:
//scraping tools
var cheerio = require("cheerio");
var axios = require("axios");

//Create the router to be exported
var router = express.Router();

//Require all models
var db = require("../models");

// //Import the headline model to use its database functions
// var headline = require("../models/headline");

// //Parse request body as JSON
// app.use(express.urlencoded({extended: true}));
// app.use(express.json());

// //display requirements
// var expHb = require("express-handlebars");

// app.engine("handlebars", expHb({ defaultLayout: "main"}));
// app.set("view engine", "handlebars");


router.get("/", function(req, res){
    res.render("index");
    // db.Headline.find({})
    //     .then(function(data){
    //         res.render("index");
    //     })
    //     .catch(function(err){
    //         res.json(err);
    //     })
});


//Create routes and set up logic within those routes where required
//A GET route for scraping the CSS-Tricks website
router.get("/scrape", function(req, res) {
    //First, grab the body of the html with axios
    axios.get("https://www.css-tricks.com/archives/").then(function(response){
        //Load that into cheerio and save it to $ for shorthand
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element) {
            //Save an empty result object
            var result = {};

            //Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            //Create a new Article using the 'result' object built from scraping

            db.Headline.create(result)
                .then(function(dbHeadline) {
                    //View the added result in the console
                    console.log(dbHeadline);
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
router.get("/articles", function(req, res) {
    db.Headline.find({})
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json(data);
        })
});

//Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
    db.Headline.findOne({_id:req.params.id})
        .populate("note")
        .then(function(dbHeadline){
            res.json(dbHeadline);
        })
        .catch(function(err){
            res.json(err);
        });
});

//Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
        .then(function(dbNote){
            console.log(dbNote);
            return db.Headline.findOneAndUpdate({_id:req.params.id}, {note: dbNote._id}, {new: true});
        })
        .then(function(dbHeadline){
            console.log(dbHeadline);
            res.json(dbHeadline);
        })
        .catch(function(err){
            res.json(err);
        });
});

//Route for deleting an article.
router.delete("/articles/:id", function(req, res) {
    var condition = {_id:req.params.id};

    db.Headline.remove(condition, function(result){
        res.json(result);
    })
    .catch(function(err){
        res.json(err);
    })
});

//Route for deleting a note.
router.delete("/notes/:id", function(req, res) {
    var condition = {_id:req.params.id};

    db.Note.remove(condition, function(result){
        res.json(result);
    })
    .catch(function(err){
        res.json(err);
    })
});

module.exports = router;
