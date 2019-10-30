# NAME

Kanku::Handler::ExecuteCommandViaSSH

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::ExecuteCommandViaSSH
      options:
        context2env:
          ipaddress:
        environment:
          test: value
        publickey_path: /home/m0ses/.ssh/id_rsa.pub
        privatekey_path: /home/m0ses/.ssh/id_rsa
        passphrase: MySecret1234
        username: kanku
        commands:
          - rm /etc/shadow

# DESCRIPTION

This handler will connect to the ipaddress stored in job context and excute the configured commands

# OPTIONS

      commands          : array of commands to execute

SEE ALSO Kanku::Roles::SSH

# CONTEXT

## getters

SEE Kanku::Roles::SSH

## setters

NONE

# DEFAULTS

SEE Kanku::Roles::SSH
