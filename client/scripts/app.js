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

  var currentRoom = '4chan';
  var roomList = {};

  var shortenString = function(str, limit){
    str = str.split('').splice(0,limit).join('');
    str+='...';
    return str;
  }

  var message = function(text, username, updatedAt){
    if (text && text.length > 140){
      // text = text.split('').splice(0,141).join('');
      // text+='...';
      text = shortenString(text, 141);
    }
    $message = $(
      '<div class="msgContainer">' +
        '<div class="msgHeader">' +
          '<div class="userName" data-username=' + username + '><span>' + username + '</span></div>'+
          '<div class="timestamp" data-created="' + (updatedAt || new Date()) + '"><span>' + prettyDate(updatedAt || new Date()) + '</span></div>' +
        '</div>' +
        '<div class="msgContent"></div>' +
      '</div>'
    );

    $message.find('.msgContent').text(text);
    return $message;
  }

  var populateRoomList = function(roomname){
    // debugger;
    if(roomname){
      if (roomList[roomname] === undefined){
        roomList[roomname] = 0;
      }
    }
  }

  var displayRoomList = function(rooms){
    if (Object.keys(rooms).length){
      for (key in rooms){
        if (rooms[key] === 0){
            var roomName = key;
            if (roomName && roomName.length > 18){
              roomName = shortenString(roomName, 18);
            }
            $('ul').append('<li class="roomLabel"><a href="#">'+roomName+'</a></li>');
            rooms[key] = 1;
        }
      }
    }
  }

  var displayMsgs = function(msgArray){
    var msg;
    if ($chatContainer.children().length){
      for (var i = msgArray.results.length-1; i >= 0; i--){
        if(msgArray.results[i].roomname === currentRoom){
          $msg = message(msgArray.results[i].text, msgArray.results[i].username, msgArray.results[i].updatedAt);
            $chatContainer.children().last().remove();
            $chatContainer.prepend($msg);
          }
          populateRoomList(msgArray.results[i].roomname);
      }
    } else {
      for (var i=0; i< msgArray.results.length; i++){
        if(msgArray.results[i].roomname === currentRoom){
          $msg = message(msgArray.results[i].text, msgArray.results[i].username, msgArray.results[i].updatedAt);
          $chatContainer.append($msg);
        }
        populateRoomList(msgArray.results[i].roomname);
        // debugger;
      }
    }
    displayRoomList(roomList);
  }

  var fetch = function(){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: {order: '-updatedAt', limit: 20},
      success: displayMsgs,
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

  //input field/button events
  $('button').on('click', function(e){
    e.preventDefault();
    var msg = $('#msgInput').val();
    var msgToSend = {};
    msgToSend.text = msg;
    msgToSend.username = user;
    msgToSend.roomname = currentRoom;
    sendMsg(msgToSend);
    $('#msgInput').val('');
    fetch();
   });

  $('#msgInput').on('keypress', function(e){
    if (e.which == 13){
      $('button').click();
    }
  });

  $('.nav').on('click', 'a', function(e){
    e.preventDefault();
    $chatContainer.children().remove();
    currentRoom = $(this).text();
    fetch();
  });

  fetch();
  
  setInterval(fetch.bind(this), 3000);
});
