$('.parallax').parallax();

// LOADER
$(document).ready(function() {
  setTimeout(function(){
      $('body').addClass('loaded');
  }, 3000);

// FULL MENU
// ZROBIĆ FUNKCJE Z TEGO
  $('#btn').click(function() {
    $(this).toggleClass('active');
    $('#menu').toggleClass('open');
    $('main').toggleClass('hide');
  });
  $('.menu-list').on('click', 'li', function(e) {
    $('#btn').toggleClass('active');
    $('#menu').toggleClass('open');
    $('main').toggleClass('hide');
  });

// PAGE SCROLL
  $('a.page-scroll').bind('click', function(event) {
    event.preventDefault();
    var $anchor;
    $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top -10
    }, 1250, 'easeInOutExpo');
  });

});
