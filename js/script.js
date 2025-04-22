$(window).scroll(function () {
    if ($(this).scrollTop() > 2) {
        $("nav").addClass("scrolled");
    } else {
        $("nav").removeClass("scrolled");
    }
});