Vue.component('role-checkbox', {
  props: ['name', 'checked', 'value'],
  template: '<div class="form-group row">'
            + '<label class="col-sm-2 control-label">'
            + '{{ name }} '
            + '</label>'
            + '<div class="col-sm-10">'
            + '<input class="role_checkbox" type="checkbox" :value="value" v-model="checked">'
            + '</div>'
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
        updateMessageBar(self, response.data.msg, response.data.state);
      }).catch(function(error) {
        console.log(error);
        updateMessageBar(self, error.response.data, "alert-danger");
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
  props: ['user_details'],
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
        updateMessageBar(self, response.data.msg, response.data.state);
      });
    },
  },
  template: ''
    + '<form>'
    + ' <hr/>'
    + ' <a href=# v-on:click="sendRoleRequest" class="btn btn-primary btn-sm active float-right" role="button" aria-pressed="true">Send</a>'
    + ' <h3>Request Roles</h3>'
    + ' <role-checkbox'
    + '    v-for="role in user_details.roles"'
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

var app = new Vue({
  el: '#vue_app',
  data: {
    user_details: {},
    message_bar: {
      text:        'No message',
      show:        false,
      alert_class: 'alert-danger'
    },
    alert_class: '',
  },
  mounted: function() {
      var url  = uri_base + "/rest/user/"+ user_name +".json";
      var self = this;
      axios.get(url).then(function(response) {
	self.user_details = response.data;
      });
  },
  template: '<div>'
    + ' <message-box :message_bar="message_bar"></message-box>'
    + ' <head-line text="Settings"></head-line>'
    + ' <user-settings :user_details="user_details"></user-settings>'
    + ' <request-roles :user_details="user_details"></request-roles>'
    + '</div>'
});
