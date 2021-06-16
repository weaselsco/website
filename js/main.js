$(document).ready(function() {
  new WOW().init();
  M.AutoInit();
  $('.sidenav').sidenav({
    closeOnClick: true
  });

  $('.parallax').parallax();

  $('.scrollspy').scrollSpy({
    scrollOffset: 80,
  });

  $('.carousel.carousel-slider').carousel({
    fullWidth: false,
    indicators: true,
  });
  autoplay();

  function autoplay() {
      $('.carousel.carousel-slider').carousel('next');
      setTimeout(autoplay, 5000);
  }

  setTimeout(function(){
      $('body').addClass('loaded');
  }, 1200);
});

$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll >= 64) {
        $(".navbar-default").addClass("navbar-collapsed");
    }
    else {
        $(".navbar-default").removeClass("navbar-collapsed");
    }
});
