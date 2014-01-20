// YOUR CODE HERE:
function loadPageVar (sVar) {
  return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

var user = loadPageVar('username');



var $body = $(document.body);

var message = function(text, username, updatedAt){
  //plan out and structure message div
  //to have header
  //text body
  //etc
  $message = $('<div></div>');
  $message.text(text);
  return $message;
}

var display = function(msgArray){
  var msg;
  for (var i = 0; i < msgArray.results.length; i++){
    $msg = message(msgArray.results[i].text, msgArray.results[i].username, msgArray.results[i].updatedAt);
    $body.append($msg);
  }
}

var fetch = function(){
	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'GET',
		success: function (data){
			display(data);
		},
		error: function (data){
			console.log('no data fetched');
		}
	});
};




// $.ajax({
//   // always use this url
//   url: 'https://api.parse.com/1/classes/chatterbox',
//   type: 'POST',
//   data: JSON.stringify(message)
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message');
//   }
// });