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
package Kanku::Cli::logout;

use MooseX::App::Command;
extends qw(Kanku::Cli);

with 'Kanku::Cli::Roles::Remote';

use Term::ReadKey;
use Kanku::YAML;

command_short_description  "logout from your remote kanku instance";

command_long_description
  "This command will proceeced a logout from your remote kanku instance, ".
  "delete the local session cookie ".
  "and remove the apiurl incl. settings from your rcfile";

sub run {
  my $self  = shift;
  my $logger  = Log::Log4perl->get_logger;

  my $kr =  $self->connect_restapi();

  if ( $kr->logout() ) {
    delete $self->settings->{$self->apiurl};
    delete $self->settings->{apiurl};
    $self->save_settings();
    $logger->info("Logout succeed");
  }
}

sub save_settings {
  my $self    = shift;

  Kanku::YAML::DumpFile($self->rc_file, $self->settings);

  return 0;
};

__PACKAGE__->meta->make_immutable;

1;
