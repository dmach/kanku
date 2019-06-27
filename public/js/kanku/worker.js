Vue.component('worker-card',{
  props: ['worker'],
  template: '<div class="card worker_card">'
    + '  <div class="card-header alert">'
    + '    <div class="row">'
    + '      <div class="col-md-12">'
    + '        Hostname: {{ worker.hostname }}'
    + '      </div>'
    + '    </div>'
    + '  </div>'
    + '  <div class="card-body">'
    + '    <div class=row>'
    + '      <div class="col-md-2">'
    + '         Last Seen:'
    + '      </div>'
    + '      <div class="col-md-8">'
    + '        {{ worker.last_seen_date }}'
    + '      </div>'
    + '      <div class="col-md-2">'
    + '        ({{ worker.last_seen }})'
    + '      </div>'
    + '      <div class="col-md-2">'
    + '         Last Update:'
    + '      </div>'
    + '      <div class="col-md-8">'
    + '        {{ worker.last_update_date }}'
    + '      </div>'
    + '      <div class="col-md-2">'
    + '        ({{ worker.last_update }})'
    + '      </div>'
    + '      <div class="col-md-2">'
    + '         Active Childs:'
    + '      </div>'
    + '      <div class="col-md-10">'
    + '        ({{ worker.pids_string }})'
    + '      </div>'
    + '    </div>'
    + '  </div>'
    + '</div>'
});

var vm = new Vue({
  el: '#vue_app',
  //props: ['workers'],
  data: { workers : [] },
  methods: {
    updateWorkersList: function() {
      var url    = uri_base + "/rest/worker/list.json";
      var params = new URLSearchParams();
      var self   = this;

      axios.get(url, { params: params }).then(function(response) {
	response.data.workers.forEach(function(worker) {
          worker.last_seen_date = new Date(worker.last_seen * 1000);
          worker.last_update_date = new Date(worker.last_update * 1000);
          worker.pids_string = worker.info.active_childs.join(',');
          console.log(worker.hostname)
	});
	self.workers = response.data.workers;
        console.log(self.workers);
      })
    }
  },
  mounted: function() {
      this.updateWorkersList();
  }
})
