/*eslint no-undef: "warn"*/
/*eslint no-console: "warn"*/
/*eslint no-unused-vars: "warn"*/

document.getElementById("project").style.display = "block";

// This .ready() function means that the document is ready.
// If anything is outside of this, the code will run before the document is ready.
$(document).ready(function() {
  $(window).scroll(function() {
    var top = $(".goto-top");
    if (
      $("body").height() <=
      $(window).height() + $(window).scrollTop() + 200
    ) {
      top.animate({ "margin-left": "0px" }, 1500);
    } else {
      top.animate({ "margin-left": "0px" }, 1500);
    }
  });

  $(".goto-top").on("click", function() {
    $("html, body").animate({ scrollTop: 0 }, 1100);
  });

  var $document = $(document),
    $element = $("header"),
    className = "box-shadow";

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
    console.log("happens exactly once");
    $element.addClass(className);
  }
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = $(".myImg");
var modalImg = $("#img01");
var captionText = document.getElementById("caption");
$(".myImg").click(function() {
  modal.style.display = "block";
  var newSrc = this.src;
  modalImg.attr("src", newSrc);
  captionText.innerHTML = this.alt;
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
myModal.onclick = function() {
  modal.style.display = "none";
};
// Fade bio pictures in
function showImages(el) {
  var windowHeight = jQuery(window).height();
  $(el).each(function() {
    var thisPos = $(this).offset().top;

    var topOfWindow = $(window).scrollTop();
    if (topOfWindow + windowHeight - 200 > thisPos) {
      $(this).addClass("fadeIn");
    }
  });
}

// if the image in the window of browser when the page is loaded, show that image
$(document).ready(function() {
  showImages(".star");
});

// if the image in the window of browser when scrolling the page, show that image
$(window).scroll(function() {
  showImages(".star");
});

//loading screen
// Wait for window load
$(window).load(function() {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");
});

//hamburger

$(document).ready(function() {
  $("#nav-icon").click(function() {
    $(this).toggleClass("open");
    $(".hamoverlay").toggleClass("open");
    $(".hamoverlay a").toggleClass("open");
    $(".hamoverlay p").toggleClass("open");
  });
});

//replace blurry images
(function() {
  "use strict";
  // Page is loaded
  var objects = document.getElementsByClassName("asyncImage");
  Array.prototype.forEach.call(objects, function(item) {
    // Start loading image
    var img = new Image();
    img.src = item.dataset.src;
    // Once image is loaded replace the src of the HTML element
    img.onload = function() {
      item.classList.remove("asyncImage");
      return item.nodeName === "IMG"
        ? (item.src = item.dataset.src)
        : (item.style.backgroundImage = "url(" + item.dataset.src + ")");
    };
  });
})();
