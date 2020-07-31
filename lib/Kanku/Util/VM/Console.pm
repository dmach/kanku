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
package Kanku::Util::VM::Console;

use Moose;
use Expect;
use Data::Dumper;
use Kanku::Config;
use Path::Class qw/file/;
use Carp;
use Time::HiRes qw/usleep/;
use Sys::Virt;

with 'Kanku::Roles::Logger';

has ['domain_name','short_hostname','log_file','login_user','login_pass'] => (is=>'rw', isa=>'Str');
has 'prompt' => (is=>'rw', isa=>'Str',default=>'Kanku-prompt: ');
has 'prompt_regex' => (is=>'rw', isa=>'Object',default=>sub { qr/^Kanku-prompt: / });
has _expect_object  => (is=>'rw', isa => 'Object');
has [qw/bootloader_seen grub_seen user_is_logged_in console_connected/] => (is=>'rw', isa => 'Bool');
has 'connect_uri' => (is=>'rw', isa=>'Str', default=>'qemu:///system');
has ['job_id'] => (is=>'rw', isa=>'Int|Undef');

has ['cmd_timeout'] => (is=>'rw', isa=>'Int', default => 600);
has ['_fh'] => (is=>'rw', isa=>'FileHandle');

sub DESTROY {
  close($_[0]->_fh) || croak("Error while closing: $!");
}

sub init {
  my $self = shift;
  my $cfg_ = Kanku::Config->instance();
  my $cfg  = $cfg_->config();
  my $pkg  = __PACKAGE__;
  my $logger    = $self->logger();


  my $conn = Sys::Virt->new(uri => $self->connect_uri);
  my @domains = $conn->list_domains();
  my $xml;

  foreach my $dom (@domains) {
    if ($dom->get_name eq $self->domain_name) {
      $xml = $dom->get_xml_description();
      last;
    }
  }
  croak("Could not find domain description for domain '".$self->domain_name."'") unless $xml;
  my $xxp = XML::XPath->new(xml=>$xml);
  my @nodes = $xxp->find("/domain/devices/serial/source")->get_nodelist;
  my $path  = $nodes[0]->getAttribute('path');


  open(FH, "+<", $path) || croak("Could not open $path: $!");
  $self->_fh(\*FH);
  $logger->debug("Starting expect on $path");
  my $exp = Expect->exp_init(\*FH);
  $exp->restart_timeout_upon_receive(1);
  $exp->debug($cfg->{$pkg}->{debug} || 0);
  $exp->log_stdout(1);

  if ($cfg->{$pkg}->{log_to_file} && $self->job_id) {
    $logger->debug("Config -> $pkg (log_to_file): $cfg->{$pkg}->{log_to_file}");

    my $lf = file($cfg->{$pkg}->{log_dir},"job-".$self->job_id."-console.log");
    if (! -d $lf->parent() ) {
      $lf->parent->mkpath();
    }
    $logger->debug("Setting logfile '".$lf->stringify()."'");
    $exp->log_file($lf->stringify());
    $exp->log_stdout(0);
  }

  $self->_expect_object($exp);

  # wait 1 min to get virsh console
  my $timeout = 60;

  $exp->expect(
    $timeout,
      [
        '.*' => sub {
          $_[0]->clear_accum();
          $self->console_connected(1);
          $logger->debug("Found Console");
        }
      ]
  );

  $exp->expect(
      5,
      [
        qr/(Press any key to continue.|ISOLINUX|Automatic boot in|The highlighted entry will be executed automatically in)/ => sub {
          $logger->debug("Seen bootloader");
          $self->bootloader_seen(1);
          if ($_[0]->match =~ /(Press any key to continue\.|The highlighted entry will be executed automatically in)/) {
            $self->grub_seen(1);
            $logger->debug("Seen bootloader grub");
          }
        }
      ]
  );

  if ( $self->grub_seen ) {
    $exp->send("\n\n");
    $exp->clear_accum();
  }

  die "Could not open virsh console within $timeout seconds" if ( ! ( $self->console_connected or $self->grub_seen ));

  return 0;
}

sub login {
  my $self      = shift;
  my $exp       = $self->_expect_object();
  my $timeout   = 300;
  my $logger    = $self->logger();


  my $user      = $self->login_user;
  my $password  = $self->login_pass;

  die "No login_user found in config" if (! $user);
  die "No login_pass found in config" if (! $password);

  my $login_counter = 0;

  if (! $self->bootloader_seen) {
    $exp->send_slow(1,"\003","\004");
  }
  $exp->expect(
    $timeout,
      [ '^\S+ login: ' =>
        sub {
          my $exp = shift;

          #die "login seems to be failed as login_counter greater than zero" if ($login_counter);
          if ( $exp->match =~ /^(\S+) login: / ) {
            $logger->debug("Found match '$1'");
            $self->short_hostname($1);
            $self->prompt_regex(qr/$1:.*\s+#/);
          }
          $logger->debug(" - Sending username '$user'");
          $exp->send("$user\n");
          $login_counter++;
          exp_continue;
        }
      ],
      [ '^Password: ' =>
        sub {
          my $exp = shift;
          $logger->debug(" - Sending password '$password'");
          $exp->send("$password\n");
        }
      ],
  );

  $exp->expect(
    10,
      [ 'Login incorrect' =>
        sub {
          croak("Login failed");
        }
      ],
  );

  my $hn = $self->short_hostname();
  my $prompt = $self->prompt_regex;
  $exp->expect(
      5,
      [
        $prompt=>sub {
          my $exp = shift;
          $logger->info(" - Logged in sucessfully: '".$exp->match."'");
        }
      ]
  );
  $self->user_is_logged_in(1);
  $exp->send("export PS1=\"".$self->prompt."\"\n");
  $self->prompt_regex(qr/\r\nKanku-prompt: /);
  $exp->expect(
      5,
      [
        $self->prompt_regex() => sub {
          my $exp = shift;
          $logger->info(" - Prompt set sucessfully: '".$exp->match."'");
        }
      ]
  );
  $exp->clear_accum();
}

sub wait_for_login_prompt {
  my $self      = shift;
  my $exp       = $self->_expect_object();
  my $timeout   = 300;
  my $logger    = $self->logger();


  my $login_counter = 0;

  if (! $self->bootloader_seen) {
    $exp->send_slow(1,"\003","\004");
  }
  $exp->expect(
    $timeout,
      [ '^\S+ login: ' =>
        sub {
          my $exp = shift;

          #die "login seems to be failed as login_counter greater than zero" if ($login_counter);
          if ( $exp->match =~ /^(\S+) login: / ) {
            $logger->debug("Found match '$1'");
            $self->short_hostname($1);
            $self->prompt_regex(qr/$1:.*\s+#/);
          }
        }
      ],
  );
  $exp->clear_accum();
}

sub logout {
  my $self = shift;
  my $exp = $self->_expect_object();

  $self->logger->debug("Sending exit");
  $exp->send("exit\n");
  my $timeout = 5;
  sleep 1;
  $exp->expect(
    $timeout,
      [ '^\S+ login: ' =>
        sub {
          my $exp = shift;
          $self->logger->debug("Found '".$exp->match."'");
          sleep(1);
        }
      ],
  );
  $self->user_is_logged_in(0);
}

=head1 cmd - execute one or more commands on cli

  $con->cmd("mkdir -p /tmp/kanku","mount /tmp/kanku");

=cut

sub cmd {
  my $self    = shift;
  my @cmds    = @_;
  my $exp     = $self->_expect_object();
  my $results = [];
  my $logger  = $self->logger;

  my $timeout = $self->cmd_timeout;

  foreach my $cmd (@cmds) {
      $exp->clear_accum();
      $logger->debug("EXPECT STARTING COMMAND: '$cmd' (timeout: $timeout)");
      $exp->send("$cmd\n");
      usleep(10000);
      if ($timeout < 0) {
        $logger->debug("Timeout less then 0 - fire and forget mode");
        next;
      }
      my @result = $exp->expect(
        $timeout,
          [ $self->prompt_regex() =>
            sub {
              my $exp = shift;
              push(@$results,$exp->before());
            }
          ],
      );

      die "Error while executing command '$cmd' (timemout: $timeout): $result[1]" if $result[1];

      $exp->clear_accum;
      $exp->send("echo \$?\n");
      usleep(10000);

      @result = $exp->expect(
        $timeout,
        [
          $self->prompt_regex() => sub {
            my $exp=shift;
            my $rc = $exp->before();
            my @l = split /\r?\n/, $rc;
            $rc = pop @l;
            if ( $rc ) {
              $logger->warn("Execution of command '$cmd' failed with return code '$rc'");
            } else {
              $logger->debug("Execution of command '$cmd' succeed");
            }
          }
        ]
      );

      die "Error while getting return value of command '$cmd' (timeout $timeout): ".$result[1] if $result[1];
  }

  return $results;
}

=head1 get_ipaddress - get ip address for given interface

Both arguments "interface" and "timeout" are mandatory

  $con->get_ipaddress(interface=>'eth0', timeout=>60);

=cut

sub get_ipaddress {
  my ($self, %opts) = @_;
  my $logger    = $self->logger;
  my $do_logout = 0;

  my $save_timeout = $self->cmd_timeout;
 
  $self->cmd_timeout(600);

  croak 'Please specify an interface!' unless $opts{interface};
  croak 'Please specify a timeout!' unless $opts{timeout};

  if (! $self->user_is_logged_in ) {
    $logger->debug("User not logged in. Trying to login");
    $do_logout = 1;
    $self->login;
  } else {
    $logger->debug("User already logged in.");
  }

  my $wait = $opts{timeout};
  my $ipaddress  = undef;

  while ( $wait > 0) {
    # use cat for disable colors
    my $result = $self->cmd("LANG=C \\ip addr show $opts{interface} 2>&1");

    $logger->debug("  -- Output:\n".Dumper($result));

    map { $ipaddress = $1 if m/^\s+inet\s+([0-9\.]+)\// } split /\n/, $result->[0];

    if ($ipaddress) {
      last
    } else {
      $logger->debug("Could not get ip address form interface $opts{interface}.");
      $logger->debug("Waiting another $wait seconds for network to come up");
      $wait--;
      sleep 1;
    }
  }

  $self->logout if $do_logout;

  if (! $ipaddress) { 
    croak "Could not get ip address for interface $opts{interface} within "
      . "$opts{timeout} seconds.";
  }

  $self->cmd_timeout($save_timeout);

  return $ipaddress
}


__PACKAGE__->meta->make_immutable;

1;
