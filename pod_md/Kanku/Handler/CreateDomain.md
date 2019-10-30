# NAME

Kanku::Handler::CreateDomain

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::CreateDomain
      options:
        domain_name: kanku-vm-1
        ....
        installation:
          -
            expect: Install
            send: yes
            send_enter: 1
          -
            expect: Next Step
            send_ctrl_c: 1
        pwrand:                   # create randomized password
          length: 16              # password length (default: 16 characters)
          user:                   # list of users to
            - root
            - kanku
          recipients:
            - fschreiner@suse.de  # list of recipients to encrypt for
                                  # if not specified, clear text password will
                                  # be stored

        additional_disks:         # list of additional disk images to use in VM
          -
            file: storage.qcow2   # filename for disk image
            reuse: 1              # do not overwrite existing image in libvirt,
                                  # but reuse it in new VM

# DESCRIPTION

This handler creates a new VM from the given template file and a image file.

It will login into the VM and try to find out the ipaddress of the interface connected to the default route.

If configured a port\_forward\_list, it tries to find the next free port and configure a port forwarding with iptables.

# OPTIONS

    domain_name           : name of domain to create

    vm_image_file         : image file to be used for domain creation

    login_user            : user to be used to login via console

    login_pass            : password to be used to login via console

    images_dir            : directory where the images can be found

    management_interface  : Primary network interface on guest.
                            Used to get guest ip address via console.

    management_network    : Name of virtual network on host.
                            Used to get guest ip address from DHCP server.

    network_name          : Name of virtual network on host (default: default)
                            Used as domain.network_name in guests xml template

    network_bridge        : Name of bridge interface on host (default: br0)
                            Used as domain.network_bridge in guests xml template

    forward_port_list     : list of ports to forward from host_interface`s IP to VM
                            DONT USE IN DISTRIBUTED ENV - SEE Kanku::Handler::PortForward

    memory                : memory in KB to be used by VM

    vcpu                  : number of cpus for VM

    use_9p                : create a share folder between host and guest using 9p

    cache_dir             : set directory for caching images

    mnt_dir_9p            : set diretory to mount current working directory in vm. Only used if use_9p is set to true. (default: '/tmp/kanku')

    noauto_9p             : set noauto option for 9p directory in fstab.

    root_disk_size        : define size of root disk (WARNING: only availible with raw images)

    empty_disks           : Array of empty disks to be created

                            * name   - name of disk (required)

                            * size   - size of disk (required)

                            * pool   - name of pool (default: 'default')

                            * format - format of new disk (default: 'qcow2')

    installation          : array of expect commands for installation process

    pool_name             : name of disk pool

    root_disk_bus         : disk bus system for root device. Default: virtio

                            Can be virtio, ide, sata or scsi.

# CONTEXT

## getters

    domain_name

    login_user

    login_pass

    use_cache

    vm_template_file

    vm_image_file

    host_interface

    cache_dir

## setters

    vm_image_file

    ipaddress

# DEFAULTS

    images_dir     /var/lib/libvirt/images

    vcpu           1

    memory         1024 MB

    use_9p         0

    mnt_dir_9p     /tmp/kanku
