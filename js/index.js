/*eslint no-undef: "warn"*/
/*eslint no-console: "warn"*/
/*eslint no-unused-vars: "warn"*/

// This .ready() function means that the document is ready. 
// If anything is outside of this, the code will run before the document is ready.
$(document).ready(function () {
  $(window).scroll(function () {
    var top =  $(".goto-top");
        if ( $('body').height() <= (    $(window).height() + $(window).scrollTop() + 200 )) {
  top.animate({"margin-left": "0px"},1500);
        } else {
            top.animate({"margin-left": "0px"},1500);
        }
    });

    $(".goto-top").on('click', function () {
        $("html, body").animate({scrollTop: 0}, 1100);
    });

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
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight){
            // Scroll Down
            $('header').removeClass('nav-down').addClass('nav-up');
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height()) {
                $('header').removeClass('nav-up').addClass('nav-down');
            }
        }

        lastScrollTop = st;
    }


     var $document = $(document),
       $element = $('header'),
       className = 'box-shadow';

    // Start listening for the 'scroll' event
     $document.scroll(function() {
         console.log($document.scrollTop());
       if ($document.scrollTop() >= 5) {
         // Change 50 to the value you require
         // for the event to trigger
         $element.addClass(className);
       } else {
         $element.removeClass(className);
       }
     });
    
    // On page load, check the $document.scrollTop().
    // If scrollTop() is >= 5, then add the class 'box-shadow' to $('header')
    // This is a fix for the box-shadow not appearing on refresh.
    if ($document.scrollTop() >= 5) {
        console.log('happens exactly once');
        $element.addClass(className);
    }

});







// Fade bio pictures in
  function showImages(el) {
        var windowHeight = jQuery( window ).height();
        $(el).each(function(){
            var thisPos = $(this).offset().top;

            var topOfWindow = $(window).scrollTop();
            if (topOfWindow + windowHeight - 200 > thisPos ) {
                $(this).addClass("fadeIn");
            }
        });
    }

    // if the image in the window of browser when the page is loaded, show that image
    $(document).ready(function(){
            showImages('.star');
    });

    // if the image in the window of browser when scrolling the page, show that image
    $(window).scroll(function() {
            showImages('.star');
    });


//loading screen
	// Wait for window load
	$(window).load(function() {
		// Animate loader off screen
		$(".se-pre-con").fadeOut("slow");
	});

//replace blurry images
(function() {
  'use strict';
  // Page is loaded
  var objects = document.getElementsByClassName('asyncImage');
  Array.prototype.forEach.call(objects, function(item) {
    // Start loading image
    var img = new Image();
    img.src = item.dataset.src;
    // Once image is loaded replace the src of the HTML element
    img.onload = function() {
      item.classList.remove('asyncImage');
      return item.nodeName === 'IMG' ? 
        item.src = item.dataset.src :        
        item.style.backgroundImage = "url(" + item.dataset.src + ")";
    };
  });
})();