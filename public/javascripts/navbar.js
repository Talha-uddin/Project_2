$(document).ready(function() {
    $("#nav--top__link-home").click(function() {
        $("#nav--top__link-home").addClass("active");
        $("#nav--top__link-projects").removeClass("active");
        $("#nav--top__link-contact").removeClass("active");
    });
    $("#nav--top__link-projects").click(function() {
        $("#nav--top__link-projects").addClass("active");
        $("#nav--top__link-home").removeClass("active");
        $("#nav--top__link-contact").removeClass("active");
    });
    $("#nav--top__link-contact").click(function() {
        $("#nav--top__link-contact").addClass("active");
        $("#nav--top__link-projects").removeClass("active");
        $("#nav--top__link-home").removeClass("active");
    });

});
script