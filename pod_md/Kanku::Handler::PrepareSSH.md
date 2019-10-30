# NAME

Kanku::Handler::PrepareSSH

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::PrepareSSH
      options:
        public_keys:
          - ssh-rsa A....
          - ssh-dsa B....
        public_key_files:
          - /home/myuser/.ssh/id_rsa.pub
          - /home/myotheruser/.ssh/id_rsa.pub
        domain_name: my-fancy-vm
        login_user: root
        login_pass: kankudai

# DESCRIPTION

This handler deploys the given public keys for ssh for user root and kanku.

The user kanku will be created if not already exists.

The ssh daemon will be enabled and started.

# OPTIONS

    public_keys       - An array of strings which include your public ssh key

    public_key_files  - An array of files to get the public ssh keys from

    domain_name       - name of the domain to prepare

    login_user        - username to use when connecting domain via console

    login_pass        - password to use when connecting domain via console

# CONTEXT

## getters

The following variables will be taken from the job context if not set explicitly

- domain\_name
- login\_user
- login\_pass

# DEFAULTS

If neither public\_keys nor public\_key\_files are given, 
than the handler will check $HOME/.ssh for the id\_rsa.pub and id\_dsa.pub. 

The keys from the found files will be deployed on the system.
