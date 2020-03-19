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
package Kanku::Cli::rguest;

use MooseX::App::Command;
extends qw(Kanku::Cli);

with 'Kanku::Cli::Roles::Remote';
with 'Kanku::Cli::Roles::RemoteCommand';
with 'Kanku::Cli::Roles::View';

use Term::ReadKey;
use Try::Tiny;

use Kanku::YAML;

command_short_description  "list guests on your remote kanku instance";

command_long_description
  "list guests on your remote kanku instance

" . $_[0]->description_footer;

sub run {
  my $self  = shift;
  Kanku::Config->initialize;
  my $logger  = Log::Log4perl->get_logger;

  if ( $self->list ) {
    $self->_list();
  } else {
    $logger->warn("Please specify a command. Run 'kanku help rguest' for further information.");
  }
}

sub _list {
  my $self  = shift;

  my $kr;
  try {
	$kr = $self->connect_restapi();
  } catch {
	exit 1;
  };

  my $data = $kr->get_json( path => "guest/list" );
  $self->view('guests.tt', $data);
}

__PACKAGE__->meta->make_immutable;

1;
