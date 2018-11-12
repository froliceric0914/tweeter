/*
 logic flow: 1. fetch the data by {refresh the list}, 
              2. append each tweet by {remderTweets};
              3. set each tweet according to the CSS style by {creatTweetElement};
 */

function escape(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createDate(date) {
  const newDate = new Date(parseInt(date, 10));
  const createDate = newDate.toString("MM/dd/yy HH:mm:ss");
  const tweet_createDate = createDate.slice(4, 25);
  return tweet_createDate;
}

const createTweetElement = function(someUser) {
  const tweet_user_avatar = someUser.user.avatars.regular;
  const tweet_user_name = someUser.user.name;
  const tweet_user_handle = someUser.user.handle;
  const tweet_content = escape(someUser.content.text);
  const tweet_createDate = createDate(someUser.created_at);

  return $(` 
    <article class="tweet">
      <header>
        <img class="tweet_avatar" src=${tweet_user_avatar}>
        <span class="tweet_user">${tweet_user_name}</span>
        <span class="tweet_userHandle">${tweet_user_handle}</span>
      </header>
      <div class="tweet_body">
        <p>${tweet_content}</p>
      </div>

      <footer>
        <span>Created at ${tweet_createDate}</span>
        <div class="tweet_icon">
          <ion-icon name="flag"></ion-icon>
          <ion-icon name="md-repeat"></ion-icon>
          <ion-icon name="heart"></ion-icon>
        </div>
      </footer>
    </article>`);
};

// append each tweet to the tweets Container
const renderTweets = function(tweets) {
  $("#tweets-container").empty();
  tweets.forEach(element => {
    const $tweet = createTweetElement(element);
    $("#tweets-container").prepend($tweet);
  });
};

const refreshTweetsList = function() {
  $.get("/tweets", function(data) {
    renderTweets(data);
  });
};

$(document).ready(function() {
  refreshTweetsList(); //GET all the tweet in /tweets, but why post?

  $(".errShort").hide();
  $(".errLong").hide();

  const $form = $("form");

  $form.submit(function(event) {
    event.preventDefault();

    const $url = $form.attr("action");
    const $text = $(".container .new-tweet form textarea");
    const $len = $text.val().replace(/\s/g, "").length;

    //hide error before validating
    $(".errShort").hide();
    $(".errLong").hide();
    if ($len === 0) {
      $(".errShort").slideToggle("fast");
    } else if ($len > 140) {
      $(".errLong").slideToggle("fast");
    } else {
      $.ajax({
        type: "POST",
        url: $url,
        data: $(this).serialize(),
        success: function() {
          refreshTweetsList(); //POST whatever GET from /tweets, thus need to call
          $("form textarea").val("");
        }
      });
    }
  });

  $(".compose").click(function() {
    $(".new-tweet").slideToggle("slow");
    $("textarea").focus(); //automatically focus on textarea;
  });
});
