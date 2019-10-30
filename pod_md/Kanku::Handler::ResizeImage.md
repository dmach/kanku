# NAME

Kanku::Handler::ResizeImage

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::ResizeImage
      options:
        disk_size: 100G

# DESCRIPTION

This handler resizes a downloaded image to a given size using 'qemu-img'

# OPTIONS

    disk_size      : new size of disk in GB

# CONTEXT

## getters

    cache_dir

    vm_image_file

## setters

# DEFAULTS
