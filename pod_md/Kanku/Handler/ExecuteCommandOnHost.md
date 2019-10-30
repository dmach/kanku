# NAME

Kanku::Handler::ExecuteCommandOnHost - execute commands on host

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::ExecuteCommandOnHost
      options:
        environment: 
          CURL_CA_BUNDLE: /path/to/my/ca
        context2env: 
          ipaddress:
        commands:
          - curl https://$IPADDRESS/
          

# DESCRIPTION

This handler allows the execution of arbitrary commands on the host system, 
e.g. for checking access rules from a remote site instead of localhost inside
the test vm.

# OPTIONS

    environment : specify environment variables and their values for this job

    context2env : set an environment variable with the value from the context. Please be aware that the variable name will be converted to upper case in the environment

    commands    : list of commands to be executed

# CONTEXT

## getters

NONE

## setters

NONE

# DEFAULTS

NONE
