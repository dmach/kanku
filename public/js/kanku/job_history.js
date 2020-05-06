Vue.component('page-counter',{
  props: ['page'],
  template: '<div class="col-md-2">Page: <span class="badge badge-secondary">{{ page }}</span></div>'
});

Vue.component('prev-button',{
  methods: {
    prevpage: function() {
      if (this.$parent.page <= 1) {return}
      this.$parent.page--;
      this.$emit('updateJobHistoryPage');
    }
  },
  template: '<div class="col-md-1"><button v-on:click="prevpage()" class="btn btn-default">&lt;&lt;&lt;</button></div>'
});

Vue.component('next-button',{
  methods: {
    nextpage: function() {
      this.$parent.page++;
      this.$emit('updateJobHistoryPage');
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
      this.$emit('updateJobHistoryPage');
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
      this.$emit('updateJobHistoryPage');
    },
    clearJobSearch: function() {
      this.job_name = '';
      this.$parent.job_name = this.job_name;
      this.$emit('updateJobHistoryPage');
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
      this.$emit('updateJobHistoryPage');
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
      this.$emit('updateJobHistoryPage');
    },
  },
  template: ''
    + '    <div class="col col-md-4">'
    + '        Show only latest results'
    + '        <input type="checkbox" name="show_only_latest_results" v-on:change="updateJobSearch" style="margin:7px" >'
    + '    </div>'
});

Vue.component('job-history-list',{
  props: ['jobs', 'is_admin'],
  template: '<div>'
    + ' <job-history-card v-for="job in jobs" :key="job.id" :job="job" :is_admin="is_admin"></job-history-card>'
    + '</div>'
});

Vue.component('paginator', {
  props: ['page', 'is_admin', 'total_pages'],
  methods: {
    nextpage: function() {
      this.$parent.page++;
      this.$emit('updateJobHistoryPage');
    },
    prevpage: function() {
      this.$parent.page--;
      this.$emit('updateJobHistoryPage');
    },
    firstpage: function() {
      this.$parent.page = 1;
      this.$emit('updateJobHistoryPage');
    },
    lastpage: function() {
      this.$parent.page = this.total_pages;
      this.$emit('updateJobHistoryPage');
    }
  },
  computed: {
    pb_classes: function() { return (this.page > 1) ? ['page-item'] : ['page-item', 'disabled'] },
  },
/*  
 template: '<div class="col-md-1"><button v-on:click="nextpage()" class="btn btn-default">&gt;&gt;&gt;</button></div>'
*/
  template: '<nav aria-label="Pagination">'
    + '  <ul class="pagination">'
    + '    <li class="page-item">'
    + '      <span class="page-link" @click="firstpage()">First</span>'
    + '    </li>'
    + '    <li :class="pb_classes">'
    + '      <span class="page-link" @click="prevpage()">Previous</span>'
    + '    </li>'
    + '    <li class="page-item active">'
    + '      <span class="page-link">'
    + '        {{ page }}'
    + '        <span class="sr-only">(current)</span>'
    + '      </span>'
    + '    </li>'
    + '    <li class="page-item">'
    + '      <span class="page-link" @click="nextpage()">Next</span>'
    + '    </li>'
    + '    <li class="page-item">'
    + '      <span class="page-link" @click="lastpage()">Last</span>'
    + '    </li>'
    + '  </ul>'
    + '</nav>'
});

const jobHistoryPage = {
  props:['is_admin'],
  data: function() {
    return {
      jobs: {},
      page: this.$route.params.page,
      limit: 10,
      job_name: '',
      job_states: {'succeed':1, 'failed':1,'dispatching':1,'running':1,'scheduled':0,'triggered':0,'skipped':0},
      show_only_latest_results : false,
      this: this,
    };
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
    refreshPage: function() {
      $('#spinner').show();
      var url    = uri_base + "/rest/jobs/list.json";
      var self   = this;
      this.jobs  = {};
      var params = {};
      var params = new URLSearchParams();
      params.append("page",  self.page);
      params.append("limit", self.limit);

      if (this.show_only_latest_results) { params.append("show_only_latest_results",  1); }

      if (self.job_name) { params.append('job_name', self.job_name); }

      for (key in self.job_states) {
        if (self.job_states[key]) { params.append("state", key); }
      };
      axios.get(url, { params: params })
        .then(function(response) {
	  response.data.jobs.forEach(function(job) {
	    calc_additional_job_parameters(job);
	  });
	  self.jobs = response.data.jobs;
        })
        .catch(function (error) {
          show_messagebox('danger', error);
          console.log(error);
        })
        .then(function () {
          $('#spinner').hide();
        });
    }
  },
  mounted: function() {
      this.refreshPage();
  },
  template: '<div>'
    + '  <head-line text="Job History"></head-line>'
    + '  <div class="row top_pager">'
    + '    <job-state-checkbox name="succeed"     state_class="badge badge-success" @updateJobHistoryPage="refreshPage"></job-state-checkbox>'
    + '    <job-state-checkbox name="failed"      state_class="badge badge-danger"  @updateJobHistoryPage="refreshPage"></job-state-checkbox>'
    + '    <job-state-checkbox name="dispatching" state_class="badge badge-primary" @updateJobHistoryPage="refreshPage"></job-state-checkbox>'
    + '    <job-state-checkbox name="running"     state_class="badge badge-primary" @updateJobHistoryPage="refreshPage"></job-state-checkbox>'
    + '  </div>'
    + '  <div class="row top_pager">'
    + '    <job-state-checkbox name="scheduled"   state_class="badge badge-warning" @updateJobHistoryPage="refreshPage"></job-state-checkbox>'
    + '    <job-state-checkbox name="triggered"   state_class="badge badge-warning" @updateJobHistoryPage="refreshPage"></job-state-checkbox>'
    + '    <job-state-checkbox name="skipped"     state_class="badge badge-warning" @updateJobHistoryPage="refreshPage"></job-state-checkbox>'
    + '    <div class="col col-md-3">'
    + '    </div>'
    + '  </div>'
    + '  <div class="row top_pager">'
    + '   <job-search></job-search>'
    + '   <show-only-latest-results  @updateJobHistoryPage="refreshPage"></show-only-latest-results>'
    + '   <limit-select selected_limit="limit"></limit-select>'
    + '   <div class="col-md-2">'
    + '    <refresh-button @refreshPage="refreshPage"></refresh-button>'
    + '   </div>'
    + '  </div>'
    + '  <div>'
    + '   <job-history-header></job-history-header>'
    + '   <spinner></spinner>'
    + '   <job-history-list :jobs="jobs" :is_admin="is_admin"></job-history-list>'
    + '  </div>'
    + '  <div id=bottom_pager class=row>'
    + '  <div class="col-md-4"></div>'
    + '  <div class="col-md-4">'
    + '   <paginator :page="page"@updateJobHistoryPage="refreshPage"></paginator>'
    + '  </div>'
    + '  <div class="col-md-4"></div>'
    + '</div>'
    + '</div>'
};
