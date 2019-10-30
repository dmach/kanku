# NAME

Kanku::Roles::SSH - A generic role for handling ssh connections using Net::SSH2

# SYNOPSIS

    package Kanku::Handler::MySSHHandler;
    use Moose;
    with 'Kanku::Roles::SSH';

    sub execute {
      my ($self) = @_;

      ...

      $self->get_defaults();

      $self->connect();

      $self->exec_command("/bin/true");
    }

# DESCRIPTION

This module contains a generic role for handling ssh connections in kanku using Net::SSH2

# METHODS

## get\_defaults

## connect

## exec\_command

# ATTRIBUTES

    ipaddress         : IP address of host to connect to

    publickey_path    : path to public key file (optional)

    privatekey_path   : path to private key file

    passphrase        : password to use for private key

    username          : username used to login via ssh

    connect_timeout   : time to wait for successful connection to host

    job               : a Kanku::Job object (required for context)

    ssh2              : a Net::SSH2 object (usually created by role itself)

    auth_type         : SEE Net::SSH2 for further information

# CONTEXT

## getters

    ipaddress

    publickey_path

    privatekey_path

## setters

    NONE

# DEFAULTS

    privatekey_path       : $HOME/.ssh/id_rsa

    publickey_path        : $HOME/.ssh/id_rsa.pub

    username              : root

    connect_timeout       : 300 (sec)

    auth_type             : agent
