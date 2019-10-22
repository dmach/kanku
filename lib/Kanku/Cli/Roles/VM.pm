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

1;
