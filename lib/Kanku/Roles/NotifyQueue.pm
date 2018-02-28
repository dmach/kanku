# Copyright (c) 2017 SUSE LLC
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
package Kanku::Roles::NotifyQueue;

=head1 NAME

 Kanku::Roles::NotifyQueue - A role for NotifyQueue's

=head1 SYNOPSIS

  use Kanku::Roles::NotifyQueue;
  with 'Kanku::Roles::NotifyQueue';

=cut

use Moose::Role;
use FindBin;
use Log::Log4perl;
use Data::Dumper;
use JSON::XS;

use Kanku::Config;
use Kanku::RabbitMQ;

=head1 ATTRIBUTES

=over

=item shutdown_file -

=back

=cut

has shutdown_file => (
  is      => 'rw',
  isa     => 'Object',
);

has _queue => (
  is      => 'rw',
  isa     => 'Object',
);

has logger => (
  is      => 'rw',
  isa     => 'Object',
);

requires 'prepare';
requires 'send';

1;
