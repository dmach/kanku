function getUsersList(){
  var users = [];
  var url = uri_base + "/rest/admin/user/list.json";
  axios.get(url).then(function (response) {
    var data = response.data;
    $.each(data, function(idx, elem) {
      users.push(elem);
    });
  });
  return users;
}

function getRequestsList() {
  var req = [];
  var url = uri_base + "/rest/admin/task/list.json";
  axios.get(url).then(function (response) {
    var data = response.data;
    $.each(data, function(idx, elem) {
      req.push(elem);
    });
  });
  return req;
}

function getRolesList() {
  var roles = [];
  var url = uri_base + "/rest/admin/role/list.json";
  axios.get(url).then(function (response) {
    var data = response.data;
    $.each(data, function(idx, elem) {
      roles.push(elem);
    });
  });
  return roles;
}

Vue.component('request-element', {
  props: ['request'],
  data: function() {
   return {
    roles:     [],
    action:    "",
    css_class: "",
    admin_comment:   "",
   };
  },
  computed:{
   computed_css_class: function() { return ['badge', 'badge-' + this.css_class]},
  },
  methods: {
    sendRoleRequest: function (req_id, decision,) {
      var url  = uri_base + "/rest/admin/task/resolve.json";
      var self = this;
      axios.post(
        url,
        {"req_id":req_id, "decision":decision,"comment":this.admin_comment}
      ).then(function () {
        self.$emit('update-requests');
      });
    }
  },
  template: ''
    + '<div class="request-div" :id="request.id">'
    + '  <div class="role_request_header">'
    + '    <div class="row">'
    + '      <div class="col-lg-2">'
    + '        Request: <span class="badge badge-secondary">{{ request.req_id }}</span>'
    + '      </div>'
    + '      <div class="col-lg-10">'
    + '        <strong>{{ request.user_name }} ({{ request.user_login }})</strong>'
    + '      </div>'
    + '    </div>'
    + '  </div>'
    + '  <div class=row v-for="role in request.roles">'
    + '        <div class="col-lg-1">'
    + '          <input type=checkbox :checked="role.checked" disabled>'
    + '        </div>'
    + '        <div class="col-lg-1">'
    + '          <label for="comment">{{ role.role }}</label>'
    + '        </div>'
    + '        <div class="col-lg-10">'
    + '          <span :class="[\'badge\', \'badge-\'+role.class]">{{ role.action }}</span>'
    + '        </div>'
    + '  </div>'
    + '  <div class="form-group row">'
    + '     <label class="col-lg-2 col-form-label">User Comment:</label>'
    + '     <div class="col-lg-10">'
    + '       <textarea class="form-control" rows="2" disabled>{{ request.comment }}</textarea>'
    + '     </div>'
    + '  </div>'
    + '  <div class="form-group row">'
    + '    <label class="col-lg-2 col-form-label">Your Comment:</label>'
    + '    <div class="col-lg-10">'
    + '      <textarea class="form-control" rows="2" v-model="admin_comment"></textarea>'
    + '    </div>'
    + '  </div>'
    + '  <div class=row>'
    + '    <div class="col-lg-12">'
    + '        <button type="button" class="btn btn-success button-submit-request-decision" v-on:click="sendRoleRequest(request.req_id, 1)">Accept</button>'
    + '        <button type="button" class="btn btn-danger  button-submit-request-decision" v-on:click="sendRoleRequest(request.req_id, 2)">Decline</button>'
    + '    </div>'
    + '  </div>'
    + '</div>'

});

Vue.component('request-list', {
  data: function() {
    return { req: getRequestsList()};
  },
  methods: {
    updateList: function() {
      this.req = getRequestsList();
    }
  },
  template: '<div>'
  + ' <h2>Requests</h2>'
  + ' <div v-if="req.length > 0">'
  + '  <request-element @update-requests="updateList" v-for="r in req" v-bind:key="r.req_id" :request="r"></request-element>'
  + ' </div>'
  + ' <span v-else>No open requests at the moment!</span>'
  + '</div>'
});


Vue.component('user-element', {
   props: ['user'],
   methods: {
    deleteUser: function(id) {
       var url = uri_base + "/rest/admin/user/" + id + ".json";
       var self = this;
       axios.delete(url).then(function() {
         self.$emit("update-users");
       });
     },
     activateUser: function(id) {
       var url = uri_base + "/rest/admin/user/activate/" + id + ".json";
       var self = this;
       axios.post(url).then(function() {
         self.$emit("update-users");
       });
     },
     deactivateUser: function(id) {
       var url = uri_base + "/rest/admin/user/deactivate/" + id + ".json";
       var self = this;
       axios.post(url).then(function() {
         self.$emit("update-users");
       });
     },
   },
   template: '<tr>'
    + ' <td>{{ user.id }}</td>'
    + ' <td>{{ user.username }}</td>'
    + ' <td>{{ user.name }}</td>'
    + ' <td>{{ user.email }}</td>'
    + ' <td>{{ user.deleted }}</td>'
    + ' <td>{{ user.roles.join(", ") }}</td>'
    + ' <td>'
    + '  <button v-if="user.deleted"  type="button" class="btn btn-warning button-submit-request-decision" aria-label="Deactivate" title="Deactivate" v-on:click="deactivateUser(user.id)">'
    + '   <i class="fa fa-times"></i>'
    + '  </button>'
    + '  <button v-else               type="button" class="btn btn-success button-submit-request-decision" aria-label="Activate"   title="Activate" v-on:click="activateUser(user.id)">'
    + '   <i class="fa fa-plus"></i>'
    + '  </button>'
    + '  <button                      type="button" class="btn btn-danger button-submit-request-decision"  aria-label="Delete"     title="Delete" v-on:click="deleteUser(user.id)">'
    + '   <i class="far fa-trash-alt"></i>'
    + '  </button>'
    + ' </td>'
    + '</tr>'
});

Vue.component('user-list', {
  data: function() {
    return {users : getUsersList()};
  },
  methods: {
    updateList: function() {
      this.users = getUsersList();
    }
  },
  template: '<div>'
    + '<h2>Users</h2>'
    + '<table class="table table-striped">'
    + '  <thead>'
    + '    <tr>'
    + '      <th scope="col">#</th>'
    + '      <th scope="col">Username</th>'
    + '      <th scope="col">Realname</th>'
    + '      <th scope="col">E-Mail</th>'
    + '      <th scope="col">active</th>'
    + '      <th scope="col">Roles</th>'
    + '      <th scope="col">Actions</th>'
    + '    </tr>'
    + '  </thead>'
    + '  <tbody>'
    + '   <user-element @update-users="updateList" v-for="user in users" v-bind:user="user" v-bind:key="user.id"></user-element>'
    + '  </tbody>'
    + '</table>'
    + '</div>'
});

Vue.component('role-element', {
   props: ['role'],
   template: '<tr>'
    + ' <td>{{ role.id }}</td>'
    + ' <td>{{ role.role }}</td>'
    + '</tr>'
});

Vue.component('role-list', {
  data: function() {
    return { roles: getRolesList()};
  },
  template: '<div>'
    + '<h2>Roles</h2>'
    + '<table class="table table-striped">'
    + '  <thead>'
    + '    <tr>'
    + '      <th scope="col">#</th>'
    + '      <th scope="col">Role Name</th>'
    + '    </tr>'
    + '  </thead>'
    + '  <tbody>'
    + '   <role-element v-for="role in roles" :role="role" v-bind:key="role.id"></role-element>'
    + '  </tbody>'
    + '</table>'
    + '</div>'
});

var app = new Vue({
  el: '#vue_app',
  template: '<div>'
    + ' <head-line text="Administration"></head-line>'
    + ' <hr/>'
    + ' <request-list></request-list>'
    + ' <hr/>'
    + ' <user-list></user-list>'
    + ' <hr/>'
    + ' <role-list></role-list>'
    + ' <hr/>'
    + '</div>'
});
