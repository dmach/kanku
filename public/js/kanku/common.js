function toggle_element(id) {
  var element = $(id);
  var css_display = element.css("display");
  var style = (css_display == "none") ? "block" : 'none';
  element.css("display", style);
}

function show_messagebox(state, msg, timeout=10000) {
  var elem = $("#messagebox");
  var div = $('<div class="alert-' + state +' container alert" role=alert></div>').append(msg);

  elem.append(div);
  if(timeout) {
    var intervalID = setTimeout(function() { div.remove(); }, timeout);
  }
}

var updateMessageBar = function (p, t, s) {
  var mb = p.$root.$data.message_bar;
  mb.show        = true;
  mb.alert_class = "alert-" + s;
  mb.text        = t;
  setTimeout(
    function() {
      mb.show = false;
    },
    10000
  );
};

var alert_map = {
  succeed:     'alert-success',
  failed:      'alert-danger',
  running:     'alert-primary',
  dispatching: 'alert-primary',
};

function calc_job_start_and_end(start_time, end_time) {
  if (start_time > 0) {
    var st = new Date(1000 * start_time);
    // calculate duration
    var due;

    if ( end_time ) {
      due = end_time;
    } else {
      due = Math.floor(Date.now() / 1000);
    }

    var duration = due - start_time;
    duration_min = Math.floor( duration / 60 );
    duration_sec = duration % 60;

    // (start_time_formatted, duration_formatted)
    return [st.toLocaleString(), duration_min +" min "+duration_sec+" sec"];
  } else {
    return ["not started", "not started"];
  }
}

function calc_additional_job_parameters(job) {
        job.state_class = alert_map[job.state];
        var r = calc_job_start_and_end(job.start_time, job.end_time);
        job.start_time_formatted = r[0];
        job.duration             = r[1];
};

Vue.component('refresh-button',{
  methods: {
    updatePage: function() {
      this.$root.updatePage();
    }
  },
  template: ''
    + '<button type="button" class="btn btn-primary float-right" v-on:click="updatePage()">'
    + '  <i class="fas fa-sync"></i> Refresh'
    + ' </button>'
});

Vue.component('spinner',{
  methods: {
    refreshJobList: function() {
      this.$root.updatePage();
    }
  },
  template: ''
    + '    <div class="row" id="spinner">'
    + '        <div class="col-md-5"></div>'
    + '        <div class="col-md-2">'
    + '          <div class="spinner-border" role="status">'
    + '            <span class="sr-only">Loading...</span>'
    + '          </div>'
    + '        </div>'
    + '        <div class="col-md-5"></div>'
    + '    </div>'
});

Vue.component('message-box',{
  props: ['message_bar'],
  template: ''
    + '<transition name="fade">'
    + '  <div v-if="message_bar.show" v-bind:class="message_bar.alert_class" class="alert">{{ message_bar.text }}</div>'
    + '</transition>'
});

Vue.component('head-line', {
  props: ['text'],
  template: '<h1>{{ text }}</h1>'
});

Vue.component('worker-info',{
  props: ['worker'],
  template: '<div class="worker_info">'
    + '  <div class="row">'
    + '    <div class="col-md-2">'
    + '      Worker Name'
    + '    </div>'
    + '    <div class="col-md-10">'
    + '      {{ worker.host }}'
    + '    </div>'
    + '  </div>'
    + '  <div class="row">'
    + '    <div class="col-md-2">'
    + '      Worker PID'
    + '    </div>'
    + '    <div class="col-md-10">'
    + '      {{ worker.pid }}'
    + '    </div>'
    + '  </div>'
    + '  <div class="row">'
    + '    <div class="col-md-2">'
    + '      Worker Queue'
    + '    </div>'
    + '    <div class="col-md-10">'
    + '      {{ worker.queue }}'
    + '    </div>'
    + '  </div>'
    + '  <div class="row" v-show="worker.error">'
    + '    <div class="col-md-12">'
    + '      <pre>{{ worker.error }}</pre>'
    + '    </div>'
    + '  </div>'
    + '</div>'
});

Vue.component('task-card',{
  props: ['task'],
  data: function() {
    return {
      showTaskResult: 0
    }
  },
  methods: {
    toggleTaskDetails: function() {
      this.showTaskResult = !this.showTaskResult;
    }
  },
  template: ''
    + '<div class="card task_card">'
    + '  <div class="card-header alert" v-bind:class="task.state_class" v-on:click="toggleTaskDetails()">'
    + '    <div class="row">'
    + '      <div class="col-md-12">'
    + '        <span class="badge badge-secondary">{{ task.id }}</span> {{ task.name }}'
    + '      </div>'
    + '    </div>'
    + '  </div>'
    + '  <div class="card-body" v-show="showTaskResult">'
    + '    <task-result v-bind:result="task.result"></task-result>'
    + '  </div>'
    + '</div>'
});

Vue.component('task-result',{
  props: ['result'],
  template: '<div class=container>'
    + '<template v-if="result.error_message">'
    + '  <pre>{{ result.error_message}}</pre>'
    + '</template>'
    + '<template v-if="result.prepare">'
    + '  <div class="row">'
    + '    <div class="col-md-2">prepare:</div><div class="col-md-10">{{ result.prepare.message }}</div>'
    + '  </div>'
    + '</template>'
    + '<template v-if="result.execute">'
    + '  <div class="row">'
    + '    <div class="col-md-2">execute:</div><div class="col-md-10">{{ result.execute.message }}</div>'
    + '  </div>'
    + '</template>'
    + '<template v-if="result.finalize">'
    + '  <div class="row">'
    + '    <div class="col-md-2">finalize:</div><div class="col-md-10">{{ result.finalize.message }}</div>'
    + '  </div>'
    + '</template>'
    + '</div>'
});

Vue.component('task-list',{
  props: ['result', 'workerinfo', 'subtasks'],
  data: function() {
    return {
      isShown: 0,
      count: 0,
      jobData: {},
    }
  },
  updated: function() {
    // Workaround if data gets updated but jobData is empty
    // like it happens when "Refresh" button is pressed
    if (! this.jobData.name) {
      return;
    }
    calc_additional_job_parameters(this.jobData);
    this.$parent.job.state_class          = this.jobData.state_class;
    this.$parent.job.start_time_formatted = this.jobData.start_time_formatted;
    this.$parent.job.duration             = this.jobData.duration;
    this.$parent.workerInfo.host          = this.jobData.workerhost
  },
  template: '<div class="card-body">'
    + '  <worker-info v-bind:worker="workerinfo"></worker-info>'
    + '  <task-card v-bind:key="task.id" v-bind:task="task" v-for="task in jobData.subtasks"></task-card>'
    +'</div>'
});

Vue.component('job-card',{
  props: ['job'],
  data: function () {
    var show_comments     = false;
    var show_pwrand       = false;
    if (active_roles['Admin'] || active_roles['User']) {
      show_comments = true
    }
    if (active_roles['Admin'] && this.job.pwrand) {
      show_pwrand = true;
    }
    return {
      showTaskList:        0,
      uri_base:            uri_base,
      user_is_admin:       active_roles['Admin'],
      show_comments:       show_comments,
      show_pwrand:         show_pwrand,
      comment: '',
      subtasks: [],
    }
  },
  computed: {
    workerInfo: function() {
      var tmp = new Array;
      if (this.job.workerinfo) {
        tmp = this.job.workerinfo.split(':');
      }
      return {
        host:  tmp[0] || 'localhost',
        pid:   tmp[1] || 0,
        queue: tmp[2] || '',
        loglink: 'http://'+tmp[0]+'/kanku-console-logs/job-'+this.job.id+'-console.log'
      }
    }
  },
  methods: {
    toggleJobDetails: function() {
      this.showTaskList = !this.showTaskList
      this.$refs.tasklist.isShown = ! this.$refs.tasklist.isShown;
      this.$refs.tasklist.count++;
      this.getJobDetails();
    },
    getJobDetails: function() {
      console.log(this.job.id);
      var url = uri_base + "/rest/job/"+this.job.id+".json";
      var self = this;
      axios.get(url).then(function(response) {
        console.log(response.data);
        if (response.data.state == 'failed') {
          show_messagebox('danger', response.data.msg);
          return;
        }
        self.$refs.tasklist.jobData = response.data;
        response.data.subtasks.forEach(function(task) {
           task.state_class = alert_map[task.state];
           task.result      = task.result || {};
        });
        self.substasks = response.data.subtasks;
      });
    },
    showModal: function() {
      this.$refs.modalComment.show()
    },
    closeModal: function() {
      this.$refs.modalComment.hide();
      this.$root.updatePage();
    },
    createJobComment: function() {
      var url    = uri_base+'/rest/job/comment/'+this.job.id+'.json';
      var params = {job_id: this.job.id,message:this.comment};
      axios.post(url, params);
      this.updateJobCommentList();
      this.comment = '';
    },
    updateJobCommentList: function() {
      var url    = uri_base+'/rest/job/comment/'+this.job.id+'.json';
      var params = {job_id: this.job.id};
      var self = this;
      axios.get(url, params).then(function(response) {
        self.job.comments = response.data.comments;
      });
    },
  },
  template: '<div class="card job_card">'
    + '<div class="card-header alert" v-bind:class="job.state_class">'
    + '  <div class="row">'
    + '    <div class="col-md-6" v-on:click="toggleJobDetails()">'
    + '      <span class="badge badge-secondary">{{ job.id }}</span> {{ job.name }} ({{ workerInfo.host }})</a>'
    + '    </div>'
    + '    <div class="col-md-2">'
    + '      {{ job.start_time_formatted }}'
    + '    </div>'
    + '    <div class="col-md-2">'
    + '      {{ job.duration }}'
    + '    </div>'
    + '    <div class="col-md-2">'
    + '      <!-- ACTIONS -->'
    + '      <console-log-link v-bind:loglink="workerInfo.loglink"></console-log-link>'
    + '      <job-details-link v-bind:href="uri_base + \'/job_result/\'+job.id"></job-details-link>'
    + '      <pwrand-link v-show="show_pwrand" v-bind:job_id="job.id"></pwrand-link>'
    + '      <comments-link v-bind:job="job" ref="commentsLink"></comments-link>'
    + '    </div>'
    + '  </div>'
    + '</div>'
    + '<task-list v-show="showTaskList" ref="tasklist" v-bind:workerinfo="workerInfo" v-bind:subtasks="subtasks"></task-list>'
    + '  <b-modal ref="modalComment" hide-footer title="Comments for Job">'
    + '    <div>'
    + '      <single-job-comment v-for="cmt in job.comments" v-bind:key="cmt.id" v-bind:comment="cmt">'
    + '      </single-job-comment>'
    + '    </div>'
    + '    <div>'
    + '      New Comment:'
    + '      <textarea v-model="comment" rows="2" style="width: 100%"></textarea>'
    + '    </div>'
    + '    <div class="modal-footer">'
    + '      <button type="button" class="btn btn-success" v-on:click="createJobComment(job.id)">Add Comment</button>'
    + '      <button type="button" class="btn btn-secondary" v-on:click="closeModal()" aria-label="Close">Close</button>'
    + '    </div>'
    + '  </b-modal>'
    + '<pwrand-modal v-bind:job="job" ref="modalPwRand"></pwrand-modal>'
    + '</div>'
});

Vue.component('comments-link',{
  methods: {
    showModal: function() {
      var p = this.$parent;
      p.showModal();
    }
  },
  props: ['job'],
  computed: {
    comments_length: function() {
      if (this.job.comments) {
        return this.job.comments.length;
      }
      return 0;
    }
  },
  template: ''
    + '<a class="float-right" style="margin-left:5px;" v-on:click="showModal()">'
    + '  <span v-if="comments_length > 0" key="commented"><i class="fas fa-comments"></i></span>'
    + '  <span v-else><i class="far fa-comments" key="uncommented"></i></span>'
    + '</a>'
});

Vue.component('job-details-link',{
  template: '<a class="float-right" style="margin-left:5px;"><i class="fas fa-link"></i></a>'
});

Vue.component('pwrand-link',{
  props: ['job_id'],
  methods: {
    showModalPwRand: function() {
      var p0 = this.$parent;
      var r0 = p0.$refs.modalPwRand;
      var r1 = r0.$refs.modalPwRandModal;
      r1.show();
    },
  },
  template: '<a class="float-right" style="margin-left:5px;" v-on:click="showModalPwRand()"><i class="fas fa-lock"></i></a>'
});

Vue.component('console-log-link',{
  props: ['loglink'],
  template: '<a class="float-right" style="margin-left:5px;" :href="loglink" target="_blank"><i class="fa fa-file-alt"></i></a>'
});

Vue.component('pwrand-modal', {
  props: ['job'],
  template: ''
    + '<b-modal ref="modalPwRandModal" hide-footer title="Randomized Password">'
    + '<pre>'
    + 'gpg -d &lt;&lt;EOF |json_pp -f json -t dumper' + "\n"
    + '{{ job.pwrand }}'
    + "\n"
    + 'EOF'
    + '</pre>'
    + '</b-modal>'
});

Vue.component('single-job-comment', {
  props: ['comment'],
  methods: {
    editJobComment: function() {
      this.$refs.textarea_job_comment.readOnly = false;
      this.show_save = 1;
    },
    deleteJobComment: function() {
      var url    = uri_base+'/rest/job/comment/'+this.comment.id+'.json';
      var params = {comment_id: this.comment.id, };
      var self = this;
      var p = this.$parent;
      axios.delete(url, params).then(function(response) {
        p.$parent.updateJobCommentList();
      });
    },
    updateJobComment: function() {
      var url    = uri_base+'/rest/job/comment/'+this.comment.id+'.json';
      var params = {comment_id: this.comment.id, message: this.comment_message };
      var self = this;
      var p = this.$parent;
      axios.put(url, params).then(function(response) {
        p.$parent.updateJobCommentList();
      });
      this.$refs.textarea_job_comment.readOnly = true;
      this.show_save = 0;
    }
  },
  data: function() {
    return {
      show_mod: (user_name == this.comment.user.username) ? 1 : 0,
      show_save: 0,
      comment_message: this.comment.comment,
    }
  },
  template: ''
    + '<div class="panel panel-default">'
    + '  <div class="panel-heading">'
    + '    <div class=row>'
    + '      <div class=col-sm-9>'
    + '      {{ comment.user.username }} ({{comment.user.name}})'
    + '      </div>'
    + '      <div class="col-sm-3 text-right">'
    + '        <div v-show="show_mod">'
    + '          <button class="btn btn-primary" type="button" aria-label="Edit" v-on:click="editJobComment()">'
    + '            <i class="far fa-edit"></i>'
    + '          </button>'
    + '          <button class="btn btn-danger" type="button" aria-label="Delete" v-on:click="deleteJobComment()">'
    + '            <i class="far fa-trash-alt"></i>'
    + '          </button>'
    + '        </div>'
    + '      </div>'
    + '    </div>'
    + '   </div>'
    + '  <textarea v-model="comment_message" style="width:100%;margin-top:10px;margin-bottom:20px;" readonly ref="textarea_job_comment">'
    + '{{ comment.comment }}'
    + '</textarea>'
    + '   <button v-show="show_save" class="btn btn-success" v-on:click="updateJobComment()">Save</button>'
    + '</div>'
});

Vue.component('job-history-header', {
  template: ''
    + '    <div class="container-fluid">'
    + '     <div class="row alert alert-secondary">'
    + '      <div class="col-md-6">'
    + '       <span class="badge badge-secondary">ID</span>'
    + '       Job Name'
    + '      </div>'
    + '      <div class="col-md-2">Start Time</div>'
    + '      <div class="col-md-2">Duration</div>'
    + '      <div class="col-md-2 float-right">Actions</div>'
    + '     </div>'
    + '    </div>'
});
