package OpenStack::API::Neutron;

use Moose;
with 'OpenStack::API::Role::Service';
with 'OpenStack::API::Role::Client';

use Carp;
use JSON::XS;

sub floating_ip_list {
  my ($self,%filters) = @_;

  my $filter_string = q{};

  if ( %filters ) {
    my @parts;
    while ( my ($k,$v) = each %filters) { push @parts, "$k=$v" }
    $filter_string = q{?} . join q{&}, @parts;
  }

  my $uri = $self->endpoint->{publicURL}."/v2.0/floatingips$filter_string";

  return $self->get($uri)->{floatingips};
}

1;
