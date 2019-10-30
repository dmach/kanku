# NAME

Kanku::Handler::ImageDownload

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::ImageDownload
      options:
        use_cache: 1
        url: http://example.com/path/to/image.qcow2
        output_file: /tmp/mydomain.qcow2

# DESCRIPTION

This handler downloads a file from a given url to the local filesystem and sets vm\_image\_file.

# OPTIONS

    url             : url to download file from

    vm_image_file   : absolute path to file where image will be store in local filesystem

    offline         : proceed in offline mode ( skip download and set use_cache in context)

    use_cache       : use cached files in users cache directory

# CONTEXT

## getters

    vm_image_url

    domain_name

## setters

    vm_image_file

# DEFAULTS

NONE
