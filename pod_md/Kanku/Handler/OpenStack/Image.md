# NAME

Kanku::Handler::OpenStack::Image

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::OpenStack::Image
      options:
        import_from: http://...
        import_from_format: qcow2
        image_properties:
          container_format: bare
          disk_format:      qcow2
          name:             Kanku OBS-Appliance Unstable
          tags:
            - testing
        os_auth_url: ...
        os_username: ...
        os_password: ...
        os_tenant_name: ...

# DESCRIPTION

This handler creates a task in openstack to download a file from a given url and waits for task being finished.

# OPTIONS

SEE in openstack API documentation

# CONTEXT

## getters

    vm_image_url

## setters

    os_image_import_task_id

    obs_project

    obs_package

    os_image_id

# DEFAULTS

NONE

# SEE ALSO

OpenStack::API
