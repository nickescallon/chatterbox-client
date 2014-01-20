// YOUR CODE HERE:
function loadPageVar (sVar) {
  return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

var prettyDate = function(timeStamp){
  var currentDate = new Date();
  var currentTime = currentDate.getTime();
  var createdTime = Date.parse(timeStamp);
  var timeDelta = (currentTime - createdTime)/1000;

  if(timeDelta < 60){
    return "less than a minute ago";
  }else if (timeDelta >= 60 && timeDelta < 120){
    return "a minute ago";
  }else if (timeDelta >= 60 && timeDelta < 3600){
    var t = Math.floor(timeDelta/60).toString();
    return t + " minutes ago";
  }else if (timeDelta >= 3600){
    var t = Math.floor(timeDelta/3600).toString();
    return t + " hours ago";
  }
};

$(document).on('ready', function(){
  var user = loadPageVar('username');
  var $chatContainer = $('#chatContainer');

  var message = function(text, username, updatedAt){
    //plan out and structure message div
    //to have header
    //text body
    //etc
    $message = $('<div class="msgContainer"></div>');
    $message.text(username + ": " + text+'\n'+ prettyDate(updatedAt));
    return $message;
  }

  var display = function(msgArray){
    var msg;
    if ($chatContainer.children().length){
      for (var i = 0; i < msgArray.results.length; i++){
        $msg = message(msgArray.results[i].text, msgArray.results[i].username, msgArray.results[i].updatedAt);
        $msgDiv = $chatContainer.find("div").eq(i);
        $msgDiv.text($msg.text());

      }
    } else{
      for (var i=0; i< msgArray.results.length; i++){
        $msg = message(msgArray.results[i].text, msgArray.results[i].username, msgArray.results[i].updatedAt);
        $chatContainer.append($msg);
      }
    }
  }

  var fetch = function(){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: {order: '-updatedAt', limit: 20},
      success: function (data){
        display(data);
      },
      error: function (data){
      }
    });
  };

  var sendMsg = function(message){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      }
    });
  };

  var messageToSend = {
    'username': 'adam&&nick',
    'text': 'all ya\'ll be trippin\'!!!',
    'roomname': '4chan'
  };

  fetch();
  setInterval(fetch.bind(this), 2000);
  // sendMsg(messageToSend);
});

/*
var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};
*/