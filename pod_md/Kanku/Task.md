# NAME

Kanku::Task - single task which executes a Handler

# ATTRIBUTES

## schema    - a DBIx::Class::Schema object

## job       - a Kanku::Job object of parent job

## scheduler - a Kanku::Daemon::Scheduler object

## module    - name of the Kanku::Handler::\* module to be executed

## result      - Result of task in text form json encoded

## state - TODO: add documentation

## notify\_queue - Kanku::NotifyQueue Object

# METHODS

## run - TODO: add documentation
