//Grab the articles as a json object
$.getJSON("/articles", function(data) {
    //For each one
    for (var i = 0; i < data.length; i++) {
        //Display the appropriate information on the page
        $("#articles").append("<p data-id='" + data[i]._id+ "'>" + data[i].title + "<br />" + data[i].link + "</p>").append("<button class='delete' data-id=" + data[i]._id + ">Delete!</button>");
    }
});

//When the user clicks on a p tag
$(document).on("click", "p", function() {
    //Empty the notes from the note section
    $("#notes").empty();
    //Save the id from the p tag
    var thisId = $(this).attr("data-id");

    //Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    //With that done, add the note information to the page
    .then(function(data) {
        console.log(data);
        //The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        //An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title'>");
        //A text area to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        //A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        //If there's a note in the article
        if (data.note) {
            //Place the title of the note in the title input
            $("#titleinput").val(data.note.title);
            //Place the body of the the note in the body textarea
            $("#bodyinput").val(data.note.body);
        }
    });
});

//When the user clicks the savenote button
$(document).on("click", "#savenote", function() {
    //Get the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    //Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            //Value taken from title input
            title: $("#titleinput").val(),
            //Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
    //With that done
    .then(function(data) {
        //Log the response
        console.log(data);
        //Empty the notes section
        $("#notes").empty();
    });

    //Also, remove the values entered in the input fields
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

//Logic for clear button
//Look up how to delete all records in a collection or pass in an empty object.
$(document).on("click", "#clear", function(){
    $.ajax({
        method: "DELETE",
        url: "/clear"
    })
    .then(function(res) {
        console.log(res);
        location.reload();
    })
});

//Logic for delete button
//ajax method: delete where
$(document).on("click", ".delete", function() {
    //Get the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    //Run a delete request to delete an article and it's associated note
    //This is deleting the article, but not the note currently.
    $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId,
    })
    .then(function(res){
        console.log(res);
        location.reload();
    })
});

//Logic for scrape button
$(document).on("click", "#scrape", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    .then(function(res){
        console.log(res);
        location.reload("/");
    })
});