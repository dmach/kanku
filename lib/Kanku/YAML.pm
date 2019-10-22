package Kanku::YAML;

use strict;
use warnings;

use YAML;
use Try::Tiny;

sub LoadFile { ## no critic (NamingConventions::Capitalization)
  my ($file) = @_;
  my $res;

  try {
    $res = YAML::LoadFile($file);
  } catch {
    die "ERROR while parsing YAML from file '$file': $_\n"
  };
  return $res;
}

sub DumpFile { ## no critic (NamingConventions::Capitalization)
  my ($file, $content) = @_;
  my $res;

  try {
    $res = YAML::DumpFile($file, $content);
  } catch {
    die "ERROR while parsing YAML from file '$file': $_\n"
  };
  return $res;
}

1;
