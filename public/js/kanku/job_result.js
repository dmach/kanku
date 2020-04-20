var vm = new Vue({
  el: '#vue_app',
  data: {
    job: { id: 0}
  },
  methods: {
    updatePage: function() {
      var currentUrl = window.location.pathname;
      var urlParts = currentUrl.split('/');
      var job_id = urlParts.pop();
      var url = uri_base + "/rest/job/" + job_id + ".json";
      var self   = this;
      var params = new URLSearchParams();
      axios.get(url, { params: params }).then(function(response) {
	calc_additional_job_parameters(response.data);
	self.job = response.data;
      });
    },
  },
  mounted: function() {
      this.updatePage();
  },
  template: '<div>'
    + ' <head-line text="Job Result"></head-line>'
    + '   <job-history-header></job-history-header>'
    + '   <job-card :job="job"></job-card>'
    + '</div>'
})
