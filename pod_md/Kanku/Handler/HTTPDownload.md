# NAME

Kanku::Handler::HTTPDownload

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::HTTPDownload
      options:
        url: http://example.com/path/to/image.qcow2
        output_file: /tmp/mydomain.qcow2

# DESCRIPTION

This handler downloads a file from a given url to an output\_file or output\_dir in the filesystem of the host.

# OPTIONS

    url         : url to download file from

    output_file : absolute path to output_file

    output_dir  : absolute path to directory where file is stored (filename will be preserved).

# CONTEXT

## getters

NONE

## setters

    vm_image_file

# DEFAULTS

NONE
