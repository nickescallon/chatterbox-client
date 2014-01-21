// YOUR CODE HERE:
//Takes in a string and returns its assigned value from the URL
function loadPageVar (sVar) {
  return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

//Takes in a timestamp and returns it in a human-friendly format
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
  
  //INITIALIZE VARIABLES
  var user = loadPageVar('username');
  var $chatContainer = $('#chatContainer');
  var currentRoom = '4chan';
  var roomList = {};
  var userList = {};


  //HELPER FUNCTIONS
  //Accepts a string and a character limit, and returns the
  //shortened string (up to the limit) + ...
  var shortenString = function(str, limit){
    str = str.split('').splice(0,limit).join('');
    str+='...';
    return str;
  }

  //ROOM LIST FUNCTIONS
  //Accepts a string and adds it to the roomList object
  var populateRoomList = function(roomname){
    // debugger;
    if(roomname){
      if (roomList[roomname] === undefined){
        roomList[roomname] = 0;
      }
    }
  }
  
  //Iterates through the roomlist object and appends them to the roomList UL
  var displayRoomList = function(rooms){
    if (Object.keys(rooms).length){
      for (key in rooms){
        if (rooms[key] === 0){
            var roomName = key;
            if (roomName && roomName.length > 18){
              roomName = shortenString(roomName, 18);
            }
            var $roomLable = $('<li class="roomLabel"><a href="#"></a></li>');
            $roomLable.find('a').text(roomName);
            $('#roomList').append($roomLable);
            rooms[key] = 1;
        }
      }
    }
  }

  //USER LIST FUNCTIONS
  //Accepts a string and adds it to the userList object
  var populateUserList = function(username){
    // debugger;
    if(username){
      if (userList[username] === undefined){
        userList[username] = 0;
      }
    }
  }
  
  //Iterates through the roomlist object and appends them to the roomList UL
  var displayUserList = function(users){
    if (Object.keys(users).length){
      for (key in users){
        if (users[key] === 0){
            var userName = key;
            if (userName && userName.length > 18){
              userName = shortenString(userName, 18);
            }
            var $userLable = $('<li class="userLabel"><a href="#"></a></li>');
            $userLable.find('a').text(userName);
            $('#userList').append($userLable);
            users[key] = 1;
        }
      }
    }
  }

  //MESSAGE FUNCTIONS
  //Accepts text, a username, and a timestamp, and returns an jQuery object 
  //of a structured html message
  var message = function(text, username, updatedAt){
    if (text && text.length > 140){
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

  //Accepts an array of messages. Iterates through the array, builds a message object for each item,
  //then removes the last message item in chatContainer, and prepends the new one.
  //Also populates the user and room lists
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
          populateUserList(msgArray.results[i].username);
      }
    } else {
      for (var i=0; i< msgArray.results.length; i++){
        if(msgArray.results[i].roomname === currentRoom){
          $msg = message(msgArray.results[i].text, msgArray.results[i].username, msgArray.results[i].updatedAt);
          $chatContainer.append($msg);
        }
        populateRoomList(msgArray.results[i].roomname);
        populateUserList(msgArray.results[i].username);
      }
    }
    displayRoomList(roomList);
    displayUserList(userList);
  }
  
  //Fetches the most recent messages from the server and calls displayMsgs upon success
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

  //Accepts a JSON message object and sends it to the server
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

  //EVENT LISTENERS/HANDLERS
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

  $('#arrow').on('click', function(){
  	if ($('.nav').width() > 0) {
  	  $('.nav').find('.roomsTitle').fadeOut();
  	  $('.nav').find('ul').fadeOut();
  	  $('.nav').animate({width:0});
  	} else {
  	  $('.nav').animate({width:200});
  	  $('.nav').find('.roomsTitle').fadeIn();
  	  $('.nav').find('ul').fadeIn();
  	}
    
  });

  //INITIAL FUNCTION CALLS AND INTERVALS
  fetch();
  setInterval(fetch.bind(this), 5000);
});
