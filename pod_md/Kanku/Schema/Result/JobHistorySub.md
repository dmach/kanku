# NAME

Kanku::Schema::Result::JobHistorySub

# TABLE: `job_history_sub`

# ACCESSORS

## id

    data_type: 'integer'
    is_auto_increment: 1
    is_nullable: 0

## job\_id

    data_type: 'integer'
    is_foreign_key: 1
    is_nullable: 1

## name

    data_type: 'text'
    is_nullable: 1

## state

    data_type: 'text'
    is_nullable: 1

## result

    data_type: 'text'
    is_nullable: 1

# PRIMARY KEY

- ["id"](#id)

# RELATIONS

## job

Type: belongs\_to

Related object: [Kanku::Schema::Result::JobHistory](./Kanku%3A%3ASchema%3A%3AResult%3A%3AJobHistory)
