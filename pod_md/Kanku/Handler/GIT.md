# NAME

Kanku::Handler::GIT - handle git repositories

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::GIT
      options:
        mirror:     1
        giturl:     http://192.168.199.1/git/github.com/openSUSE/open-build-service.git
        remote_url: https://github.com/openSUSE/open-build-service.git
        destination: /root/kanku
        revision: master
        submodules : 1

# DESCRIPTION

This handler logs into the guest os via ssh and clones/checks out a git repository.

- update cached git repository on master server (only in mirror mode)
- login into guest vm and clone (from master cache or directly)
- checkout specific revision
- update submodules

# OPTIONS

SEE ALSO [Kanku::Roles::SSH](./Kanku%3A%3ARoles%3A%3ASSH)

    mirror      : boolean, if set to 1, use mirror mode

    giturl      : url to clone git repository from (in mirror mode use local cache)

    revision    : revision to checkout in git working copy

    destination : path where working copy is checked out in VM's filesystem

    submodules  : boolean, if set to 1, submodules will be initialized and updated

    remote_url  : origin of cached git repository (only used in mirror mode)

# CONTEXT

## getters

SEE [Kanku::Roles::SSH](./Kanku%3A%3ARoles%3A%3ASSH)

## setters

NONE

# DEFAULTS

NONE

# SEE ALSO

[Kanku::Roles::SSH](./Kanku%3A%3ARoles%3A%3ASSH)
