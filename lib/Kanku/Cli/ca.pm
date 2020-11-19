# Copyright (c) 2016 SUSE LLC
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License version 2 as
# published by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program (see the file COPYING); if not, write to the
# Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA
#
package Kanku::Cli::ca; ## no critic (NamingConventions::Capitalization)

use strict;
use warnings;

use MooseX::App::Command;
extends qw(Kanku::Cli);

with 'Kanku::Cli::Roles::Schema';
with 'Kanku::Roles::Logger';

use Path::Class qw/file dir/;
use File::HomeDir;
use Term::ReadKey;
use Cwd;
use DBIx::Class::Migration;
use Sys::Virt;
use Sys::Hostname;
use Net::Domain qw/hostfqdn/;
use Carp;
use Path::Class qw/dir/;

use Kanku::Schema;
use Kanku::Setup::Devel;
use Kanku::Setup::Server::Distributed;
use Kanku::Setup::Server::Standalone;

command_short_description  'Kanku CA management.';

command_long_description "\nManage your local Kanku CA.\n";

option 'create' => (
    isa           => 'Bool',
    is            => 'rw',
    cmd_aliases   => ['c'],
    documentation => 'Create a local Kanku CA',
);

option 'force' => (
    isa           => 'Bool',
    is            => 'rw',
    cmd_aliases   => ['f'],
    documentation => 'Force overwrite of existing files',
);

option 'ca_path' => (
    isa           => 'Str',
    is            => 'rw',
    cmd_aliases   => ['p'],
    documentation => 'Local path to CA directory',
    default       => '/etc/kanku/ca'
);


sub run {
  my ($self)  = @_;
  my $logger  = $self->logger;

  ### Get information
  # ask for mode
  my $setup;

  if ($self->create) {
    $setup = Kanku::Setup::Server::Distributed->new(
      _ssl     => 1,
      ca_path  => dir($self->ca_path),
      _apache  => 0,
    );
    $setup->_create_ca();
    $setup->_create_server_cert();
    $logger->warn("CA password: ".$setup->ca_pass);
  } else {
    croak('No valid setup mode found');
  }
}

__PACKAGE__->meta->make_immutable();

1;
