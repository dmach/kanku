# NAME

Kanku::Notifier::NSCA - A kanku notification module for Nagios NSCA

# DESCRIPTION

Send a notification to a nagios NSCA daemon.

# CONFIGURATION

## GLOBAL

in /etc/kanku/kanku-config.yml:

    Kanku::Notifier::NSCA:
      init:
        encryption_password: ...
        encryption_type: ...
        remote_host: ...
        remote_port: ...
      send_report:
        hostname: <hostname_in_icinga>

## JOB CONFIG FILE

    notifiers:
      -
        use_module: Kanku::Notifier::NSCA
        options:
          send_report:
            hostname: <hostname_in_icinga>
            service:  <servicename_in_icinga>
        states: failed,succeed

# SEE ALSO

[Net::NSCA::Client](./Net%3A%3ANSCA%3A%3AClient)
