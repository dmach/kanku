Vue.component('worker-card',{
  props: ['worker'],
  template: '<div class="card worker_card">'
    + '  <div :class="worker.header_class">'
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

const workerPage = {
  data: function() {
    return {
     workers : [],
    };
  },
  methods: {
    refreshPage: function() {
      var url    = uri_base + "/rest/worker/list.json";
      var params = new URLSearchParams();
      var self   = this;
      $('#spinner').show();

      axios.get(url, { params: params }).then(function(response) {
        response.data.workers.forEach(function(worker) {
          worker.last_seen_date = new Date(worker.last_seen * 1000);
          worker.last_update_date = new Date(worker.last_update * 1000);
          worker.pids_string = worker.info.active_childs.join(',');
          var ts = Math.round((new Date()).getTime() / 1000);
          if ( worker.last_seen < ts - 600 ) {
            worker.header_class = 'card-header alert-danger';
          } else {
            worker.header_class = 'card-header alert-success';
          }
        });
        self.workers = response.data.workers;
        $('#spinner').hide();
      })
    }
  },
  mounted: function() {
      this.refreshPage();
  },
  template: ''
    + '<div>'
    + ' <head-line text="Worker"></head-line>'
    + ' <div class="row" style="padding-bottom:10px;">'
    + '  <div class="col-lg-12">'
    + '    <refresh-button @refreshPage="refreshPage"></refresh-button>'
    + '  </div>'
    + ' </div>'
    + ' <spinner></spinner>'
    + ' <worker-card v-for="worker in workers" v-bind:key="worker.id" v-bind:worker="worker"></worker-card>'
    + '</div>'
};
