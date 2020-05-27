const routes = [
  { path: '*'                    , component: pageNotFound   },
  { path: '/'                    , component: indexPage      },
  { path: '/job'                 , component: jobPage        },
  { path: '/admin'               , component: adminPage      },
  { path: '/guest/:domain_name?' , component: guestPage      },
  { path: '/worker'              , component: workerPage     },
  { path: '/notify'              , component: notifyPage     },
  { path: '/settings'            , component: settingsPage   },
  { path: '/job_history/:page'   , component: jobHistoryPage },
  { path: '/job_result/:job_id'  , component: jobResultPage  },
  { path: '/pwreset'             , component: pwResetPage    },
  { path: '/signup'              , component: signUpPage     },
  { path: '/login'               , component: pwSetPage     },
];

const router = new VueRouter({
  routes // short for `routes: routes`
});

var app = new Vue({
  props: ['sock'],
  router,
  el: '#vue_app',
  data: {
    logged_in_user: logged_in_user,
    request_path:   request_path,
    uri_base:       uri_base,
    is_admin:       0,
  },
  computed: {
    user_label: function() { return (this.logged_in_user && this.logged_in_user.name) ? this.logged_in_user.name : 'Sign In' },
    roles: function() { 
      var r = [];
      var liu = this.logged_in_user;
      if (liu == undefined) {
        return r;
      }
      if (liu.role_id == undefined) {
        return r;
      }
      $.each(Object.keys(liu.role_id), function(idx, key){
        if (liu.role_id[key]){ r.push(key); }
      });
      return r;
    },
    active_roles: function() {
      var r = {};
      var liu = this.logged_in_user;
      if (liu == undefined) {
        return r;
      }
      if (liu.role_id == undefined) {
        return r;
      }
      $.each(Object.keys(liu.role_id), function(idx, key){
        r[key] = liu.role_id[key];
      });
      return r;
    },
    user_id: function() {
      if (this.logged_in_user) { return this.logged_in_user.id };
      return 0;
    },
  },
  methods: {
    refreshUserInfo: function() {
      var url = uri_base + "/rest/userinfo.json";
      var self = this;
      axios.get(url).then(function(response) {
        self.logged_in_user = response.data.logged_in_user;
        if (self.logged_in_user.id) {
          self.sock = startWSConnection(self.logged_in_user.id);
        }
      });;
    },
    toogleIsAdmin: function() {
       this.is_admin = !this.is_admin;
    },
  },
  template: '<div>'
    + ' <navigation :user_id="user_id" :user_label="user_label" :roles="roles" :active_roles="active_roles" :request_path="request_path" :is_admin="is_admin" @user-state-changed="refreshUserInfo" @changed-is-admin="toogleIsAdmin"></navigation>'
    + ' <message-box-placeholder></message-box-placeholder>'
    + ' <div id="content" class="container">'
    + ' <router-view :user_id="user_id" :is_admin="is_admin" @user-state-changed="refreshUserInfo"></router-view>'
    + ' <!-- content goes here -->'
    + ' </div>'
    + '</div>'
});
