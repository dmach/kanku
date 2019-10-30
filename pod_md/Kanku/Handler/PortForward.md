# NAME

Kanku::Handler::PortForward

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::PortForward
      options:
        host_interface: br0
        forward_port_list: tcp:22,tcp:80,tcp:443,udp:53

# DESCRIPTION

Enable port forwarding for configured a port\_forward\_list.
It tries to find the next free port and configure a port forwarding with iptables.

# OPTIONS

    domain_name           : name of domain to create

    forward_port_list     : list of ports to forward from host_interface`s IP to VM

# CONTEXT

## getters

    domain_name

    ipaddress

## setters

# DEFAULTS
