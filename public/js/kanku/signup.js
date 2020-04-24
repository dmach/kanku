const signUpPage = {
  methods: {
    sendSignUpRequest: function() {
      console.log("sendSignUpRequest");
      var data = {
        fullname: $("#fullname").val(),
        username: $("#username").val(),
        email:    $("#email").val(),
      };
      console.log(data);
      var url  = uri_base + "/rest/signup.json";
      axios.post(url, data).then(function(response) {
        show_messagebox(response.data.state, response.data.msg );
      });

    },
  },
  template: '<div class="form-signin">'
    + '  <h2 class="form-signin-heading">Please sign up</h2>'
    + '  <label for="fullname" class="sr-only">Your Name</label>'
    + '  <input id="fullname" name=fullname class="form-control" placeholder="Your Name" required autofocus>'
    + '  <label for="username" class="sr-only">Login Name</label>'
    + '  <input id="username" name=username class="form-control" placeholder="Login Name" required autofocus>'
    + '  <label for="email" class="sr-only">E-Mail</label>'
    + '  <input id="email" name=email class="form-control" placeholder="E-Mail Address" required autofocus>'
    + '  <div class="alert alert-default" role=alert>'
    + '    <strong>'
    + '      Please be aware that you will receive an e-mail with an link to reset your password! '
    + '      Setting the password via this link is rquired to activate your account befor logging in.'
    + '    </strong>'
    + '  </div>'
    + '  <button class="btn btn-lg btn-primary btn-block" @click="sendSignUpRequest">Sign up</button>'
    + '</div>'
};
