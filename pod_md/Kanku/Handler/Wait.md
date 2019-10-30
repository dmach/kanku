# NAME

Kanku::Handler::Wait

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::Wait
      options:
        delay: 120
        reason: Give XY the change to finish his job

# DESCRIPTION

This handler simply waits for given delay in seconds and the reason wil be logged for documenation purposes.

# OPTIONS

    delay                 : sleep for n seconds

    reason                : message to be logged

# CONTEXT

## getters

NONE

## setters

NONE

# DEFAULTS

    reason                : "Not configured"    images_dir     /var/lib/libvirt/images
