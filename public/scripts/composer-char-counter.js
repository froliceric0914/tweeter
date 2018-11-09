$(document).ready(function() {
  $(".new-tweet form textarea").keyup(function() {
    const max = 140;
    const $textarea = $(this);
    const $counter = $(this)
      .siblings("footer")
      .children(".counter");
    const len = $textarea.val().replace(/\s/g, "").length; // exclude the counter from the space;
    const char = max - len;
    if (len >= max) {
      $counter.text(char).addClass("invalid");
    } else {
      $counter.text(char).removeClass("invalid");
    }
  });
});
