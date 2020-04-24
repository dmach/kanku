const pwResetPage = {
  methods: {
    sendPWResetRequest:function() {
      console.log($('#pwuser').val()); 
      var user = $('#pwuser').val();
      if (user) {
	console.log("Send passwort reset request for user " + user);
	var url  = uri_base + "/rest/pwreset/"+user+".json";
	axios.get(url).then(function(response) {
	  show_messagebox(response.data.state, response.data.msg );
	});
      } else {
	show_messagebox('danger', 'No username entered!');
      }
    }
  },
  template:'<form>'
    + '  <h1>Request a password reset code</h1>'
    + '  <h2 class="form-signin-heading">Please enter your username:</h2>'
    + '  <label for="pwuser" class="sr-only">Username</label>'
    + '  <input id="pwuser" class="form-control" placeholder="Username" required autofocus>'
    + '  <strong>Please check your emails and reset your password</strong>'
    + '  <button class="btn btn-lg btn-success btn-block" @click="sendPWResetRequest">Submit</button>'
    + '</form>'
};

const pwSetPage = {
  data: function() {
    return {
      code: this.$route.query.code,
      password: '',
      repeat_password: '',
    };
  },
  methods: {
    sendPWResetRequest:function() {
      console.log(this.code);
      if ( $('#set_password').val() == $('#set_repeat_password').val()) {
	var data = {
	  code: this.code,
	  new_password: $('#set_password').val(),
	};
	var url  = uri_base + "/rest/setpass.json";
	axios.post(url, data).then(function(response) {
	  show_messagebox(response.data.state, response.data.msg );
	}).catch(function(error) {
	   show_messagebox('danger', error);
        });
      } else {
	show_messagebox('danger', 'Entered passwords differ. Please retry!');
      }
    }
  },
  template:'<div class="form-signin">'
    + '  <input id="code" type="hidden" :value="code">'
    + '  <label for="password" class="sr-only">Password</label>'
    + '  <input type=password :value="password" id="set_password" class="form-control" placeholder="Enter your password" required autofocus>'
    + '  <label for="repeat_password" class="sr-only">Repeat Password</label>'
    + '  <input type=password :value="repeat_password" id="set_repeat_password" class="form-control" placeholder="Enter your password again" required>'
    + '  <button class="btn btn-lg btn-success btn-block" @click="sendPWResetRequest">Submit</button>'
    + '</div>'
};
