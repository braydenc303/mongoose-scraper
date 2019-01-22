//database requirements
var express = require("express");
var app = express();
var mongoose = require("mongoose");

//scraping tools
var cheerio = require("cheerio");
var axios = require("axios");

//Require all models
var db = require("./models");

//Set localhost port
var PORT = 3000;

//Initialize Express
var app = express();

//Configure middleware

//Parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Made public a static folder
app.use(express.static("./public"));

//display requirements
var expHb = require("express-handlebars");

app.engine("handlebars", expHb({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, function(err){
    if(err) throw err;
    console.log("Mongoose connection successful");
});

//Import routes and give the server access to them.
var routes = require("./controllers/headline");

app.use(routes);

// //A GET route for scraping the CSS-Tricks website
// app.get("/scrape", function(req, res) {
//     //First, grab the body of the html with axios
//     axios.get("https://www.css-tricks.com/archives/").then(function(response){
//         //Load that into cheerio and save it to $ for shorthand
//         var $ = cheerio.load(response.data);

//         $("article h2").each(function(i, element) {
//             //Save an empty result object
//             var result = {};

//             //Add the text and href of every link, and save them as properties of the result object
//             result.title = $(this)
//                 .children("a")
//                 .text();
//             result.link = $(this)
//                 .children("a")
//                 .attr("href");

//             //Create a new Article using the 'result' object built from scraping

//             db.Article.create(result)
//                 .then(function(dbArticle) {
//                     //View the added result in the console
//                     console.log(dbArticle);
//                 })
//                 .catch(function(err) {
//                     //If an error occurs, log it
//                     console.log(err);
//                 });
//         });

//         //send a message to the client
//         res.send("Scrape Complete");
//     });
// });

// //Route for getting all the Articles from the db
// app.get("/articles", function(req, res) {
//     db.Article.find({})
//         .then(function(data) {
//             res.json(data);
//         })
//         .catch(function(err) {
//             res.json(data);
//         })
// });

// //Route for grabbing a pecific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//     db.Article.findOne({_id:req.params.id})
//         .populate("note")
//         .then(function(dbArticle){
//             res.json(dbArticle);
//         })
//         .catch(function(err){
//             res.json(err);
//         });
// });

// //Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res){
//     db.Note.create(req.body)
//         .then(function(dbNote){
//             console.log(dbNote);
//             return db.Article.findOneAndUpdate({_id:req.params.id}, {note: dbNote._id}, {new: true});
//         })
//         .then(function(dbArticle){
//             console.log(dbArticle);
//             res.json(dbArticle);
//         })
//         .catch(function(err){
//             res.json(err);
//         });
// });

// // //Route for deleting an article.
// // app.delete("/articles/:id", function(req, res) {
// //     var condition = {_id:req.params.id};

// //     db.Article.remove(condition, function(result){
// //         res.json(result);
// //     })
// //     .catch(function(err){
// //         res.json(err);
// //     })
// // });

// // //Route for deleting a note.
// // app.delete("/notes/:id", function(req, res) {
// //     var condition = {_id:req.params.id};

// //     db.Note.remove(condition, function(result){
// //         res.json(result);
// //     })
// //     .catch(function(err){
// //         res.json(err);
// //     })
// // });

//Start the server
app.listen(PORT, function() {
    console.log("App running on port" + PORT + "!");
});



