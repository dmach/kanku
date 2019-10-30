# NAME

Kanku::Handler::SaltSSH

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::SaltSSH
      options:
        publickey_path: /home/m0ses/.ssh/id_rsa.pub
        privatekey_path: /home/m0ses/.ssh/id_rsa
        passphrase: MySecret1234
        username: kanku
        commands:
          - rm /etc/shadow

# DESCRIPTION

This handler will connect to the ipaddress stored in job context and excute the configured commands

# OPTIONS

      publickey_path    : path to public key file (optional)

      privatekey_path   : path to private key file

      passphrase        : password to use for private key

      username          : username used to login via ssh

      states            : array of salt states to apply

# CONTEXT

## getters

    ipaddress

# DEFAULTS
