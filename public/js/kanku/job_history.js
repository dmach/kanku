Vue.component('page-counter',{
  props: ['page'],
  template: '<div class="col-md-2">Page: <span class="badge badge-secondary">{{ page }}</span></div>'
});

Vue.component('prev-button',{
  methods: {
    prevpage: function() {
      if (this.$parent.page <= 1) {return}
      this.$parent.page--;
      this.$root.updatePage();
    }
  },
  template: '<div class="col-md-1"><button v-on:click="prevpage()" class="btn btn-default">&lt;&lt;&lt;</button></div>'
});

Vue.component('next-button',{
  methods: {
    nextpage: function() {
      this.$parent.page++;
      this.$root.updatePage();
    }
  },
  template: '<div class="col-md-1"><button v-on:click="nextpage()" class="btn btn-default">&gt;&gt;&gt;</button></div>'
});

Vue.component('limit-select',{
  data: function() {
    return {limit:10}
  },
  methods: {
    setNewLimit: function() {
      this.$parent.limit = this.limit;
      this.$root.updatePage();
    }
  },
  template: ''
    + '<div v-on:change="setNewLimit()" class="col-md-2">'
    + '  Show rows:'
    + '  <select v-model="limit">'
    + '    <option v-for="option in [5,10,20,50,100]" v-bind:value="option">{{ option }}</option>'
    + '  </select>'
    + '</div>'
});

Vue.component('job-search',{
  data: function() {
    return {job_name:''}
  },
  methods: {
    updateJobSearch: function() {
      this.$parent.job_name = this.job_name;
      this.$root.updatePage();
    },
    clearJobSearch: function() {
      this.job_name = '';
      this.$parent.job_name = this.job_name;
      this.$root.updatePage();
    }
  },
  template: ''
    + '    <div class="btn-group col-md-4">'
    + '       <input type="text" v-model="job_name" v-on:blur="updateJobSearch" v-on:keyup.enter="updateJobSearch" class="form-control" placeholder="Enter job name - Use \'%\' as wildcard">'
    + '      <span v-on:click="clearJobSearch()" style="margin-left:-20px;margin-top:10px;">'
    + '          <i class="far fa-times-circle"></i>'
    + '       </span>'
    + '    </div>'

});

Vue.component('job-state-checkbox',{
  props: ['name','state_class'],
  data: function() {
    return {job_states:['succeed','failed','dispatching','running']}
  },
  methods: {
    updateJobSearch: function() {
      this.$root.$emit('toggle_state', this.name);
      this.$root.updatePage();
    },
  },
  template: ''
    + '    <div class="col col-md-3">'
    + '      <h5>'
    + '        <input type="checkbox" name="state" v-model="job_states" v-bind:value="name" class="cb_state" v-on:change="updateJobSearch" >'
    + '        <span v-bind:class="state_class">{{ name }}</span>'
    + '      </h5>'
    + '    </div>'
});

Vue.component('show-only-latest-results',{
  props: ['show_only_latest_results'],
  methods: {
    updateJobSearch: function() {
      this.$root.$emit('toggle_show_only_latest_results');
      this.$root.updatePage();
    },
  },
  template: ''
    + '    <div class="col col-md-4">'
    + '        Show only latest results'
    + '        <input type="checkbox" name="show_only_latest_results" v-on:change="updateJobSearch" style="margin:7px" >'
    + '    </div>'
});

var vm = new Vue({
  el: '#vue_app',
  data: {
    jobs: {},
    page: 1,
    limit: 10,
    job_name: '',
    job_states: {'succeed':1, 'failed':1,'dispatching':1,'running':1,'scheduled':0,'triggered':0,'skipped':0},
    show_only_latest_results : false,
  },
  created() {
    this.$root.$on('toggle_state', state => {
       this.job_states[state] = ! this.job_states[state];
    });
    this.$root.$on('toggle_show_only_latest_results', value => {
       this.show_only_latest_results = !this.show_only_latest_results
    });
  },
  methods: {
    updatePage: function() {
      var url    = uri_base + "/rest/jobs/list.json";
      var self   = this;
      var params = {};
      var params = new URLSearchParams();
      params.append("page",  self.page);
      params.append("limit", self.limit);

      if (this.show_only_latest_results) { params.append("show_only_latest_results",  1); }

      if (self.job_name) { params.append('job_name', self.job_name); }

      for (key in self.job_states) {
        if (self.job_states[key]) { params.append("state", key); }
      };
      axios.get(url, { params: params }).then(function(response) {
	response.data.jobs.forEach(function(job) {
	  calc_additional_job_parameters(job);
	});
	self.jobs = response.data.jobs;
      });
    }
  },
  mounted: function() {
      this.updatePage();
  },
  template: '<div>'
    + '  <head-line>Job History</head-line>'
    + '  <div class=row>'
    + '    <job-state-checkbox name="succeed"     state_class="badge badge-success"></job-state-checkbox>'
    + '    <job-state-checkbox name="failed"      state_class="badge badge-danger" ></job-state-checkbox>'
    + '    <job-state-checkbox name="dispatching" state_class="badge badge-primary"></job-state-checkbox>'
    + '    <job-state-checkbox name="running"     state_class="badge badge-primary"></job-state-checkbox>'
    + '  </div>'
    + '  <div class=row>'
    + '    <job-state-checkbox name="scheduled"   state_class="badge badge-warning"></job-state-checkbox>'
    + '    <job-state-checkbox name="triggered"   state_class="badge badge-warning"></job-state-checkbox>'
    + '    <job-state-checkbox name="skipped"     state_class="badge badge-warning"></job-state-checkbox>'
    + '    <div class="col col-md-3">'
    + '    </div>'
    + '  </div>'
    + '  <div id=top_pager class=row>'
    + '   <job-search></job-search>'
    + '   <show-only-latest-results></show-only-latest-results>'
    + '   <limit-select selected_limit="limit"></limit-select>'
    + '   <div class="col-md-2">'
    + '    <refresh-button></refresh-button>'
    + '   </div>'
    + '  </div>'
    + '  <div>'
    + '   <job-history-header></job-history-header>'
    + '   <job-card v-for="job in jobs" v-bind:key="job.id" v-bind:job="job"></job-card>'
    + '  </div>'
    + '  <div id=bottom_pager class=row>'
    + '  <div class="col-md-4"></div>'
    + '   <prev-button></prev-button>'
    + '   <page-counter v-bind:page="page"></page-counter>'
    + '   <next-button></next-button>'
    + ' <div class="col-md-4"></div>'
    + '</div>'
    + '</div>'
})
