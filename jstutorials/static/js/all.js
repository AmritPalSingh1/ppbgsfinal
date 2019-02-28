/* eslint-disable */

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
