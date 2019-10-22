package OpenStack::API::Glance;

use Moose;
with 'OpenStack::API::Role::Service';
with 'OpenStack::API::Role::Client';

use Carp;
use JSON::XS;

sub image_list {
  my ($self,%filters) = @_;

  my $filter_string = q{};

  if ( %filters ) {
    my @parts;
    while (my ($k,$v) = each %filters) { push @parts, "$k=$v" }
    $filter_string = q{?} . join q{&}, @parts;
  }

  my $uri = $self->endpoint->{publicURL}."/v2/images$filter_string";

  return $self->get($uri)->{images};
}

sub image_detail {
  my ($self,$id) = @_;

  my $uri = $self->endpoint->{publicURL}."/v2/images/$id";

  return $self->get($uri);
}

sub image_delete {
  my ($self,$id) = @_;

  confess "No image id given\n" unless $id;

  my $uri = $self->endpoint->{publicURL}."/v2/images/$id";

  return $self->delete($uri);
}

sub task_list {
  my ($self,%filters) = @_;

  my $filter_string = q{};

  if ( %filters ) {
    my @parts;
    while (my ($k,$v) = each %filters) { push @parts, "$k=$v" }
    $filter_string = q{?} . join q{&}, @parts;
  }

  my $uri = $self->endpoint->{publicURL}."/v2/tasks$filter_string";

  return $self->get($uri);
}

sub task_detail {
  my ($self,$id) = @_;

  my $uri = $self->endpoint->{publicURL}."/v2/tasks/$id";

  return $self->get($uri);
}

sub task_create_image_import {
  my ($self,%input) = @_;

  my $uri = $self->endpoint->{publicURL}.'/v2/tasks';
  my $data = {
	type 	=> 'import',
	input 	=> \%input,
  };
  my $json = encode_json($data);

  return $self->post($uri,{},$json);
}


sub schemas_tasks_list {
  my ($self,%data) = @_;
  my $uri = $self->endpoint->{publicURL}.'/v2/schemas/tasks';

  return $self->get($uri);
}

1;
