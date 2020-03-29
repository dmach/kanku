Vue.component('iface-line', {
  props: ['data'],
  template: '<div>'
    + ' <div class="badge badge-primary">{{ data.name }}</div>'
    + ' <div class="badge badge-primary">{{ data.hwaddr }}</div>'
    + ' <div class="badge badge-primary"><!-- placeholder for next line --></div>'
    + '</div>'

});

Vue.component('port-card',{
  props: ['port', 'data', 'ipaddr'],
  computed: {
    href: function() {
        if (this.data[1] == 'https' || this.data[1] == 'http') {
          return this.data[1]+"://"+this.ipaddr+":"+this.port;
        }
    }
  },
  template: '<div>'
    + '  <div v-if="data[1] === \'ssh\'">'
    + '   <pre>ssh -l root -p {{ port }} -oStrictHostKeyChecking=no -oUserKnownHostsFile=/dev/null {{ ipaddr }}</pre>'
    + '  </div>'
    + '  <div v-else-if="href">'
    + '   <a :href="href">Link to Website ({{ ipaddr }}:{{ port }})</a>'
    + '  </div>'
    + '  <div v-else><pre>Found unknown port forward ({{ ipaddr }}) {{ port }} to {{ data[0] }} on guest</pre></div>'
    + '</div>'
});

Vue.component('ipaddr-card', {
  props: ['ipaddr', 'ports'],
  template: '<div><port-card v-for="(data,port) in ports" v-bind:key="port" v-bind:data="data" v-bind:port="port" v-bind:ipaddr="ipaddr"></port-card></div>'
});

Vue.component('guest-card', {
  props: ['guest', 'data'],
  data: function() {
    var alert_class = ( this.data.state == 1 ) ? "success" : "warning";
    return {
      showDetails: 0,
      user : {'roles': active_roles},
      header_classes : ['card-header', 'alert', 'alert-' + alert_class],
      badge_classes: ['badge', 'badge-' + alert_class],
      href_vm : uri_base + "/guest#" + this.data.domain_name
    }
  },
  methods: {
    toggleDetails: function() {
      this.showDetails = !this.showDetails;
    },
    triggerRemoveDomain: function() {
      var url  = uri_base + "/rest/job/trigger/remove-domain.json";
      var data = [ {domain_name : this.data.domain_name}];
      axios.post(url, data).then(function(xhr) {
          show_messagebox(xhr.data.state, xhr.data.msg );
      });
    }
  },
  template: '<div class="card guest-card">'
    + ' <div :class="header_classes" v-on:click="toggleDetails()">'
    + '  <div class="row">'
    + '   <div class="col-md-10">'
    + '    <span :class="badge_classes">{{ data.domain_name }} ({{ data.host  }})</span>'
    + '   </div>'
    + '   <div class="col-md-2">'
    + '    <a class="float-right" :href="href_vm"><i class="fas fa-link"/></a>'
    + '    <a v-if="user.roles.Admin" class="float-right" href="#" v-on:click="triggerRemoveDomain()"><i class="far fa-trash-alt"/></a>'
    + '   </div>'
    + '  </div>'
    + ' </div>'
    + ' <div class="card-body" style="padding:5px;" v-show="showDetails">'
    + '  <iface-line v-for="nic in data.nics" v-bind:data="nic" v-bind:key="nic.hwaddr"></iface-line>'
    + '  <ipaddr-card v-for="(ports, ipaddr) in data.forwarded_ports" v-bind:ports="ports" v-bind:ipaddr="ipaddr" v-bind:key="ipaddr"></ipaddr-card>'
    + '  </div>'
    + ' </div>'
    + '</div>'
});

var vm = new Vue({
  el: '#vue_app',
  data: {
    guest_list: {},
  },
  methods: {
    updatePage: function() {
      $('#spinner').show();
      var self   = this;
      var url = uri_base + '/rest/guest/list.json';
      var params = new URLSearchParams();
      axios.get(url, { params: params }).then(function(response) {
        self.guest_list = response.data.guest_list;
        $('#spinner').hide();
      });
    },
    sortedGuests: function() {
      return Object.keys(this.guest_list).sort();
    }
  },
  mounted: function() {
      this.updatePage();
  }
});
