// thank you kimmy c:
//yer welcmoe

$(window).scroll(function() {     
  var scroll = $(window).scrollTop();
  if (scroll > 24) {
      $("header").addClass("box-shadow");
  }
  else {
      $("header").removeClass("box-shadow");
  }
});

//hamburger
$("#nav-icon").click(function () {
  $(this).toggleClass("open");
  $(".hamoverlay").toggleClass("open");
  $(".hamoverlay a").toggleClass("open");
  $(".hamoverlay p").toggleClass("open");
});




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
  initTheme();

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
    path: "js/actrang.json",
  });
});

// SHOW/HIDE NAV

// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 150);

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('header').removeClass('show-nav').addClass('hide-nav');
        $('.nav-toggle').removeClass('open');
        $('.menu-left').removeClass('collapse');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('header').removeClass('hide-nav').addClass('show-nav');
        }
    }

    lastScrollTop = st;
}

const LOCAL_STORAGE_THEME_KEY = 'data-theme';

function initTheme() {
  const rootElem = document.documentElement;
  let localStorageTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);

  if (!['light', 'dark'].includes(localStorageTheme)) {
    localStorageTheme = 'light';
  }

  // Set the theme
  rootElem.setAttribute(LOCAL_STORAGE_THEME_KEY, localStorageTheme);
}

// Theme switcher function
function switchTheme() {
  const rootElem = document.documentElement;
  const currentTheme = rootElem.getAttribute(LOCAL_STORAGE_THEME_KEY);
  let newTheme;

  // the new theme will be the opposite of the currentTheme
  newTheme = (currentTheme === 'light') ? 'dark' : 'light';
  
  // Put the new-theme into localStorage
  localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);

  // Set the theme
  rootElem.setAttribute(LOCAL_STORAGE_THEME_KEY, newTheme);
}

// Add the theme-switcher button to the page
//const themeSwitcherButton = document.createElement('button');
//themeSwitcherButton.setAttribute('id', 'theme-switcher');
//themeSwitcherButton.innerHTML = 'Switch Themes!';
//document.body.appendChild(themeSwitcherButton);

// Add event listener for the theme switcher
document.querySelector('#theme-switcher').addEventListener('click', switchTheme);