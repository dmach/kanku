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
package Kanku::Cli::destroy; ## no critic (NamingConventions::Capitalization)

use strict;
use warnings;
use MooseX::App::Command;
extends qw(Kanku::Cli);

use Log::Log4perl;
use Try::Tiny;

use Kanku::Config;
use Kanku::Util::VM;
use Kanku::Util::IPTables;

command_short_description 'Remove domain completely';
command_long_description 'Remove domain completely';

with 'Kanku::Cli::Roles::VM';

option 'keep_volumes' => (
    isa           => 'ArrayRef',
    is            => 'rw',
    #cmd_aliases   => 'X',
    documentation => 'Volumes to keep when destroying VM to reuse next time.',
);


sub run {
  my ($self)  = @_;
  my $vm      = Kanku::Util::VM->new(domain_name => $self->domain_name);
  $vm->keep_volumes($self->keep_volumes) if $self->keep_volumes;
  my $logger  = Log::Log4perl->get_logger;
  my $dom;

  try {
    $dom = $vm->dom;
  } catch {
    $logger->fatal('Error: '.$self->domain_name." not found\n");
    exit 1;
  };

  try {
    $vm->remove_domain();
  } catch {
    $logger->fatal('Error while removing domain: '.$self->domain_name."\n");
    $logger->fatal($_);
    exit 1;
  };

  my $ipt = Kanku::Util::IPTables->new(domain_name=>$self->domain_name);
  $ipt->cleanup_rules_for_domain();

  $logger->info('Removed domain '.$self->domain_name.' successfully');

  return;
}

__PACKAGE__->meta->make_immutable;

1;
