# NAME

Kanku::Handler::Reboot

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::Reboot
      options:
        wait_for_console: 1
        wait_for_network: 1
        timeout:          600 
        ....

# DESCRIPTION

This handler reboots the VM and optional waits for network and console.

# OPTIONS

       wait_for_console : wait for console login
    
       wait_for_network : wait until network is up again

       timeout :          wait only <seconds>

# CONTEXT

## getters

    domain_name

## setters

# DEFAULTS

       wait_for_console : 1 (true)
    
       wait_for_network : 1 (true)

       timeout : 600 seconds
