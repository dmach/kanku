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
package Kanku::Cli::lsi;  ## no critic (NamingConventions::Capitalization)

use strict;
use warnings;
use MooseX::App::Command;
extends qw(Kanku::Cli);
use Net::OBS::Client::Project;
use Kanku::Config;


command_short_description  'list standard kanku images';
command_long_description   'This command lists the standard kanku images which'.
  ' are based on (open)SUSEs JeOS images';

option 'name' => (
  isa           => 'Str',
  is            => 'rw',
  cmd_aliases   => 'n',
  documentation => 'filter list by name ',
);


sub run {
  my $self    = shift;
  my $pkg     = __PACKAGE__;
  Kanku::Config->initialize();
  my $prj_name = Kanku::Config->instance->cf->{$pkg}->{project_name} || 'devel:kanku:images';
  my $prj = Net::OBS::Client::Project->new(
    name     => $prj_name,
    apiurl   => 'https://build.opensuse.org/public',
  );

  my $res  = $prj->fetch_resultlist;
  my $reg  = '.*'.$self->name.'.*';
  my $arch = Kanku::Config->instance->cf->{$pkg}->{arch} || 'x86_64';
  foreach my $tmp (@{$res}) {
    foreach my $pkg (@{$tmp->{status}}) {
      if ($pkg->{code} !~ /disabled|excluded/) {
        if ($pkg->{package} =~ $reg) {
	print <<EOF

    # --- $pkg->{package}
      ## kanku init --project $prj_name --package $pkg->{package} --repository $tmp->{repository}
      ## state: $pkg->{code}
      project: $prj_name
      package: $pkg->{package}
      repository: $tmp->{repository}
      arch: $arch
EOF
  ;
      }
    }
  }
}

  return;
}

__PACKAGE__->meta->make_immutable;

1;
