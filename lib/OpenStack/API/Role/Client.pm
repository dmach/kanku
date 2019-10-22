package OpenStack::API::Role::Client;

use Moose::Role;

use LWP::UserAgent;
use HTTP::Request;
use JSON::XS;
use Carp;

has ua => (
  is	  => 'rw',
  isa	  => 'Object',
  lazy	  => 1,
  default => sub { LWP::UserAgent->new() },
);

has token_id => (
  is	  => 'rw',
  isa	  => 'Str',
  lazy	  => 1,
  default => sub { $_[0]->access->authenticate},
);

has content_type => (
  is	  => 'rw',
  isa	  => 'Str',
  lazy	  => 1,
  default => 'application/json',
);

has access => (
  is	  => 'rw',
  isa	  => 'Object',
);

has __already_tried_authentication => (
  is	  => 'rw',
  isa	  => 'Bool',
  default => 0,
);


sub get    { my ($s, @args); return $s->request('GET', @args) }
sub put    { my ($s, @args); return $s->request('PUT', @args) }
sub post   { my ($s, @args); return $s->request('POST', @args) }
sub delete { my ($s, @args); return $s->request('DELETE', @args) } ## no critic (Subroutines::ProhibitBuiltinHomonyms)
sub patch  { my ($s, @args); return $s->request('PATCH', @args) }

sub request {
  my ($self,$method,$uri,$header,$content) = @_;

  if ( $self->token_id ) {
    if ( !  $self->__already_tried_authentication ) {
      #print "Using token:\n".$self->token_id."\n";
      $header = [
	%{$header || {}} ,
	'X-Auth-Token' => $self->token_id,
	'Content-Type' => $self->content_type,
	'Accept'=>$self->content_type
      ];
    }
  } else {
    #print "Using without token\n";
    $header = [%{$header || {}}];
  }

  my $request  = HTTP::Request->new($method,$uri,$header,$content);
  my $response = $self->ua->request($request);

  if (! $response->is_success ) {
    if ( $response->code == 401 ) {
      if ( ! $self->__already_tried_authentication ) {
	my $token_id = $self->access->authenticate;
	croak("Could not authenticate\n") unless $token_id;
	$self->token_id($token_id);
	$self->__already_tried_authentication(1);
	return $self->request($method,$uri,$header,$content);
      } else {
	croak("Error while accessing '$uri'\n" .
	  $response->status_line . "\n".
	  'Already tried authentication: ' .
          $self->__already_tried_authentication . "\n");
      }
    } else {
      croak("Error while accessing '$uri'\n".$response->status_line . "\n");
    }
  }

  if ( $self->content_type eq 'application/json' ) {
    my $con = $response->decoded_content;
    return decode_json($con) if ($con);
    return;
  } else {
    croak('Unknown Content-Type: '.($self->content_type || q{})."\nCannot decode");
  }
}

1;
