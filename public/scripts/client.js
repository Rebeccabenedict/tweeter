$(document).ready(function() {
  $("#error-message-empty").hide();
  $("#error-message-tooLong").hide();

  const data = [];

  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const renderTweets = function(tweets) {
    $('#tweets-container').empty();
    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').append($tweet);
    }
  };

  const createTweetElement = function(tweetData) {
    let $tweet = $(`
  <article class="tweet">
        <header class="tweet-header">
          <div class="user-profile">
            <img class="user-icon" src="${tweetData.user.avatars}"></img> 
            <h4 class="user-name">${tweetData.user.name}</h4>
          </div>
          <div>
            <h4 class="user-handle">${tweetData.user.handle}</h4>
          </div>
        </header>
        <div class="tweet-text">
          ${escape(tweetData.content.text)}
        </div>
        <footer class="tweet-footer">
          <span class="tweet-date">${timeago.format(tweetData.created_at)}</span>
          <div class="tweet-response">
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>`);
    return $tweet;
  };

  const loadTweets = function() {
    $.get("/tweets/", function(newTweet) {
      renderTweets(newTweet.reverse());
    });
  };

  loadTweets();

  $("#new-tweet-form").submit(function(event) {
    event.preventDefault();
    const maxChar = 140;
    const inputLength = $(this).find("#tweet-text").val().length;
  
    $("#error-message-empty").slideUp("slow");
    $("#error-message-tooLong").slideUp("slow");

    if (!inputLength) {
      $("#error-message-empty").slideDown("slow");
      $("#error-message-tooLong").hide();
    } else if (inputLength - maxChar > 0) {
      $("#error-message-tooLong").slideDown("slow");
      $("#error-message-empty").hide();
    } else {
      const newTweet = $(this).serialize();
      $.post("/tweets/", newTweet, () => {
        $(this).find("#tweet-text").val("");
        $(this).find(".counter").val(maxChar);
        loadTweets();
      });
    }
  });
});