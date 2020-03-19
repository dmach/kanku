package Kanku::YAML;

use strict;
use warnings;

use YAML::PP;
use YAML::PP::Schema::Include;
use Try::Tiny;

sub LoadFile { ## no critic (NamingConventions::Capitalization)
  my ($file) = @_;
  my $res;

  try {
    my $include = YAML::PP::Schema::Include->new;
    my $yp = YAML::PP->new( schema => [$include] );
    $include->yp($yp);
    $res = $yp->load_file($file);
  } catch {
    die "ERROR while parsing YAML from file '$file': $_\n"
  };
  return $res;
}

sub DumpFile { ## no critic (NamingConventions::Capitalization)
  my ($file, $content) = @_;
  my $res;

  try {
    $res = YAML::PP::DumpFile($file, $content);
  } catch {
    die "ERROR while parsing YAML from file '$file': $_\n"
  };
  return $res;
}

1;
