# NAME

Kanku::Handler::OBSServerFrontendTests - a handler to execute OBS Server SmokeTests for the Frontend

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::OBSServerFrontendTests
      options:
        context2env:
          ipaddress:
        jump_host: 192.168.199.17
        git_url: https://github.com/M0ses/open-build-service
        git_revision: fix_foobar

# DESCRIPTION

This handler will connect to the given ipaddress and execute the OBS server 
frontend test suite (smoketests)

# OPTIONS

      commands          : array of commands to execute

SEE ALSO Kanku::Roles::SSH, Kanku::Handler::ExecuteCommandViaSSH

# CONTEXT

## getters

NONE

## setters

NONE

# DEFAULTS

NONE
