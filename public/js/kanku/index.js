const indexPage = {
  data: function() {
    return {
      uri_base: uri_base,
    };
  },
  template: '<div>'
    + '  <head-line text="Welcome to Kanku"></head-line>'
    + '  <p>'
    + '   Please visit our <router-link to="/job_history">Job History</router-link> to see the results of the last test runs'
    + '  </p>'
    + '  <p>'
    + '   In our <router-link to="/guest">Guest Overview</router-link> you can see the currently configured VM`s on this host, '
    + '   their current state and currently configured port forwardings in form of links, '
    + '   ssh command line or simply shown when protocol is unknown'
    + '  </p>'
    + '  <p>'
    + '   <strong>PLEASE BE AWARE:<br> Triggering a new job might be executed immediately, without any other confirmation.</strong>'
    + '  </p>'
    + '  <p>'
    + '   Feel free to trigger a new job in our <router-link to="/job">Job Interface</router-link> '
    + '   but keep in mind that keeping the default domain name might break others work. '
    + '   Please use your login name in the domain name, so we can easily reach you via email (Just in case).'
    + '  </p>'
    + '  <h4>'
    + '   For further information about kanku, you can also have a look in our <a href=http://m0ses.github.io/kanku/ target=_blank>Kanku Documentation</a>'
    + '  </h4>'
    + '</div>'
};
