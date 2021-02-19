Vue.component('iface-line', {
  props: ['data'],
  template: ''
    + '<div>'
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
  template: ''
    + '<div>'
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
  template: ''
    + '<div>'
    + ' <port-card v-for="(data,port) in ports" v-bind:key="port" v-bind:data="data" v-bind:port="port" v-bind:ipaddr="ipaddr"></port-card>'
    + '</div>'
});

Vue.component('guest-card', {
  props: ['guest', 'data', 'is_admin', 'show_details'],
  data: function() {
    var alert_class = ( this.data.state == 1 ) ? "success" : "warning";
    return {
      user : {'roles': active_roles},
      header_classes : ['card-header', 'alert', 'alert-' + alert_class],
      badge_classes: ['badge', 'badge-' + alert_class],
      href_vm : uri_base + "#/guest/" + this.$vnode.key,
      showDetails: this.show_details,
    }
  },
  methods: {
    toggleDetails: function() {
      this.showDetails = !this.showDetails;
    },
    triggerRemoveDomain: function() {
      var url  = uri_base + "/rest/job/trigger/remove-domain.json";
      var data = {
        data     : [ {domain_name : this.data.domain_name}],
        is_admin : this.is_admin,
      };
      axios.post(url, data).then(function(xhr) {
          show_messagebox(xhr.data.state, xhr.data.msg );
      }).catch(function(error) {
          show_messagebox("danger", error);
      });
    }
  },
  computed: {
    allowDelete: function() {
      if ( this.is_admin ) {
        return true;
      }
      var split = this.data.domain_name.split("-",1);
      if (active_roles.User && split[0] == user_name) {
        return true;
      }
      return false;
    }
  },
  template: ''
    + '<div class="card guest-card">'
    + ' <div :class="header_classes">'
    + '  <div class="row">'
    + '   <div class="col-md-10">'
    + '     <show-details @toggleDetails="toggleDetails()"></show-details>'
    + '     <span :class="badge_classes">{{ data.domain_name }} ({{ data.host  }})</span>'
    + '   </div>'
    + '   <div class="col-md-2">'
    + '    <a class="float-right" :href="href_vm"><i class="fas fa-link" data-bs-toggle="tooltip" data-bs-placement="top" title="Link"/></a>'
    + '    <a v-show="allowDelete" class="float-right" href="#" @click="triggerRemoveDomain()"><i class="far fa-trash-alt"data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"/></a>'
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

Vue.component('search-tooltip-guest',{
  template: ''
    + '       <div class="badge badge-primary" style="padding:0.6em" data-bs-toggle="tooltip" data-bs-placement="bottom" '
    + '         title="<strong>Search by domain or host:</strong><br>use &apos;.*&apos; wildcard<br>'
    + '                <strong>Supported fields:</strong><br>domain, host, worker (alias for host)<br>'
    + '                <strong>Supported Values:</strong><br>perl regex<br>'
    + '                <strong>Examples:</strong><br>&apos;doamin:obs-server&apos;, &apos;host:kanku-worker1&apos;, &apos;worker=.*1&apos;">'
    + '         <i class="fas fa-question-circle fa-2x" ></i>'
    + '       </div>'
});


const guestPage = {
  props: ['is_admin', 'domain_name'],
  data: function(){
    return {
      guest_list: {},
      show_details: false,
      filter: this.$route.query.filter,
    };
  },
  methods: {
    refreshPage: function() {
      $('#spinner').show();
      var self   = this;
      var url = uri_base + '/rest/guest/list.json';
      var params = { filter: this.filter};
      axios.get(url, { params: params }).then(function(response) {
        self.guest_list = response.data.guest_list;
        $('#spinner').hide();
	if (response.data.errors) {
	  response.data.errors.forEach(function(error) {
            show_messagebox("danger", error);
          });
	}
        $(function () {
          $('[data-bs-toggle="tooltip"]').tooltip({html:true, trigger:'hover'});
        });
      });
    },
    sortedGuests: function() {
      var domain_name = this.$route.params.domain_name;
      var obj;
      if (domain_name && this.guest_list[domain_name]) {
        this.show_details = true;
        return [domain_name];
      }
      return Object.keys(this.guest_list).sort();
    }
  },
  mounted: function() {
    this.refreshPage();
  },
  template: ''
    + '<div>'
    + ' <head-line text="Guest"></head-line>'
    + '  <div class="row top_pager">'
    + '    <search-field @search-term-change="refreshPage" :filter="filter" comment="Enter search term - SEE Tooltips for details"></search-field>'
    + '    <div class="col-md-8">'
    + '    <search-tooltip-guest></search-tooltip-guest>'
    + '      <refresh-button @refreshPage="refreshPage"></refresh-button>'
    + '    </div>'
    + '  </div>'
    + '  <spinner></spinner>'
    + '  <div v-if="Object.keys(guest_list) < 1">No guests found!</div>'
    + '  <guest-card v-for="guest in sortedGuests()" :show_details="show_details" :key="guest" :data="guest_list[guest]" :is_admin="is_admin"></guest-card>'
    + '</div>'
};
