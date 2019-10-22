package Kanku::Airbrake::Dummy;

use Moose;
use Data::Dumper;
sub add_error { return; }
sub has_error { return; }
sub send      { return; } ## no critic (Subroutines::ProhibitBuiltinHomonyms)
sub notify    { my @c = @_; print Dumper(@c); return; }

1;
