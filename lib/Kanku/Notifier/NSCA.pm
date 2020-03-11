package Kanku::Notifier::NSCA;

use Moose;
use Net::NSCA::Client;
#use Template;
use Data::Dumper;
use Kanku::Config;

with 'Kanku::Roles::Notifier';
with 'Kanku::Roles::Logger';

=head1 NAME

Kanku::Notifier::NSCA - A kanku notification module for Nagios NSCA

=head1 DESCRIPTION

Send a notification to a nagios NSCA daemon.

=head1 CONFIGURATION

=head2 GLOBAL

in /etc/kanku/kanku-config.yml:

 Kanku::Notifier::NSCA:
   init:
     encryption_password: ...
     encryption_type: ...
     remote_host: ...
     remote_port: ...
   send_report:
     hostname: <hostname_in_icinga>


=head2 JOB CONFIG FILE

  notifiers:
    -
      use_module: Kanku::Notifier::NSCA
      options:
	send_report:
	  hostname: <hostname_in_icinga>
	  service:  <servicename_in_icinga>
        state_map:         # optional
          succeed: 0       # works with Int
          failed: WARNING  # works with Strings (OK, WARNING, CRITICAL, UNKNOWN)
          skipped: unknown # is case insensitive
      states: failed,succeed


=head1 SEE ALSO

L<Net::NSCA::Client>

=cut

sub notify {
  my $self = shift;

  my $template_path = Kanku::Config->instance->views_dir . '/notifier/';
  my $cfg              = Kanku::Config->instance->config;
  my $pkg              = __PACKAGE__;

  $self->logger->debug("Using template_path: $template_path");

  my $config = {
    INCLUDE_PATH  => $template_path,
    INTERPOLATE   => 1,               # expand "$var" in plain text
    POST_CHOMP    => 1,
    PLUGIN_BASE   => 'Template::Plugin',
  };

  # create Template object
  my $template  = Template->new($config);
  my $input     = 'nsca.tt';
  my $output    = '';
  # process input template, substituting variables
  $template->process($input, $self->get_template_data(), \$output)
               || die $template->error()->as_string();
  $output =~ s/\n/\\n/g;

  my $nstat = $self->_state2status;

  $self->logger->debug("Sending report (status: $nstat  with message: ".$self->short_message);

  my $global_init_opts = $cfg->{$pkg}->{init}   || {};
  my $init_opts        = $self->options->{init} || {};
  my %iopts            = (%{$global_init_opts}, %{$init_opts});

  if (! %iopts) {
      $self->logger->error("No configuration found for init. Please check the docs!");
  }

  my $max_size = $cfg->{$pkg}->{max_pluginoutput_length} || 4096;
  $output = substr($output, 0 , $max_size - 5).' ... ';

  my $nsca_config = Net::NSCA::Client::ServerConfig->new(
    max_service_message_length => $max_size, # 4 KiB!
  );
  $iopts{'server_config'} = $nsca_config;

  my $nsca             = Net::NSCA::Client->new(%iopts);
  $nsca->send_report(
    %{$cfg->{$pkg}->{send_report} ||{}},
    %{$self->options->{send_report}},
    message => $output,
    status => $nstat
  );

  return;
}

sub _state2status {
  my ($self, $state) = @_;
  my $status_map = {
    0 		=> $Net::NSCA::Client::STATUS_OK,
    1 		=> $Net::NSCA::Client::STATUS_WARNING,
    2 		=> $Net::NSCA::Client::STATUS_CRITICAL,
    3 		=> $Net::NSCA::Client::STATUS_UNKNOWN,
    'OK'	=> $Net::NSCA::Client::STATUS_OK,
    'WARNING' 	=> $Net::NSCA::Client::STATUS_WARNING,
    'CRITICAL' 	=> $Net::NSCA::Client::STATUS_CRITICAL,
    'UNKNOWN' 	=> $Net::NSCA::Client::STATUS_UNKNOWN,
  };

  my $state_map = {
    'succeed' 		=> 'OK',
    'failed'		=> 'CRITICAL',
    'skipped'		=> 'UNKNOWN',
    %{$self->options->{state_map} || {}},
  };
  my $s2s = uc($state_map->{$self->state});
  return $status_map->{$s2s};
}

1;
