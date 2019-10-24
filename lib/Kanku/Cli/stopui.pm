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
package Kanku::Cli::stopui; ## no critic (NamingConventions::Capitalization)

use strict;
use warnings;

use MooseX::App::Command;
extends qw(Kanku::Cli);

use Log::Log4perl;
use Carp;
use File::HomeDir;

command_short_description  'stop our local webserver, providing the ui';

command_long_description  'stop our local webserver, providing the ui';

sub run {
  my ($self)      = @_;

  my $logger    = Log::Log4perl->get_logger;
  my $hd        = File::HomeDir->users_home($ENV{USER});
  my $pid_file  = "$hd/.kanku/ui.pid";

  my $pf;
  if (open $pf, '<', $pid_file) {
    my $pid = <$pf>;
    close $pf || croak("Error while closing $pid_file: $!");;
    kill(9, $pid) || croak("Error while killing $pid: $!");
    unlink($pid_file) || croak("Error while deleting $pid_file: $!");
    $logger->info("Stopped webserver with pid: $pid");
  } else {
    $logger->warn('No pid file found.');
  }

  return;
}

1;
