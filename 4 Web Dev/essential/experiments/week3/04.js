$(function () {

    $(".resizeme").resizable();

    $(".resizemeall").resizable({
        handles: "n, e, s, w, ne, se, sw, nw"
    });


    $(".resizeme1").resizable({
        minWidth: 200,minHeight:200,maxHeight:800,maxWidth:800
    });

})

