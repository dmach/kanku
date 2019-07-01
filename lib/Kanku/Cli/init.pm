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
package Kanku::Cli::init;

use MooseX::App::Command;
extends qw(Kanku::Cli);

with "Kanku::Cli::Roles::Schema";

use Template;

command_short_description  "create KankuFile in your current working directory";

command_long_description "create KankuFile in your current working directory";

option 'default_job' => (
    isa           => 'Str',
    is            => 'rw',
    documentation => 'default job name in KankuFile',
    cmd_aliases   => ['j'],
    lazy          => 1,
    default       => 'kanku-job',
);

option 'domain_name' => (
    isa           => 'Str',
    is            => 'rw',
    documentation => 'name of default domain in KankuFile',
    cmd_aliases   => ['d'],
    lazy          => 1,
    default       => 'kanku-vm'
);

option 'qemu_user' => (
    isa           => 'Str',
    is            => 'rw',
    documentation => 'user to run qemu',
    cmd_aliases   => ['u'],
    lazy          => 1,
    default       => $ENV{USER},
);

option 'memory' => (
    isa           => 'Str',
    is            => 'rw',
    documentation => 'RAM size of virtual machines',
    cmd_aliases   => ['m'],
    lazy          => 1,
    default       => '2G',
);

option 'vcpu' => (
    isa           => 'Int',
    is            => 'rw',
    documentation => 'Number of virtual CPU\'s in VM',
    cmd_aliases   => ['c'],
    lazy          => 1,
    default       => 2,
);

sub run {
  my $self    = shift;
  my $logger  = Log::Log4perl->get_logger;

  if ( -f 'KankuFile' ) {
    $logger->warn("KankuFile already exists.");
    $logger->warn("  Please remove first if you really want to initalize again.");
    exit 1;
  }

  if ($self->memory !~ /^\d+[kmgtp]$/i ) {
    $logger->error("Please specify a valid memory value including a Unit!");
    exit 1;
  }

  my $config = {
    INCLUDE_PATH => '/etc/kanku/templates/cmd/',
    INTERPOLATE  => 1,               # expand "$var" in plain text
  };

  # create Template object
  my $template  = Template->new($config);

  # define template variables for replacement
  my $vars = {
	domain_name   => $self->domain_name,
        domain_memory => $self->memory,
	domain_cpus   => $self->vcpu,
	default_job   => $self->default_job,
	qemu_user     => $self->qemu_user,
  };

  my $output = '';
  # process input template, substituting variables
  $template->process('init.tt2', $vars, "KankuFile")
               || die $template->error()->as_string();

  $logger->info('KankuFile written');

  for my $i (qw{domain_name domain_memory domain_cpus default_job qemu_user}) {
    $logger->debug($i.': '.$vars->{$i});
  }
  $logger->info('Now you can make your modifications');
  $logger->info('Or start you new VM:');
  $logger->info(q{});
  $logger->info('kanku up');
}

__PACKAGE__->meta->make_immutable;

1;

__DATA__
