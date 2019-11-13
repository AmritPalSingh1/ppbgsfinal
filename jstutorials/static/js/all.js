// Pre loader
setTimeout(function(){
  const loader = document.querySelector(".loader");
  loader.classList.add("hidden");
}, 5000);
window.addEventListener("load", function(){
  setTimeout(function(){
    const loader = document.querySelector(".loader");
    loader.classList.add("hidden");
  }, 500);
});


// Formatting topics page images
var $grid = $(".gallery-wrapper").masonry({
  itemSelector: ".grid-item",
  columnWidth: ".grid-sizer",
  percentPosition: true,
  transitionDuration: 0
});

$grid.imagesLoaded().progress(function() {
  $grid.masonry();
});

// Bootstrap messages custom timeout
setTimeout(function() {
  $("#message").fadeOut("slow");
}, 3000);

// Badges info popovers
$("document").ready(function() {
  var popOverSettings = {
    placement: "left",
    selector: ".icon",
    trigger: "hover",
    content: "This is badge information"
  };
  $(this).popover(popOverSettings);
});

// Quiz options Selection functionality
$(".quiz-option-outer").on("click", function(e) {
  if ($(e.target).is(".quiz-option")) {
    e.stopPropagation();
  } else {
    if ($("input:radio", this).prop("checked") === true) {
      console.log("returning false");
      return false;
    }
    $("input:radio", this).prop("checked", true);
  }
  console.log("Clicked : " + $(this).attr("class"));
});

function quizItem(radio) {
  console.log("radio" + 1);
  console.log(radio);
  for (let i = 1; i <= 4; i++) {
    document.getElementById("radio" + i).style.backgroundColor = "#f8f9fa";
    document.getElementById("radio" + i).style.color = "black";
  }
  document.getElementById(radio).style.backgroundColor = "#ff214f";
  document.getElementById(radio).style.color = "white";
}

// Points pop messages
setTimeout(function() {
  $("#pop-message").fadeOut("slow");
}, 5000);

$(window).on('load',function(){
  $('#messages').modal('show');
});

// Count up animation
$('.countup').each(function () {
  $(this).prop('Counter',0).animate({
      Counter: $(this).text()
  }, {
      duration: 1500,
      easing: 'swing',
      step: function (now) {
          $(this).text(Math.ceil(now));
      }
  });
});