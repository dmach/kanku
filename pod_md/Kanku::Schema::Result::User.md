# NAME

Kanku::Schema::Result::User

# TABLE: `user`

# ACCESSORS

## id

    data_type: 'integer'
    is_auto_increment: 1
    is_nullable: 0

## username

    data_type: 'varchar'
    is_nullable: 0
    size: 32

## password

    data_type: 'varchar'
    is_nullable: 1
    size: 40

## name

    data_type: 'varchar'
    is_nullable: 1
    size: 128

## email

    data_type: 'varchar'
    is_nullable: 1
    size: 255

## deleted

    data_type: 'boolean'
    default_value: 0
    is_nullable: 0

## lastlogin

    data_type: 'datetime'
    is_nullable: 1

## pw\_changed

    data_type: 'datetime'
    is_nullable: 1

## pw\_reset\_code

    data_type: 'varchar'
    is_nullable: 1
    size: 255

# PRIMARY KEY

- ["id"](#id)

# RELATIONS

## user\_roles

Type: has\_many

Related object: [Kanku::Schema::Result::UserRole](./Kanku%3A%3ASchema%3A%3AResult%3A%3AUserRole.md)

## roles

Type: many\_to\_many

Composing rels: ["user\_roles"](#user_roles) -> role
