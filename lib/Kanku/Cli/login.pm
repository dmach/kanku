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
package Kanku::Cli::login;

use MooseX::App::Command;
extends qw(Kanku::Cli);

use Term::ReadKey;
use Kanku::YAML;

with 'Kanku::Cli::Roles::Remote';

command_short_description  "login to your remote kanku instance";

command_long_description  "login to your remote kanku instance";

sub run {
  my $self  = shift;
  my $logger  = Log::Log4perl->get_logger;

  # Please note the priority of options
  # * command line options
  # * rc_file options
  # * manual input

  if ( -f $self->rc_file ) {

    $self->settings(Kanku::YAML::LoadFile($self->rc_file));

    if ( ! $self->apiurl ) {
      $self->apiurl( $self->settings->{apiurl} || '');
    }
    if ( ! $self->user ) {
      $self->user( $self->settings->{$self->apiurl}->{user} || '');
    }
    if ( ! $self->password ) {
      $self->password( $self->settings->{$self->apiurl}->{password} || '');
    }
  }

  while ( ! $self->apiurl ) {
    print "Please enter your apiurl: ";
    my $url = <STDIN>;
    chomp($url);
    $self->apiurl($url) if ($url);
  }

  $logger->debug("apiurl: " .  $self->apiurl);

  $self->connect_restapi();

  if ( $self->session_valid ) {

    $self->save_settings();

    $logger->info("Already logged in.");
    $logger->info(" Please use logut if you want to change user");


    return { success => 1 }
  }

  while ( ! $self->user ) {
    print "Please enter your user: ";
    my $user = <STDIN>;
    chomp($user);
    $self->user($user) if ($user);
  }

  while ( ! $self->password ) {

     print "Please enter your password for the remote server:\n";
     ReadMode('noecho');
     my $read = <STDIN>;
     chomp($read);

     $self->password($read || qw{});

  }

  $self->user($self->user);
  $self->password($self->password);

  if ( $self->login() ) {
    # Store new default settings
    $self->save_settings();
    $logger->info("Login succeed!");
  } else {
    $logger->error("Login failed!");
  }

}

sub save_settings {
  my $self    = shift;

  $self->settings->{apiurl}                    = $self->apiurl;
  $self->settings->{$self->apiurl}->{user}     = $self->user;
  $self->settings->{$self->apiurl}->{password} = $self->password;

  Kanku::YAML::DumpFile($self->rc_file, $self->settings);

  return 0;
}

__PACKAGE__->meta->make_immutable;

1;
