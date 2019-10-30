# NAME

Kanku::Handler::SetupNetwork

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::SetupNetwork
      options:
        interfaces:
          eth0:
            BOOTPROTO: dhcp
          eth1:
            BOOTPROTO: static
            IPADDR: 192.168.122.22/24
        resolv:
          nameserver:
            - 192.168.122.1
          search: opensuse.org local.site
          domain: local.site

# DESCRIPTION

This handler set\`s up your Network configuration

# OPTIONS

    interfaces - An array of strings which include your public ssh key

# CONTEXT

# DEFAULTS
