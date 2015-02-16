
$.ajax({
    url: "http://www.myapifilms.com/imdb?title=inception&format=JSONP&aka=0&business=0&seasons=0&seasonYear=0&technical=0&filter=N&exactFilter=0&limit=1&lang=en-us&actors=N&biography=0&trailer=0&uniqueName=0&filmography=0&bornDied=0&starSign=0&actorActress=0&actorTrivia=0&movieTrivia=0&awards=0&moviePhotos=N&movieVid",

    dataType: "jsonp",
    success: handleResponse
});

function handleResponse(response) {
   // debugger;
    console.log(response);

    var ul = $("#movies")

    ul.empty();
    for(var i=0; i<response.length; i++)
    {
        var movie = response[i];

        var title = movie.title;
        var urlPoster = movie.urlPoster;
        console.log(title);
        var directors = movie.directors[i];
         
        var dname = directors.name;

        var plot = movie.plot;
       
     
        console.log([title,dname,plot, urlPoster]);

        var t = $("<p>") .html(title)
       
        var img = $("<img>").attr("src", urlPoster);

        var p = $("<p>").html(plot);
        

        var d = $("<p>").html(dname);


        var li = $("<li>");
        li.css("list-style-type", "none");

        li.append($("<h3>").html("Title: "));
        li.append(t);
       

        li.append($("<h3>").html("Director: "));
        li.append(dname);

        li.append($("<h3>").html("Plot: "));
        li.append(p);

        li.append($("<h3>").html("Poster: "));
        li.append(img);

        ul.append(li);

    }

}