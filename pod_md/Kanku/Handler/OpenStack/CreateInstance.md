# NAME

Kanku::Handler::OpenStack::CreateInstance

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile
  -
    use\_module: Kanku::Handler::OpenStack::CreateInstance
    options:
      networks:
        -
          uuid: 8cce38fd-443f-4b87-8ea5-ad2dc184064f
      security\_groups:
        -
          name: kanku
      flavorRef: 5
      key\_name: admin
      floating\_network\_id: 0d00a5bd-d07c-4206-b87d-807ca98b44b4
      availability\_zone: nova

# DESCRIPTION

This handler creates a new server instance in openstack. It uses the image from $job->context->{os\_image\_id}

# OPTIONS

# CONTEXT

## getters

    os_instance_name

    os_image_id

    os_instance_id

## setters

    ipaddress: only set if floating_network_id is given

# DEFAULTS

NONE
