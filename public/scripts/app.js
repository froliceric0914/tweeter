/*
logic flow: 1. fetch the data by {refresh the list}, 
              2. append each tweet by {remderTweets};
              3. set each tweet according to the CSS style by {creatTweetElement};
 */

//escape the received content;
function escape(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//read the create_date
function createDate(date) {
  const newDate = new Date(parseInt(date, 10));
  const createDate = newDate.toString("MM/dd/yy HH:mm:ss");
  const tweet_createDate = createDate.slice(4, 25);
  return tweet_createDate;
}

//return all the data from database and return to whatever post on html
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

// append each tweet to the tweets Container,(need to reverse the database)
const renderTweets = function(tweets) {
  $("#tweets-container").empty(); // clear all the tweets posted before and reload again.
  tweets.forEach(element => {
    const $tweet = createTweetElement(element);
    $("#tweets-container").prepend($tweet);
  });
};

//GET all the tweet from the route /tweets
// the callback function in the ajax GET method helps us to filter out the Json data
const refreshTweetsList = function() {
  $.get("/tweets", function(data) {
    renderTweets(data);
  });
};

$(document).ready(function() {
  refreshTweetsList();

  //hide the error info till input rightly
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
          refreshTweetsList(); //POST whatever GET from /tweets
          $("form textarea").val("");
        }
      });
    }
  });
});
