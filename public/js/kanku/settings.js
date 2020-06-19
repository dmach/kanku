Vue.component('role-checkbox', {
  props: ['name', 'checked', 'value'],
  template: ''
    + '<div class="form-group row">'
    + ' <label class="col-sm-2 control-label">'
    + '  {{ name }} '
    + '  </label>'
    + ' <div class="col-sm-10">'
    + '  <input class="role_checkbox" type="checkbox" :value="value" v-model="checked">'
    + ' </div>'
    + '</div>'
});

Vue.component('user-settings', {
  props: ['user_details'],
  methods: {
    updateUserData: function() {
      var self    = this;
      var ud      = this.user_details;
      var url     = uri_base + "/rest/user/" + ud.id + ".json";
      var request = ud;
      axios.put(
        url,
        request,
      ).then(function(response) {
        show_messagebox('success', response.data.msg);
        self.$emit("user-state-changed");
      }).catch(function(error) {
        console.log(error);
        show_messagebox('danger', error);
      });
    },
  },
  template: ''
    + '<form>'
    + '  <hr/>'
    + '  <a href=# v-on:click="updateUserData" class="btn btn-primary btn-sm active float-right" role="button" aria-pressed="true">Save</a>'
    + '  <h3>User Data:</h3>'
    + '  <div class="form-group row">'
    + '    <!-- USERNAME  -->'
    + '    <label class="col-sm-2 col-form-label">Username:</label>'
    + '    <div class="col-sm-6">'
    + '      <span class="form-control" id=user_name>'
    + '        {{ user_details.username }}'
    + '      </span>'
    + '    </div>'
    + '    <!-- USER ID -->'
    + '    <label class="col-sm-1 col-form-label">ID:</label>'
    + '    <div class="col-sm-2">'
    + '      <span class="form-control" id="user_id">'
    + '        {{ user_details.id }}'
    + '      </span>'
    + '    </div>'
    + '  </div>'
    + '  <div class="form-group row">'
    + '    <label class="col-sm-2 col-form-label" for="full_name">Name:</label>'
    + '    <div class="col-sm-10">'
    + '      <input class="form-control" type=text v-model="user_details.name" id="full_name">'
    + '    </div>'
    + '  </div>'
    + '  <div class="form-group row">'
    + '    <label class="col-sm-2 col-form-label" for="full_name">Email:</label>'
    + '    <div class="col-sm-10">'
    + '      <input class="form-control" type=text v-model="user_details.email">'
    + '    </div>'
    + '  </div>'
    + '</form>'

});

Vue.component('request-roles', {
  props: ['user_details', 'roles'],
  methods: {
    sendRoleRequest() {
      var roles   = new Array();
      var comment = $('textarea#comment').val();
      $('.role_checkbox').each(function(idx, elem) {
       if ($(elem).is(':checked')) { roles.push($(elem).attr('value')); }
      });
      var request = { 'roles' : roles, 'comment' : comment }
      var url     = uri_base + "/rest/request_roles.json";
      var self    = this;

      axios.post(url, request).then(function(response) {
         show_messagebox(response.data.state, response.data.msg);
      }).catch(function(error) {
         console.log("Error while sending role request to url: "+ url)
         console.log(error);
      });
    },
  },
  template: ''
    + '<form>'
    + ' <hr/>'
    + ' <a href=# v-on:click="sendRoleRequest" class="btn btn-primary btn-sm active float-right" role="button" aria-pressed="true">Send</a>'
    + ' <h3>Request Roles</h3>'
    + ' <role-checkbox'
    + '    v-for="role in roles"'
    + '    v-bind:value="role.id"'
    + '    v-bind:key="role.id"'
    + '    v-bind:name="role.role"'
    + '    v-bind:checked="role.checked"'
    + ' ></role-checkbox>'
    + ' <div class="form-group row">'
    + '  <label class="col-sm-2 control-label" for="comment">Comment:</label>'
    + '  <div class="col-sm-10">'
    + '   <textarea class="form-control" rows="5" id="comment"></textarea>'
    + '  </div>'
    + ' </div>'
    + '</form>'
});

const settingsPage = {
  props: ['user_id'],
  data: function() {
    return {
      user_details: {},
      message_bar: {
        text:        'No message',
        show:        false,
        alert_class: 'alert-danger'
      },
      is_user: false,
      alert_class: '',
      roles: [],
    };
  },
  methods: {
    getUserDetails: function() {
      var url  = uri_base + "/rest/userinfo.json";
      var self = this;
      axios.get(url).then(function(response) {
	info = response.data.logged_in_user;
	if (info.username) {
	  self.is_user = true;
	  url = uri_base + "/rest/user/"+info.username+".json";
	  axios.get(url).then(function(response) {
            self.roles = response.data.roles; 
            self.user_details = response.data; 
	  });
	}
      });
    },
  },
  mounted: function() {
   this.getUserDetails();
  },
  template: ''
    + '<div>'
    + ' <message-box :message_bar="message_bar"></message-box>'
    + ' <head-line text="Settings"></head-line>'
    + ' <div v-if="user_id">'
    + '  <user-settings :user_details="user_details" @user-state-changed="$emit(\'user-state-changed\')"></user-settings>'
    + '  <request-roles :user_details="user_details" :roles="roles"></request-roles>'
    + ' </div>'
    + ' <div v-else>'
    + '  <h1>Please Login</h1>'
    + ' </div>'
    + '</div>'
};
