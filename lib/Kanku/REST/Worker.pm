package Kanku::REST::Worker;

use Moose;

with 'Kanku::Roles::REST';

use Try::Tiny;
use Kanku::Config;

sub list {
  my ($self) = @_;

  my $rs = $self->rset('StateWorker')->search();

  my $rv = [];

  while ( my $ds = $rs->next ) {
    my $data = $ds->TO_JSON();
    push @{$rv}, $data;
  }

  return $rv
}


__PACKAGE__->meta->make_immutable();

1;
