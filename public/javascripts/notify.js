var mySocket = new WebSocket(ws_url);
var token = Cookies.get("kanku_notify_session");

// Preloading images
$.each(['32', '64'], function(index, size) {
  $.each(['', '-danger', '-success', '-warning'], function(index, ext) {
    image = new Image();
    image.src = uri_base + '/images/' + size + '/kanku' + ext + '.png';
  });
});

mySocket.onmessage = function (evt) {
  console.log( "Got message " + evt.data );
  data = JSON.parse(evt.data);
  var ico_ext = '';
  if ( data.result == 'failed' ) {
    ico_ext = '-danger'
  }
  var ico = uri_base + '/images/64/kanku' + ico_ext + '.png';
  console.log(ico);
  Notification.requestPermission(function() {
    var n = new Notification(data.title, {
	body: data.body,
	icon: ico
    });
    n.onclick = function() {
        window.open(data.link, 'newwindow', "menubar=no");
        n.close();
    };
    setTimeout(n.close.bind(n), 20000);
  });
};

mySocket.onopen = function(evt) {
  console.log("opening Socket");
  var ico = uri_base + '/images/32/kanku-success.png';
  Notification.requestPermission(function() {
    $("#favicon").attr("href",ico);
    setTimeout(
      function() {
	var msg = '{"token":"'+ token +'"}';
	console.log("sending token " + msg);
	console.log(msg)
	mySocket.send(msg);
      },
      2000
    );
    setTimeout(
      function() {
	mySocket.send('{"bounce":"Opened WebSocket successfully!"}');
      },
      2000
    );
  });
};

mySocket.onclose = function(evt) {
  Notification.requestPermission(function() {
    var m = 'Closed WebSocket - no more messages will be displayed';
    var ico = uri_base + '/images/64/kanku-danger.png';

    var n = new Notification('Kanku Desktop Notification', {
	body: m,
	icon: ico
    });
    $("#content").text(m);
    n.onclick = function() {
        window.location.href = 'notify';
        n.close();
    };
    setTimeout(n.close.bind(n), 20000);
  });
  var ico = uri_base + '/images/32/kanku-danger.png';
  $("#favicon").attr("href",ico);
};

if (! window.Notification ) {
  alert("Notifications not availible in your browser!");
} else if (Notification.permission !== "granted") {
   Notification.requestPermission(function() {});
} else {
  $('#trigger_notify_succeed').click(
    function(){
    Notification.requestPermission(function() {
      var n = new Notification('Kanku Test Notification - succeed', {
	body: 'Test notification - succeed',
	icon: 'images/64/kanku-success.png' // optional
      });
      n.onclick = function() {
        window.location.href = 'job_history';
        n.close();
      };
      setTimeout(n.close.bind(n), 20000);
    });
  });
  $('#trigger_notify_failed').click(
    function(){

    Notification.requestPermission(function() {
      var n = new Notification('Kanku Test Notification - failed', {
	body: 'Test notification - failed',
	icon: 'images/64/kanku-danger.png' // optional
      });
      n.onclick = function() {
        window.location.href = 'job_history';
        n.close();
      };
      setTimeout(n.close.bind(n), 20000);
    });
  });
  $('#trigger_notify_warning').click(
    function(){

    Notification.requestPermission(function() {
      var n = new Notification('Kanku Test Notification - warning', {
	body: 'Test notification - warning',
	icon: 'images/64/kanku-warning.png' // optional
      });
      n.onclick = function() {
        window.location.href = 'job_history';
        n.close();
      };
      setTimeout(n.close.bind(n), 20000);
    });
  });
}
