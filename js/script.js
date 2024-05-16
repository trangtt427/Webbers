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

class CuteSwitcher extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div id="theme-switcher">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" id="icon-sun">
    <g filter="url(#filter0_b_879_51)">
    <circle cx="24" cy="24" r="24" fill="white" fill-opacity="0.4"/>
    </g>
    <path d="M24 32.2253C19.4647 32.2253 15.7748 28.5355 15.7748 24.0002C15.7748 19.4648 19.4647 15.775 24 15.775C28.5353 15.775 32.2252 19.4648 32.2252 24.0002C32.2252 28.5355 28.5353 32.2253 24 32.2253Z" />
    <path d="M24 14.0701C23.3616 14.0701 22.8441 13.5525 22.8441 12.9142V9.15591C22.8441 8.51754 23.3616 8 24 8C24.6384 8 25.1559 8.51754 25.1559 9.15591V12.9142C25.1559 13.5525 24.6384 14.0701 24 14.0701Z" />
    <path d="M24 40C23.3616 40 22.8441 39.4825 22.8441 38.8441V35.0858C22.8441 34.4475 23.3616 33.9299 24 33.9299C24.6384 33.9299 25.1559 34.4475 25.1559 35.0858V38.8441C25.1559 39.4826 24.6384 40 24 40Z"/>
    <path d="M38.8441 25.1559H35.0858C34.4475 25.1559 33.9299 24.6384 33.9299 24C33.9299 23.3616 34.4475 22.8441 35.0858 22.8441H38.8441C39.4825 22.8441 40 23.3616 40 24C40 24.6384 39.4826 25.1559 38.8441 25.1559Z" />
    <path d="M12.9142 25.1559H9.15591C8.51754 25.1559 8 24.6384 8 24C8 23.3616 8.51754 22.8441 9.15591 22.8441H12.9142C13.5525 22.8441 14.0701 23.3616 14.0701 24C14.0701 24.6384 13.5525 25.1559 12.9142 25.1559Z" />
    <path d="M31.8389 17.317C31.5432 17.317 31.2473 17.2042 31.0216 16.9784C30.5702 16.5269 30.5702 15.795 31.0216 15.3437L33.6792 12.6864C34.1306 12.235 34.8625 12.2348 35.3138 12.6864C35.7652 13.1378 35.7652 13.8697 35.3138 14.321L32.6563 16.9784C32.4306 17.2042 32.1347 17.317 31.8389 17.317Z"/>
    <path d="M13.5035 35.6524C13.2078 35.6524 12.9119 35.5396 12.6862 35.3138C12.2348 34.8624 12.2348 34.1304 12.6862 33.6792L15.3437 31.0216C15.7952 30.5702 16.5271 30.5702 16.9784 31.0216C17.4298 31.4731 17.4298 32.205 16.9784 32.6563L14.3208 35.3138C14.0952 35.5396 13.7994 35.6524 13.5035 35.6524Z"/>
    <path d="M34.4963 35.6524C34.2005 35.6524 33.9046 35.5396 33.679 35.3138L31.0215 32.6563C30.5701 32.2048 30.5701 31.4729 31.0215 31.0216C31.4729 30.5702 32.2048 30.5702 32.6561 31.0216L35.3136 33.6792C35.765 34.1306 35.765 34.8625 35.3136 35.3138C35.088 35.5396 34.7922 35.6524 34.4963 35.6524Z"/>
    <path d="M16.1611 17.317C15.8653 17.317 15.5694 17.2042 15.3437 16.9784L12.6862 14.321C12.2348 13.8696 12.2348 13.1378 12.6862 12.6864C13.1377 12.235 13.8696 12.2348 14.3208 12.6864L16.9784 15.3437C17.4298 15.7952 17.4298 16.5269 16.9784 16.9784C16.7527 17.2042 16.457 17.317 16.1611 17.317Z"/>
    <defs>
    <filter id="filter0_b_879_51" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feGaussianBlur in="BackgroundImageFix" stdDeviation="2"/>
    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_879_51"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_879_51" result="shape"/>
    </filter>
    </defs>
    </svg>
    
      
  </div>`
  }
}

customElements.define('cute-switcher', CuteSwitcher)

// Add event listener for the theme switcher
document.querySelector('#theme-switcher').addEventListener('click', switchTheme);