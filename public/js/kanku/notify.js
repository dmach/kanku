// Preloading images
$.each(['32', '64'], function(index, size) {
  $.each(['', '-danger', '-success', '-warning'], function(index, ext) {
    image = new Image();
    image.src = uri_base + '/images/' + size + '/kanku' + ext + '.png';
  });
});

// Set default_filters at the beginning
const default_filters = {
      'user_change':   {'enable' :true, 'created' :true, 'requested_roles':true},
      'daemon_change': {'enable' :true, 'start'   :true, 'stop'           :true},
      'job_change':    {'enable' :true, 'starting':true, 'finished'       :true,
                        'succeed':true, 'failed'  :true, 'skipped'        :true,
                       },
      'task_change':   {'enable' :true, 'starting':true, 'finished'       :true,
                        'succeed':true, 'failed'  :true, 'skipped'        :true,
                       },
};

function filters_to_cookie(filters) {
      var j_string = JSON.stringify(filters);
      Cookies.set(
	"kanku.filters",
	j_string,
      );
}

function g_update_filters() {
      var filters = get_filters_from_cookie();
      $("form input:checkbox").each(function(idx, elem) {
	var id = $(elem).attr('id');
        var r  = id.split('-', 2);
        if (filters[r[0]] === undefined) { filters[r[0]] = {}; }
        var is_checked = $(elem).is(':checked');
	filters[r[0]][r[1]] = $(elem).is(':checked');
      });
      filters_to_cookie(filters);
      var msg = JSON.stringify({"filters" : filters});
      mySocket.send(msg);
}

function get_filters_from_cookie() {
  var j_string = Cookies.get("kanku.filters");

  var filters;
  if (j_string == undefined) {
    filters = Object.assign({}, default_filters);
  } else {
    filters = jQuery.parseJSON(j_string);
  }

  return filters;
}


Vue.component('notify-test-button', {
  props: ['css_class', 'action', 'text'],
  methods: {
    sendTestNotify: function() {
      mySocket.send('{"bounce":"Kanku Test Notification - '+this.action+'"}');
    }
  },
  computed: {
    computed_css_class: function() { return ['btn', 'active', 'btn-' + this.css_class]},
  },
  template: '<a href="#" :class="computed_css_class" role="button" aria-pressed="true" v-on:click="sendTestNotify">{{ text }}</a>'
});

Vue.component('header-jumbotron', {
  template: ''
    + '<div class="jumbotron text-center">'
    + ' <div>'
    + '  <h2>Test Notifications</h2>'
    + '   <notify-test-button css_class="success" action="succeed" text="Succeed Notify"></notify-test-button>'
    + '   <notify-test-button css_class="warning" action="warning" text="Warning Notify"></notify-test-button>'
    + '   <notify-test-button css_class="danger"  action="failed"  text="Failed Notify"></notify-test-button>'
    + ' </div>'
    + '</div>'
});

Vue.component('header-selector', {
  template: ''
    + '  <div class="row">'
    + '    <div class="col-lg-2">'
    + '       <label for="notification_delay">Show for (seconds)</label>'
    + '    </div>'
    + '    <div class="col-lg-8">'
    + '      <input id="notification_timeout" type="text" value=20>'
    + '    </div>'
    + '    <div class="col-lg-2">'
    + '      <reset-filters-button></reset-filters-button>'
    + '    </div>'
    + '  </div>'
});

Vue.component('filter-checkbox', {
  props: ['value', 'label', 'elem_id'],
  data: function (){
    return { 
      checked: (this.value) ? true : false, 
    };
  },
  methods: {
    updateValues: function(){
      this.$root.$emit('updated-filters', this.checked);
    }
  }, 
  template: ' <div class="col-lg-1">'
    + '  <span class="input-group-addon">'
    + '   <input type=checkbox :value="value" v-model="checked" v-on:click="updateValues" :aria-label="label" :id="elem_id">'
    + '  </span>'
    + ' </div>'
});

Vue.component('header-checkbox', {
  props: ['value', 'elem_id'],
  data: function (){
    return { 
      checked: (this.value) ? true : false, 
    };
  },
  methods: {
    updateValues: function(){
      this.$root.$emit('updated-filters');
    }
  }, 
  template: ' <div class="col-lg-1 text-center">'
    + '   <input type=checkbox :value="value" v-model="checked" v-on:click="updateValues" :id="elem_id">'
    + ' </div>'
});

Vue.component('group-description', {
  props: ['name'],
  template: '<div class="col-lg-5">'
    + '  <span class="form-control"><strong>{{ name }}</strong></span>'
    + ' </div>'
});

Vue.component('filter-header', {
  props:['name', 'value', 'elem_id'],
  template: ''
    + '<div class=card-header>'
    + ' <div class="row">'
    + '  <header-checkbox :value="value" :elem_id="elem_id"></header-checkbox>'
    + '  <div class="col-lg-11 notify-hdr">'
    + '   {{ name }}'
    + '  </div>'
    + ' </div>'
    + '</div>'
});

Vue.component('state-filters-description',{
  props: ['text','classes'],
  template:''
    + '<div class="col-lg-3">'
    + ' <span :class="classes"><strong>{{ text }}</strong></span>'
    + '</div>'
});

Vue.component('admin-filters',{
  props: ['form_data', 'prefix'],
  data: function(){
    return { fd: this.form_data };
  },
  template:   '<div class="card event-card">'
    + ' <filter-header name="User Events" v-bind:value="fd.enable" :elem_id="prefix+\'-enable\'"></filter-header>'
    + ' <div class="card-body">'
    + '     <h6>Event Types:</h6>'
    + '     <div class="row event-row">'
    + '      <filter-checkbox :value="fd.created" label="FIXME"        :elem_id="prefix+\'-created\'"></filter-checkbox>'
    + '      <group-description name="User Created"></group-description>'
    + '      <filter-checkbox :value="fd.requested_roles" label="FIXME" :elem_id="prefix+\'-requested_roles\'"></filter-checkbox>'
    + '      <group-description name="User requested a role"></group-description>'
    + '     </div>'
    + '   </div>'
    + ' </div>'
    + '</div>'
});

Vue.component('daemon-filters',{
  props: ['form_data', 'prefix'],
  template:   '<div class="card event-card">'
    + ' <filter-header name="Daemon Events" v-bind:value="form_data.enable" :elem_id="prefix+\'-enable\'"></filter-header>'
    + ' <div class="card-body">'
    + '     <h6>Event Types:</h6>'
    + '     <div class="row event-row">'
    + '      <filter-checkbox :value="form_data.start" label="FIXME" :elem_id="prefix+\'-start\'"></filter-checkbox>'
    + '      <group-description name="Daemon start"></group-description>'
    + '      <filter-checkbox :value="form_data.stop" label="FIXME" :elem_id="prefix+\'-stop\'"></filter-checkbox>'
    + '      <group-description name="Daemon Stop"></group-description>'
    + '     </div>'
    + '   </div>'
    + ' </div>'
    + '</div>'
});

Vue.component('job-filters',{
  props: ['form_data', 'prefix'],
  template: ''
    + '<div class="card event-card">'
    + ' <filter-header name="Job Events" :value="form_data.enable"    :elem_id="prefix+\'-enable\'"></filter-header>'
    + ' <div class="card-body">'
    + '  <h6>Event Types: </h6>'
    + '  <div class="row event-row">'
    + '   <filter-checkbox :value="form_data.starting" label="FIXME"   :elem_id="prefix+\'-starting\'"></filter-checkbox>'
    + '   <group-description name="Job started"></group-description>'
    + '   <filter-checkbox :value="form_data.finished" label="FIXME"  :elem_id="prefix+\'-finished\'"></filter-checkbox>'
    + '   <group-description name="Job finished"></group-description>'
    + '  </div>'
    + '  <h6>Result states</h6>'
    + '  <div class="row state-row">'
    + '   <filter-checkbox :value="form_data.succeed" label="Job finished - succeed" :elem_id="prefix+\'-succeed\'"></filter-checkbox>'
    + '   <state-filters-description text="Succeed" classes="form-control alert-success"></state-filters-description>'
    + '   <filter-checkbox :value="form_data.failed"  label="Job finished - failed"  :elem_id="prefix+\'-failed\'"></filter-checkbox>'
    + '   <state-filters-description text="Failed" classes="form-control alert-danger"></state-filters-description>'
    + '   <filter-checkbox :value="form_data.skipped" label="Job finished - skipped" :elem_id="prefix+\'-skipped\'"></filter-checkbox>'
    + '   <state-filters-description text="Failed" classes="form-control alert-warning"></state-filters-description>'
    + '  </div>'
    + ' </div>'
    + '</div>'
});

Vue.component('task-filters',{
  props: ['form_data', 'prefix'],
  template: ''
    + '<div class="card event-card">'
    + ' <filter-header name="Task Events" :value="form_data.enable" :elem_id="prefix+\'-enable\'"></filter-header>'
    + ' <div class="card-body">'
    + '  <h6>Event Types: </h6>'
    + '  <div class="row event-row">'
    + '   <filter-checkbox    :value="form_data.starting"  label="FIXME" :elem_id="prefix+\'-starting\'"></filter-checkbox>'
    + '   <group-description name="Task started"></group-description>'
    + '   <filter-checkbox    :value="form_data.finished" label="FIXME" :elem_id="prefix+\'-finished\'"></filter-checkbox>'
    + '   <group-description name="Task finished"></group-description>'
    + '  </div>'
    + '  <h6>Result states</h6>'
    + '  <div class="row state-row">'
    + '   <filter-checkbox label="Task finished - succeed" :value="form_data.succeed" :elem_id="prefix+\'-succeed\'"></filter-checkbox>'
    + '   <state-filters-description text="Succeed" classes="form-control alert-success"></state-filters-description>'
    + '   <filter-checkbox label="Task finished - failed"  :value="form_data.failed"  :elem_id="prefix+\'-failed\'"></filter-checkbox>'
    + '   <state-filters-description text="Failed" classes="form-control alert-danger"></state-filters-description>'
    + '   <filter-checkbox label="Task finished - skipped" :value="form_data.skipped" :elem_id="prefix+\'-skipped\'"></filter-checkbox>'
    + '   <state-filters-description text="Skipped" classes="form-control alert-warning"></state-filters-description>'
    + '  </div>'
    + ' </div>'
    + '</div>'
});

Vue.component('reset-filters-button',{
  methods: {
    resetFilters: function() {
      this.$root.$emit('reset-filters');
    }
  },
  template: '<a href="#" class="btn btn-primary active" role="button" aria-pressed="true" v-on:click="resetFilters">Reset</a>'
});

var vm = new Vue({
  el: '#vue_app',
  data: {
    has_role_admin:       active_roles['Admin'],
    has_role_user:        active_roles['User'],
    has_role_guest:       active_roles['Guest'],
    form_data:            get_filters_from_cookie(),
  },
  created() {
    this.$root.$on('updated-filters', result => {
       this.updateFilters();
    });
    this.$root.$on('reset-filters', result => {
       this.resetFilters();
    });
  },
  methods: {
    updatePage: function() {
      console.log("updatePage started");
    },
    updateFilters: function () {
      g_update_filters();
    },
    resetFilters: function () {
      self = this;
      // copy object
      self.form_data = Object.assign({}, default_filters);
      filters_to_cookie(this.form_data);
      $("form input:checkbox").each(function(idx, elem) {
	var id = $(elem).attr('id');
        var r  = id.split('-', 2);
	$(elem).prop('checked', self.form_data[r[0]][r[1]]);
      });
    }
  },
  mounted: function() {
      this.updatePage();
  }
});

var mySocket = new WebSocket(ws_url);
var token = Cookies.get("kanku_notify_session");

mySocket.onerror = function (error) {
  console.log('WebSocket Error ' + error);
  show_messagebox('danger', 'WebSocket Error ' + error, 0);
};

mySocket.onmessage = function (evt) {
  data = JSON.parse(evt.data);
  var ico_ext = {
    'succeed' : 'success',
    'warning' : 'warning',
    'failed'  : 'danger',
  };
  var ico = uri_base + '/images/64/kanku-' + ( ico_ext[data.result] || 'success' ) + '.png';
  var notify_timeout = $('#notification_timeout').val() * 1000;
  Notification.requestPermission(function() {
    var n = new Notification(data.title, {
	body: data.body,
	icon: ico
    });
    n.onclick = function() {
        window.open(data.link, 'newwindow', "menubar=no");
        n.close();
    };
    if ( notify_timeout > 0 ) {
      setTimeout(n.close.bind(n), notify_timeout);
    }
  });
};

mySocket.onopen = function(evt) {
  var ico = uri_base + '/images/32/kanku-success.png';
  var notify_timeout = $('#notification_timeout').val();
  console.log("mySocket.onopen");
  Notification.requestPermission(function() {
    $("#favicon").attr("href",ico);
    setTimeout(
      function() {
	var msg = '{"token":"'+ token +'"}';
	mySocket.send(msg);
      },
      notify_timeout
    );
    setTimeout(
      function() {
	mySocket.send('{"bounce":"Opening WebSocket succeed!"}');
        g_update_filters();
      },
      notify_timeout
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
    show_messagebox('danger', m, 0);
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
}
