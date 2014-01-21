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
    if (text && text.length > 140){
      text = text.split('').splice(0,141).join('');
      text+='...';
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

    // $message.text(username + ": " + text+'\n'+ prettyDate(updatedAt));    
    $message.find('.msgContent').text(text);
    return $message;
  }


  // $tweet = $('<div class="tweet">' +
  //             '<div class="heading">' +
  //               '<div class="user" data-username="' + tweet.user + '"><span>@' + tweet.user + '</span></div>' +
  //               '<div class="timestamp" data-created="' + (tweet.created_at || new Date()) + '">' + prettyDate(tweet.created_at || new Date()) + '</div>' +
  //             '</div>' +
  //             '<div class="content">' + tweet.message + '</div>' +
  //           '</div>');

  var display = function(msgArray){
    var msg;
    if ($chatContainer.children().length){
      for (var i = 0; i < msgArray.results.length; i++){
        $msg = message(msgArray.results[i].text, msgArray.results[i].username, msgArray.results[i].updatedAt);
        $chatContainer.children().last().remove();
        $chatContainer.append($msg);

      }
    } else {
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
    'text': 'Baconipsumdolorsitametandouilledrumstickpastrami,tri-tippigporchettarump.Ribeyeporkloinporkchopkevinhampig,hamhockfrankfurterdonerstripsteakbiltongtri-tippastramiturduckenporkbelly.Porchettaballtiptailbeefribs,andouillebrisketshankt-bonesalamirumpstripsteakdoner.Venisonchuckrumpballtip.Bacondrumstickporkchop,bresaolapigbeefribsmeatloafchuckchickenporkbeefjerkyflankcapicolacow.Porkbellyshanklefiletmignonshortribscornedbeef.Leberkastri-tipchickenbeef,porchettakevinfatbackjerkybresaolaribeyecapicola.Meatballpancettapig,tongueandouilleporchettavenisonporkbellytailspareribsporkchopfrankfurter.Turkeyprosciuttobiltong,sirloinchickenhampork.Flanktailmeatballbeefribsprosciutto.Bresaolapastramisalami,cowfatbacktailshortloinjerkymeatballshoulderfiletmignonkevinporkchopflank.Drumstickballtiphamjerky.Turduckenjowljerkyt-bone.Filetmignongroundroundprosciuttocornedbeefshanklehamhockcapicolajerky.Porkbellytailporkporchettapastrami,kielbasashoulderturkeystripsteakrump.Porchettahamhockspareribs,porkchopshoulderhamleberkaspancettadrumstick.Porkloin pancetta meatloaf rump tail shoulder ham hamburger ball tip turkey frankfurter flank pork pork chop meatball. Pork loin turducken pork chop chicken. Corned beef tri-tip sirloin, pork belly brisket hamburger ham hock. Drumstick tail spare ribs boudin short loin ground round bacon ribeye hamburger cow doner turkey filet mignon. Pork tongue corned beef porchetta. Pork belly kielbasa meatball beef landjaeger rump. Jowl venison brisket shankle sausage ham hock leberkas doner beef drumstick pig short ribs short loin. Ball tip spare ribs shank, shankle venison pork chop meatloaf tail pork loin prosciutto porchetta. Biltong doner porchetta, short ribs ribeye sirloin beef ham corned beef pastrami swine. Porchetta meatloaf ground round, kevin fatback tri-tip cow pork loin salami sausage strip steak hamburger. Doner tri-tip ham kielbasa, capicola pancetta salami ribeye jerky shankle. Leberkas kielbasa tenderloin, shoulder kevin sausage bresaola cow.',
    'roomname': '4chan'
  };

  fetch();
  setInterval(fetch.bind(this), 2000);
  // sendMsg(messageToSend);
  // sendMsg(messageToSend);
});

/*
var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};
*/