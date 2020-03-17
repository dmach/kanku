function toggle_element(id) {
  var element = $(id);
  var css_display = element.css("display");
  var style = (css_display == "none") ? "block" : 'none';
  element.css("display", style);
}

function show_messagebox(state, msg, timeout=10000) {
  var elem = $("#messagebox");
  console.log(elem);
  var div = $('<div class="alert-' + state +' container alert"></div>').text(msg);
  elem.append(div);
  if(timeout) {
    var intervalID = setTimeout(function() { div.remove(); }, timeout);
  }
}
