# NAME

Kanku::Handler::K8NodePortForward

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::ExecuteCommandViaSSH
      options:
        context2env:
          ipaddress:
        environment:
          test: value
        publickey_path: /home/m0ses/.ssh/id_rsa.pub
        privatekey_path: /home/m0ses/.ssh/id_rsa
        passphrase: MySecret1234
        username: kanku
        nodeports:
          -
            service: rook-ceph-mgr-dashboard-external-https
            namespace: rook-ceph
            transport: tcp
            application: https

# DESCRIPTION

This handler will connect to a kubernetes cluster with the ipaddress stored in the job context, evaluate the given nodeport and create a port forwarding on the kanku master.

# OPTIONS

      nodeports: array of Kubernetes NodePort Service

SEE ALSO Kanku::Roles::SSH

# CONTEXT

## getters

SEE Kanku::Roles::SSH

## setters

NONE

# DEFAULTS

SEE Kanku::Roles::SSH
