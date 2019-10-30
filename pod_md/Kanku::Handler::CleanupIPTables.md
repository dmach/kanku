# NAME

Kanku::Handler::CleanupIPTables - Cleanup iptables rules from master server

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::CleanupIPTables
      options:
        domain_name: domain-to-cleanup

# DESCRIPTION

This handler removes the configured iptables port forwarding rules for
the specified domain on the master server.

# OPTIONS

    domain_name           : name of domain to remove

# CONTEXT

## getters

    domain_name

## setters

NONE

# DEFAULTS

NONE
