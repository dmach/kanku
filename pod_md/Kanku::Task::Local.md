# NAME

Kanku::Task - single task which executes a Handler

# ATTRIBUTES

## job       - a Kanku::Job object of parent job

## module    - name of the Kanku::Handler::\* module to be executed

## args      - arguments for the Handler from e.g. webfrontend

optional arguments which could be used to overwrite options from the config file

# METHODS

## run - execute prepare/execute/finalize
