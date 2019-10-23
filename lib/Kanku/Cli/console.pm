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
package Kanku::Cli::console;     ## no critic (NamingConventions::Capitalization)

use strict;
use warnings;

use MooseX::App::Command;
extends qw(Kanku::Cli);

use Kanku::Config;

command_short_description  'Open a serial console to vm';

command_long_description 'Open a serial console to vm';

with 'Kanku::Cli::Roles::VM';

sub run {
  my ($self) = @_;
  my $logger  = Log::Log4perl->get_logger;

  my $cmd = 'virsh -c qemu:///system console '.$self->domain_name;

  system $cmd || croak("Failed to execute '$cmd': $!");

  return;
}

__PACKAGE__->meta->make_immutable;
1;
