# NAME

Kanku::Handler::RevertQcow2Snapshot

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::RevertQcow2Snapshot
      options:
        disk_image_file: domain-additional-disk.qcow2
        ....

# DESCRIPTION

This handler creates a new disk from the given parameters.

# OPTIONS

    disk_image_file       : filename of the disk to create

    snapshot_id           : id of snapshot to revert to

# CONTEXT

## getters

## setters

# DEFAULTS
