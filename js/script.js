// thank you kimmy c:
//yer welcmoe

var $document = $(document),
  $element = $("header"),
  classNames = "box-shadow sticky";

// Hide Header on on scroll down
var didScroll;
// var lastScrollTop = 0;
// var delta = 5;
// var navbarHeight = $("header").outerHeight();
// var firstSectionHeight = $("#first-section").outerHeight();

// Start listening for the 'scroll' event
$document.scroll(function (event) {
  didScroll = true;

  if ($document.scrollTop() >= 55) {
    // Change 50 to the value you require
    // for the event to trigger
    $element.addClass(classNames);
  } else {
    $element.removeClass(classNames);
  }
});

setInterval(function () {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

function hasScrolled() {
  var st = $(this).scrollTop();

  // Make sure they scroll more than delta
  if (Math.abs(lastScrollTop - st) <= delta) return;

  // If they scrolled down and are past the navbar, add class .nav-up.
  // This is necessary so you never see what is "behind" the navbar.
  if (st > lastScrollTop && st > firstSectionHeight - navbarHeight) {
    // Scroll Down
    $("header").removeClass("nav-down").addClass("nav-up");
  } else if (st + $(window).height() < $(document).height()) {
    // Scroll Up
    $("header").removeClass("nav-up").addClass("nav-down");
  }

  lastScrollTop = st;
}

$(".nav-item").click(function () {
  $(this).siblings().removeClass("active");
  $(this).addClass("active");
});

//hamburger
$("#nav-icon").click(function () {
  $(this).toggleClass("open");
  $(".hamoverlay").toggleClass("open");
  $(".hamoverlay a").toggleClass("open");
  $(".hamoverlay p").toggleClass("open");
});

// parallax scrolling

// $(document).scroll(function () {
//   var st = $(this).scrollTop();
//   $("header").css({
//     "background-position-y": -st / 20,
//   });
//   $("#first-section").css({
//     top: -st / 5,
//     bottom: st / 5,
//   });
// });

// fade as you scroll

// $(window).scroll(function () {
//   $(".introtext").css("opacity", 1 - $(window).scrollTop() / 500);
// });

// win.scroll(function(){
//   scrollPosition = win.scrollTop();
//   scrollRatio = 1 - scrollPosition / 300;
//   $(".top").css("opacity", scrollRatio);

// $(window).scroll(function(){
//     var scrollVar = $(window).scrollTop();
//     $('.top').css("opacity", 1 - scrollVar/300);
// })
(function ($) {
  $(document).ready(function () {
    $(".hamburger__container").click(function () {
      $(".nav").toggleClass("open");
      $(this).children().first().toggleClass("open");
      $("html, body").toggleClass("noscroll");
    });

    // Bacon Ipsum
    $.ajax({
      url:
        "https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1&format=html",
      success: function (data) {
        $("#content").html(data);
      },
    });
  });
})(jQuery);

/*start slide in animation here*/
/*Interactivity to determine when an animated element in in view. In view elements trigger our animation*/
$(document).ready(function () {
  //window and animation items
  var animation_elements = $.find(".anim");
  var web_window = $(window);

  //check to see if any animation containers are currently in view
  function check_if_in_view() {
    //get current window information
    var window_height = web_window.height();
    var window_top_position = web_window.scrollTop();
    var window_bottom_position = window_top_position + window_height;

    //iterate through elements to see if its in view
    $.each(animation_elements, function () {
      //get the element sinformation
      var element = $(this);
      var element_height = $(element).outerHeight();
      var element_top_position = $(element).offset().top;
      var element_bottom_position = element_top_position + element_height;

      //check to see if this current container is visible (its viewable if it exists between the viewable space of the viewport)
      if (
        element_bottom_position >= window_top_position &&
        element_top_position <= window_bottom_position
      ) {
        element.addClass("in-view");
      }
      // else {
      //   element.removeClass("in-view");
      // }
    });
  }

  //on or scroll, detect elements in view
  $(window).on("scroll resize", function () {
    check_if_in_view();
  });
  //trigger our scroll event on initial load
  $(window).trigger("scroll");

  var animation = bodymovin.loadAnimation({
    container: document.getElementById("bodymovin-ac"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "actrang.json",
  });
});
