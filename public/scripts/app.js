/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// $( "button" ).click(function() {
//   $( "p" ).slideToggle( "slow" );
// });

function escape(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//ajust the tweet according to the CSS style
const createTweetElement = function(someUser) {
  //someUser should be an Object
  const tweet_user_avatar = someUser.user.avatars.regular;
  const tweet_user_name = someUser.user.name;
  const tweet_user_handle = someUser.user.handle;
  const tweet_content = escape(someUser.content.text); //escape the received content;
  const tweet_createDate = someUser.created_at;
  //reture to the class of tweet, instead of the whole scrtion of #tweets-container;
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
        <span>${tweet_createDate}</span>
        <div class="tweet_icon">
          <ion-icon name="flag"></ion-icon>
          <ion-icon name="md-repeat"></ion-icon>
          <ion-icon name="heart"></ion-icon>
        </div>
      </footer>
    </article>`);
};

// append each tweet to the tweets Container,(need to reverse the database)
// let reversed_tweets = tweets.reverse();
const renderTweets = function(tweets) {
  $("#tweets-container").empty(); // clear all the tweets posted before and reload again.
  tweets.forEach(element => {
    const $tweet = createTweetElement(element);
    $("#tweets-container").prepend($tweet);
  });
};

//GET all the tweet from the route /tweets
// the callback function in the ajax GET method helps us to filter out the Json data
// const reverseData = reverseDatabase(data); we could put the newest data on the top
const refreshTweetsList = function() {
  $.get("/tweets", function(data) {
    renderTweets(data);
  });
};

/* logic flow: 1. fetch the data by {refresh the list}, 
              2. append each tweet by {remderTweets};
              3. set each tweet according to the CSS style by {creatTweetElement};
*/

$(document).ready(function() {
  refreshTweetsList(); //GET all the tweet in /tweets, but why post?

  $(".errShort").hide();
  $(".errLong").hide();
  $(".compose").click(function() {
    $(".new-tweet").slideToggle("fast");
    $("textarea").focus(); //automatically focus on textarea;
  });

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
});
