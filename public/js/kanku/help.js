Vue.component('help-job-history',{
  template: `
<b-modal ref="modalHelpJobHistory" hide-footer title="Job History Help">
<p>In the job history page you can see a list of all jobs in kanku.</p>
<p>They can be filtered by their current state or various other filters can be applied with the search field.</p>

<h2>Search Field</h2>

<p><strong>Search by job_name:</strong><br>Use &apos;%&apos; as wildcard</p>
<p><strong>Supported fields:</strong><br>id, state, name, worker</p>
<p><strong>Supported Values:</strong><br>comma separated lists (except worker)</p>
<p><strong>Examples:<br></strong>&apos;id:1,2&apos;, &apos;state:running&apos;, &apos;name=obs-server,kanku-devel&apos;, &apos;obs-server%&apos;</p>

<h2>States</h2>

<table class="table">
  <thead>
    <tr>
      <th scope="col">State</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="`+uri_base+`/images/help/succeed.png" alt="succeed patch"></td>
      <td>Job finished successfully.</td>
    </tr>
    <tr>
      <td><img src="`+uri_base+`/images/help/failed.png" alt="failed patch"></td>
      <td>Job finished with error.</td>
    </tr>
    <tr>
      <td><img src="`+uri_base+`/images/help/dispatching.png" alt="dispatching patch"></td>
      <td>Job started but not yet assigned to worker</td>
    </tr>
    <tr>
      <td><img src="`+uri_base+`/images/help/running.png" alt="running patch"></td>
      <td>Job is currently running on worker</td>
    </tr>
    <tr>
      <td><img src="`+uri_base+`/images/help/scheduled.png" alt="scheduled patch"></td>
      <td>Job generated by kanku-scheduler and waiting to get picked by kanku-dispatcher</td>
    </tr>
    <tr>
      <td><img src="`+uri_base+`/images/help/triggered.png" alt="triggered patch"></td>
      <td>Job generated by webui, kanku cli tool or kanku-triggerd (listening on rabbitmq)</td>
    </tr>
    <tr>
      <td><img src="`+uri_base+`/images/help/skipped.png" alt="skipped patch"></td>
      <td>Job skipped - Handler can decide to skip a job if it makes no sense to continue any longer.</td>
    </tr>
  </tbody>
</table>
</b-modal>
`
});

Vue.component('help-guest',{
  template: `
<b-modal ref="modalHelpGuest" hide-footer title="Guest Help">
<p>In the Guest page you can see a list of all Guest VMs existing in the kanku cluster. </p>
<p>The guests with a <span class="badge badge-success">green</span> headline are currently running. </p>
<p>The guests with a <span class="badge badge-warning">yellow</span> headline are down at the moment.</p>
<p>In the details you can find some additional information like the network bridge interface on the host, the MAC address and current portforwardings.</p>
<p>The forwarded ports are not necessarily reachable, e.g. when the service is down on the VM.</p>
<p>For port 22 automatically a ssh command line is generated to connect to the VM directly.</p>
<p>For port 80 and 443 a href is generate to get easy access to the web pages.</p>
<p>You can easily specify links to non common http(s) ports in the job configuration file. SEE 'man Kanku::Handler::PortForward' for more information.</p>
</p>

<h2>Search Field</h2>

<p><strong>Search by domain or host:</strong><br>use &apos;.*&apos; wildcard</p>
<p><strong>Supported fields:</strong><br>domain, host, worker (alias for host)</p>
<p><strong>Supported Values:</strong><br>perl regex</p>
<p><strong>Examples:</strong><br>&apos;domain:obs-server&apos;, &apos;host:kanku-worker1&apos;, &apos;worker=.*1&apos;</p>
</b-modal>
`
});
