# Copyright (c) 2015 SUSE LLC
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
package Kanku::Roles::Config::Base;

use Moose::Role;
use Path::Class::File;
use Data::Dumper;
use Kanku::YAML;
use Path::Class qw/dir/;

with 'Kanku::Roles::Logger';

requires "file";
requires "job_config";

has config => (
  is      => 'rw',
  isa     => 'HashRef',
);

has cf => (
  is      => 'rw',
  isa     => 'HashRef',
  lazy    => 1,
  default => sub {
    my ($self) = @_;
    my $home  = File::HomeDir->my_home;
    my @files = ("$home/.kanku/kanku-config.yml", '/etc/kanku/kanku-config.yml');
    for my $f (@files) {
      return Kanku::YAML::LoadFile($f) if -f $f;
    }
    die "No configuration file found (@files)\n";
  }
);

has last_modified => (
  is        => 'rw',
  isa       => "Int",
  default   => 0
);

has log_dir => (
  is      => 'rw',
  isa     => 'Object',
  lazy    => 1,
  default => sub {
    return Path::Class::Dir->new('/var/log/kanku');
  }
);

sub _build_config {
    my $self    = shift;
    return Kanku::YAML::LoadFile($self->file);
}

around 'config' => sub {
  my $orig = shift;
  my $self = shift;

  die "Config file '".$self->file->stringify."' not found!\n" if ( ! -f $self->file);

  if (
    $self->file->stat->mtime > $self->last_modified or
    ! $self->$orig
  ) {
    if ( $self->last_modified ) {
      $self->logger->debug("Modification of config file detected. Re-reading");
    } else {
      $self->logger->debug("Initial read of config file");
    }
    $self->last_modified($self->file->stat->mtime);
    return $self->$orig( $self->_build_config() );
  }

  return $self->$orig();
};

sub job_list {
  my $self  = shift;
  my @files = dir('/etc/kanku/jobs')->children;
  my @result;
  for my $f (@files) {
    push(@result, $1) if ($f =~ /.*\/(.*)\.yml$/);
  }
  $self->logger->debug("*********** CONFIX @result");
  return @result;
}

1;
