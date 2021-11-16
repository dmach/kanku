# kanku release notes 0.11.0

## New features

* new feature "Job Groups"
  * [EXAMPLE CONFIG:](etc/job_groups/examples/kanku.yml)
* [schema] update database version 17
* [handler] SetupNetwork improvements
  * new dns handling
  * made handler distributable
  * presistent network rules
    * [EXAMPLE CONFIG:](etc/jobs/examples/multi-network.yml)
    * [EXAMPLE TEMPLATE:](etc/templates/examples-vm/multi-network.tt2)
* [setup] allow multiple networks when setting up ovs
  * [EXAMPLE CONFIG:](etc/templates/cmd/setup/kanku-config.yml.tt2#L72)
* [web] initial version of 'secure' fields in gui_config

## Example configs

* new configs for dki (devel:kanku:images) jobs
* updated icinga Kankufile to openSUSE 15.3

## Bug fixes

* [setup] fix dancer config template - removed duplicate session key
* [core] improved handling of VM template files

# ATTENTION

This new version needs an upgrade of the database schema to version 17.
Please use
```
kanku db --upgrade <--devel|--server>
```
to proceed with the database upgrade.
