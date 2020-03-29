package Kanku::Roles::REST;

use Moose::Role;
use Data::Dumper;

has app => (
  is => 'ro',
  isa => 'Object',
);

has schema => (
  is  => 'ro',
  isa => 'Object',
);

has params => (
  is   => 'ro',
  isa  => 'HashRef',
  lazy => 1,
  default => sub { $_[0]->app->request->params },
);

has current_user => (
  is => 'ro',
  isa => 'HashRef',
  default => sub {{}},
);

sub rset { return $_[0]->schema->resultset($_[1]); }

sub has_role {
  my ($self, $role) = @_;
  my $cu = $self->current_user;
  my $has_role = scalar grep { $_ eq $role } (keys %{$cu->{role_id} || {}}, @{$cu->{roles} || []});
  $self->log("debug", "User $cu->{username} has_role $role: $has_role");
  return $has_role;
}

sub log {    ## no critic (Subroutines::ProhibitBuiltinHomonyms)
  my ($self, $level, $msg) = @_;
  return $self->app->log($level, (ref $msg) ? Dumper($msg) : $msg);
}

1;
