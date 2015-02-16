$(document).ready(function() {
    $('#myButton').click(function () {
        console.log("in button");

        var title = $('#title').val();
        console.log(title);

      
        $.ajax({
            url: "http://www.myapifilms.com/imdb?title=" + title + "&format=JSONP&aka=0&business=0&seasons=0&seasonYear=0&technical=0&filter=N&exactFilter=0&limit=1&lang=en-us&actors=N&biography=0&trailer=0&uniqueName=0&filmography=0&bornDied=0&starSign=0&actorActress=0&actorTrivia=0&movieTrivia=0&awards=0&moviePhotos=N&movieVid",

            dataType: "jsonp",
            success: handleResponse
        })
    });
});


function handleResponse(response) {
   // debugger;
    console.log(response);

    var ul = $("#poster")


    ul.empty();

    for (var i = 0; i < response.length; i++) {
        var movie = response[i];

         
        var urlPoster = movie.urlPoster;
        

        var img = $("<img>").attr("src", urlPoster);

       


        var li = $("<li>");
       // li.css("list-style-type", "none");

       

        li.append($("<h3>").html("Poster: "));
        li.append(img);

        ul.append(img);

    }

}