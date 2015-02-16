$(function () {

    $(".hello").html(" This title is generated dynamically through jQueryUI !!");

    $(".dragme").draggable();

    $(".grid").draggable({
        revert: true
    });

})

