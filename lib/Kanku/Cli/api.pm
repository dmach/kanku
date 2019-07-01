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
package Kanku::Cli::api;

use MooseX::App::Command;
extends qw(Kanku::Cli);


with 'Kanku::Cli::Roles::Remote';
with 'Kanku::Cli::Roles::RemoteCommand';
with 'Kanku::Roles::Helpers';

use Try::Tiny;
use Data::Dumper;

command_short_description  "make (GET) requests to api with arbitrary (sub) uri";

command_long_description "list guests on your remote kanku instance

" . $_[0]->description_footer;

parameter 'uri' => (
  isa           => 'Str',
  is            => 'rw',
  required      => 1,
  documentation => 'uri to send request to',
);

option 'data' => (
  isa           => 'Str',
  is            => 'rw',
  documentation => 'data to send',
);

sub run {
  my $self  = shift;
  my $logger  = Log::Log4perl->get_logger;

  my $kr;
  try {
	$kr = $self->connect_restapi();
  } catch {
	exit 1;
  };
  $logger->info("Raw data from API");
  print Dumper($kr->get_json( path => $self->uri ));
}

__PACKAGE__->meta->make_immutable;

1;
