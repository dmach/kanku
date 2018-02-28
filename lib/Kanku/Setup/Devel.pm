package Kanku::Setup::Devel;

use Moose;

with 'Kanku::Setup::Roles::Common';
with 'Kanku::Roles::Logger';

has homedir => (
    isa           => 'Str',
    is            => 'rw',
);

has _dbfile => (
        isa     => 'Str',
        is      => 'rw',
        lazy    => 1,
        default => sub { $_[0]->homedir."/.kanku/kanku-schema.db" }
);


sub setup {
  my $self    = shift;
  my $logger  = $self->logger;

  $logger->debug("Running developer setup");

  # ask for user
  $self->_ask_for_user if ( ! $self->user );

  $self->_create_local_settings_dir();

  $self->_set_sudoers();

  $self->_configure_libvirtd_access();

  $self->_setup_database();

  $self->_modify_path_in_bashrc();

  $self->_create_osc_rc();

  # add user to group libvirt
  system("usermod -G libvirt ".$self->user);

  # enable libvirtd
  system("chkconfig libvirtd on");

  # start and set autostart for default network
  system("virsh net-autostart default 1>/dev/null");

  die if $?;

  $self->_create_default_pool;

  $self->_create_default_network;

  $logger->info("Developer mode setup successfully finished!");
  $logger->info("Please reboot to make sure, libvirtd is coming up properly");

}

sub _create_osc_rc {
  my $self  = shift;
  my $rc        = file($self->homedir,".oscrc");

  return if ( -f $rc );

  if ( ! $self->apiurl ) {
     my $default = "https://api.opensuse.org";
     print "Please enter the apiurl of your obs server [$default]\n";
     my $read = <STDIN>;
     chomp($read);
     $self->apiurl($read || $default);
  }

  while ( ! $self->osc_user ) {

     print "Please enter your login user for obs server:\n";
     my $read = <STDIN>;
     chomp($read);
     $self->osc_user($read || '');
  }

  while ( ! $self->osc_pass ) {

     print "Please enter your password for obs server:\n";
     ReadMode('noecho');
     my $read = <STDIN>;
     chomp($read);

     ReadMode(0);
     print "Please repeat your password\n";
     ReadMode('noecho');
     my $read2 = <STDIN>;
     chomp($read2);
     ReadMode(0);

     $self->osc_pass($read || '') if ( $read eq $read2 );
  }

  my $rc_txt = "[general]
apiurl = ".$self->apiurl."

[".$self->apiurl."]
user = ".$self->osc_user."
pass = ".$self->osc_pass."
";

  $rc->spew($rc_txt);
  $self->_chown($rc);
}

sub _create_local_settings_dir {
  my $self = shift;

  my $dir  = dir($self->homedir,".kanku");

  (-d $dir ) || $dir->mkpath();

  $self->_chown($dir);
}

sub _modify_path_in_bashrc {
  my $self      = shift;
  my $rc        = file($self->homedir,".bashrc");
  my @lines = $rc->slurp;
  my $found = 0;

  
  foreach my $line (@lines) { 
    if ( $line =~ m#^\s*(export\s)?\s*PATH=.*$FindBin::Bin# ) {
      $found = 1
    }
  }
  
  if ( ! $found ) {
        $self->logger->debug("modifying " . $rc->stringify);
    push(@lines,"export PATH=$FindBin::Bin\:\$PATH\n");
        $rc->spew(\@lines);
  }
}

1;
