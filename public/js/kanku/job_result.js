const jobResultPage = {
  props:['is_admin'],
  data: function() {
    return {
      job: { id : this.$route.params.job_id }
    };
  },
  methods: {
    updatePage: function() {
      var currentUrl = window.location.pathname;
      var urlParts = currentUrl.split('/');
      var job_id = urlParts.pop();
      var url = uri_base + "/rest/job/" + this.$route.params.job_id + ".json";
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
    + '   <job-history-card :job="job" :is_admin="is_admin"></job-history-card>'
    + '</div>'
};
