package Kanku::Schema::Result::StateWorker;
use base qw/DBIx::Class::Core/;
__PACKAGE__->table('state_worker');
__PACKAGE__->add_columns(
    hostname    => { data_type => 'varchar', size => 256 },
    last_seen   => { data_type => 'integer' },
    last_update => { data_type => 'integer' },
    info        => { data_type => 'text' },
);
__PACKAGE__->set_primary_key('hostname');

1;
