# NAME

Kanku::Schema::Result::Role

# TABLE: `role`

# ACCESSORS

## id

    data_type: 'integer'
    is_auto_increment: 1
    is_nullable: 0

## role

    data_type: 'varchar'
    is_nullable: 0
    size: 32

# PRIMARY KEY

- ["id"](#id)

# RELATIONS

## user\_roles

Type: has\_many

Related object: [Kanku::Schema::Result::UserRole](./Kanku%3A%3ASchema%3A%3AResult%3A%3AUserRole)

## users

Type: many\_to\_many

Composing rels: ["user\_roles"](#user_roles) -> user
