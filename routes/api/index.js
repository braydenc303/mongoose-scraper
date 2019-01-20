//Get headlines from database as a json
$getJSON("/headlines", function(data){
    //For each one
    for (var i = 0; i < data.length; i++) {
        //Display the information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

//When a user clicks a p tag
$(document).on("click", "p", function(){
    //Empty the notes from the note section
    $("#notes").empty();
    //Save the id from the p tag
    var thisId = $(this).attr("data-id");

    //Now make an ajax call for the Headline
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    //Add the note information to the page
        .then(function(data){
            console.log(data);
            //The headline
            $("#notes").append("<h2>" + data.title + "</h2>");
            //An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title'>");
            //A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            //A button to submit a new note, with the id of the article saved to it.
            $("#notes").append("<button data-id='" + data.id + "'id='savenote'>Save Note</button>");

            //If there's a note in the article
            if (data.note) {
                //Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                //Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

//When the user clicks on the savenote button
$(document).on("click", "#savenote", function(){
    //Grab the id associated with the article from the submit button.
    var thisId = $(this).attr("data-id");

    //Run a POST to change the note, using the inputs
    $.ajax({
        method: "POST",
        url: "/headlines/" + thisId,
        data: {
            //Value taken from the title input
            title: $("#titleinput").val(),
            //Value taken from the note textarea
            body: $("#bodyinput").val()
        }
    })
        .then(function(data){
            // Log the Response
            console.log(data);
            //Empty the notes section
            $("#notes").empty();
        });
    //Also, remove the values entered in the input and text area for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
