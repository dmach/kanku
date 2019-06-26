package Kanku::Schema::Result::StateWorker;
use base qw/DBIx::Class::Core/;
use JSON::XS;
__PACKAGE__->table('state_worker');
__PACKAGE__->add_columns(
    hostname    => { data_type => 'varchar', size => 256 },
    last_seen   => { data_type => 'integer' },
    last_update => { data_type => 'integer' },
    info        => { data_type => 'text' },
);
__PACKAGE__->set_primary_key('hostname');

sub TO_JSON {
  my $self = shift;
  my $rv = {};
  for my $col (qw/hostname last_seen last_update/) {
    $rv->{$col} = $self->$col();
  }

  $rv->{info} = decode_json($self->info);

  return $rv
}


1;
