# NAME

Kanku::Handler::OBSCheck

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::OBSCheck
      options:
        api_url: https://api.opensuse.org
        project: devel:kanku:images
        package: openSUSE-Leap-15.0-JeOS
        repository: images_leap_15_0
        use_cache: 1

# DESCRIPTION

This handler downloads a file from a given url to the local filesystem and sets vm\_image\_file.

# OPTIONS

    api_url             : API url to OBS server

    base_url            : Url to use for download

    project             : project name in OBS

    package             : package name to search for in project

    repository          : repository name to search for in project/package

    skip_all_checks     : skip checks all checks on project/package on obs side before downloading image

    skip_check_project  : skip check of project state before downloading image

    skip_check_package  : skip check of package state before downloading image

    skip_download       : no changes detected in OBS skip downloading image file if found in cache

    offline             : proceed in offline mode ( skip download and set use_cache in context)

    use_cache           : use cached files if found in users cache directory

# CONTEXT

## getters

    offline

    use_cache

    skip_all_checks

## setters

    vm_image_url

# DEFAULTS

NONE
