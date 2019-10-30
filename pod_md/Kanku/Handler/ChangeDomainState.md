# NAME

Kanku::Handler::ChangeDomainState

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::ChangeDomainState
      options:
        action: shutdown
        timeout:          600 

# DESCRIPTION

This handler triggers an action on a VM and waits for the final state.

# OPTIONS

    action  :          <create|reboot|shutdown|destroy|undefine>

    timeout :          wait only <seconds>

# CONTEXT

## getters

    domain_name

## setters

# DEFAULTS

    timeout : 600 seconds
