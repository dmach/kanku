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
package Kanku::Cli::rtrigger;

use MooseX::App::Command;
extends qw(Kanku::Cli);

with 'Kanku::Cli::Roles::Remote';
with 'Kanku::Cli::Roles::RemoteCommand';
with 'Kanku::Cli::Roles::View';

use Term::ReadKey;
use POSIX;
use Try::Tiny;
use JSON::XS;

command_short_description  "trigger a remote job given by name";

command_long_description
  "trigger a specified job on your remote instance

" . $_[0]->description_footer;

option 'job' => (
  isa           => 'Str',
  is            => 'rw',
  cmd_aliases	=> 'j',
  documentation => '(*) Remote job name - mandatory',
);

option 'config' => (
  isa           => 'Str',
  is            => 'rw',
  cmd_aliases	=> 'c',
  documentation => '(*) use given config for remote job. example: -c "[]"',
);

sub run {
  my $self  = shift;
  Kanku::Config->initialize();
  my $logger  = Log::Log4perl->get_logger;

  if ( $self->job ) {
    my $kr;
    try {
      $kr = $self->connect_restapi();
    } catch {
      exit 1;
    };

    my $data = $kr->post_json(
      # path is only subpath, rest is added by post_json
      path => "job/trigger/".$self->job,
      data => $self->config || '[]'
    );

    $self->view('rtrigger.tt', $data); 
  } else {
	$logger->error("You must at least specify a job name to trigger");
  }
}

__PACKAGE__->meta->make_immutable;

1;
