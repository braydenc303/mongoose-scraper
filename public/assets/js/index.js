$(document).ready(function(){
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn-save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
    $(".clear").on("click", handArticleClear);

    function initPage() {
        $.get("/api/headlines?saved=false").then(function(data){
            if(data && data.length) {
                //If there are headlines in the database, render them to the page.
                renderArticles(data);
            } else {
                //Otherwise render a message stating there are no articles.
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        //Append article data to the page
        var articleCards = [];
        for(var i = 0; i < articles.length; i++) {
            articlesCards.push(createCard(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    function createCard(article) {
        //This function takes in the data for a headline and creates and element containing the HTML for that headline
        var card = $("<div class = 'card'>");
        var cardHeader = $("<div class = 'card-header'>").append(
            $("<h3>").append(
                $("<a class = 'article-link' target = '_blank'>")
                    .attr("href", article.url)
                    .text(article.headline),
                $("<a class = 'btn btn-success save'>Save Article</a>")
            )
        );

        var cardBody = $("<div class = 'card-body'>").text(article.summary);

        card.append(cardHeader, cardBody);
        //Attach the article id to the element to determine which article is to be saved.
        card.data("_id" ,article._id);
        return card;
    }

    function renderEmpty() {
        var emptyAlert = $("<h4>No new articles at present.</h4>");
        articleContainer.append(emptyAlert);
    }

    function handleArticleSave() {
        //When a user wishes to save an article, retrieve the object
        var articleToSave = $(this)
            .parents(".card")
            .data();

            //Remove card from page
            $(this)
                .parents(".card")
                .remove();
    }
})