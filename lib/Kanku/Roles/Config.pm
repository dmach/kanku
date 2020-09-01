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
package Kanku::Roles::Config;

use Moose::Role;
use Path::Class::File;
use Path::Class::Dir;
use Data::Dumper;
use Kanku::YAML;
use YAML::PP;
use Try::Tiny;
use File::HomeDir;

with 'Kanku::Roles::Config::Base';

sub file {
  my $home  = File::HomeDir->my_home;
  my @files = ("$home/.kanku/kanku-config.yml", '/etc/kanku/kanku-config.yml');
  for my $f (@files) {
    return Path::Class::File->new($f) if -f $f;
  }
  die "No configuration file found (@files)\n";
}

has config => (
  is      => 'rw',
  isa     => 'HashRef',
);

has last_modified => (
  is        => 'rw',
  isa       => "Int",
  default   => 0,
);

has views_dir => (
  is        => 'rw',
  isa       => "Str",
  default   => '/usr/share/kanku/views',
);

has cache_dir => (
  is        =>'rw',
  isa       =>'Str',
  lazy      => 1,
  default   => sub {
    return $_[0]->config()->{cache_dir};
  }
);

sub _build_config {
    return Kanku::YAML::LoadFile($_[0]->file);
}

around 'config' => sub {
  my $orig = shift;
  my $self = shift;

  if ( ! -f $self->file->stringify ) {
     die "Configuration file ".$self->file." doesn`t exists\n";
  }

  if ( $self->file->stat->mtime > $self->last_modified ) {
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

sub job_config {
  my ($self,$job_name) = @_;
  my ($cfg,$yml);
    $yml = $self->job_config_plain($job_name);
    $cfg = $self->load_job_config($yml,$job_name);

  if (ref($cfg) eq 'ARRAY') {
    return $cfg;
  } elsif (ref($cfg) eq 'HASH') {
    return $cfg->{tasks} if (ref($cfg->{tasks}) eq 'ARRAY');
  }

  die "No valid job configuration found\n";
}

sub load_job_config {
  my ($self,$yml,$job_name) = @_;
  try {
    return YAML::PP::Load($yml);
  } catch {
      die "Error while parsing job config yaml file for job '$job_name':\n$_";
  }
}

sub notifiers_config {
  my ($self,$job_name) = @_;
  my ($cfg,$yml);
  $yml = $self->job_config_plain($job_name);
  $cfg = $self->load_job_config($yml,$job_name);

  if (ref($cfg) eq 'HASH') {
    return $cfg->{notifiers} if (ref($cfg->{notifiers}) eq 'ARRAY');
  }

  # FALLBACK:
  # give back empty array ref if no config found
  return [];
}

sub job_config_plain {
  my $self      = shift;
  my $job_name  = shift;
  my $conf_file = Path::Class::File->new("/etc/kanku/jobs/$job_name.yml");
  my $content   = $conf_file->slurp();

  return $content;
}

1;
