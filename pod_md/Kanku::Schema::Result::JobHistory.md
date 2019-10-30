# NAME

Kanku::Schema::Result::JobHistory

# TABLE: `job_history`

# ACCESSORS

## id

    data_type: 'integer'
    is_auto_increment: 1
    is_nullable: 0

## name

    data_type: 'text'
    is_nullable: 1

## state

    data_type: 'text'
    is_nullable: 1

## args

    data_type: 'text'
    is_nullable: 1

## result

    data_type: 'text'
    is_nullable: 1

## creation\_time

    data_type: 'integer'
    default_value: 0
    is_nullable: 1

## start\_time

    data_type: 'integer'
    default_value: 0
    is_nullable: 1

## end\_time

    data_type: 'integer'
    default_value: 0
    is_nullable: 1

## last\_modified

    data_type: 'integer'
    default_value: 0
    is_nullable: 1

## workerinfo

    data_type: 'text'
    is_nullable: 1

## masterinfo

    data_type: 'text'
    is_nullable: 1

# PRIMARY KEY

- ["id"](#id)

# RELATIONS

## job\_history\_subs

Type: has\_many

Related object: [Kanku::Schema::Result::JobHistorySub](./Kanku%3A%3ASchema%3A%3AResult%3A%3AJobHistorySub.md)
