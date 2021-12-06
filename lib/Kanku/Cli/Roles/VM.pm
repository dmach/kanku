package Kanku::Cli::Roles::VM;

use strict;
use warnings;

use MooseX::App::Role;
use Kanku::Config;

option 'domain_name' => (
  is            => 'rw',
  cmd_aliases   => 'd',
  documentation => 'name of domain to open console',
  lazy          => 1,
  default       => sub { $_[0]->cfg->config->{domain_name} },
);

has cfg => (
  isa           => 'Object',
  is            => 'rw',
  lazy          => 1,
  default       => sub {
    Kanku::Config->initialize(class => 'KankuFile');
    my $cfg = Kanku::Config->instance();
    $cfg->file($_[0]->file);
    return $cfg;
  },
);

option 'file' => (
  isa           => 'Str',
  is            => 'rw',
  documentation => 'KankuFile to use',
);

option 'log_file' => (
  isa           => 'Str',
  is            => 'rw',
  documentation => 'path to logfile for Expect output',
  default       => q{},
);

option 'log_stdout' => (
  isa           => 'Bool',
  is            => 'rw',
  documentation => 'log Expect output to stdout - (default: 1)',
  default       => 1,
);

1;
