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
package Kanku::Util::VM::Image;

use Moose;

use Sys::Virt;
use Sys::Virt::Stream;
use Try::Tiny;
use File::LibMagic;
use File::Temp;
use File::Copy;
use IO::Uncompress::AnyUncompress qw/anyuncompress $AnyUncompressError/;
use Carp;

use Kanku::Util::VM::Console;
use Kanku::Config;

has [qw/uri pool_name vol_name source_file size format/ ]  => ( is=>'rw', isa => 'Str');
has 'final_size'  => ( is=>'rw', isa => 'Str',default=>0);

has '_total_read' => ( is=>'rw', isa => 'Int', default => 0);
has '_total_sent' => ( is=>'rw', isa => 'Int', default => 0);
has '_nbytes'     => ( is=>'rw', isa => 'Int', default => 16*1024*1024);

# TODO: suffix dependent on image format
has '_temp_source_file' => (
  is=>'rw',
  isa => 'Object',
  lazy => 1,
  default => sub { return File::Temp->new(SUFFIX => '.img' ) },
);

has '+uri'       => ( default => 'qemu:///system');
has '+pool_name' => ( default => 'default');
has '+format'    => ( default => 'qcow2');

has pool => (
  is => 'rw',
  isa => 'Object|Undef',
  lazy => 1,
  default => sub {
    my $self = shift;
    my $pn   = $self->pool_name;
    my $vmm = $self->vmm();
    for my $pool ( $vmm->list_all_storage_pools() ) {
      if ( $pn eq $pool->get_name ) {
        return $pool
      }
    }
    croak("libvirt storage pool '$pn' not found\n");
  },
);

has vmm => (
  is => 'rw',
  isa => 'Object|Undef',
  lazy => 1,
  default => sub {
    return Sys::Virt->new(uri => $_[0]->uri);
  },
);

has logger => (
  is => 'rw',
  isa => 'Object',
  lazy => 1,
  default => sub { return Log::Log4perl->get_logger() },
);

sub create_volume {
  my ($self) = @_;

  $self->delete_volume();

  $self->logger->info('Creating volume "'. ($self->vol_name || q{}).'" with format '.$self->format);

  my $xml  =
      '<volume type="file">'
    . ' <name>' . $self->vol_name . '</name>'
    . ' <capacity unit="bytes">'. $self->get_image_size() .'</capacity>'
    . ' <target>'
    . '  <format type="'.$self->format.'"/>'
    . ' </target>'
    . '</volume>';

  $self->logger->debug("create_volume: xml -\n$xml");
  my $vol;
  try {
      $vol  = $self->pool->create_volume($xml);
      $self->_copy_volume($vol);
  }
  catch {
    my ($e) = @_;
    $self->logger->fatal("Error: $e");
    if (ref $e eq 'Sys::Virt::Error'){
      croak($e->stringify);
    } else {
      croak($e);
    }
  };
  return $vol;
}

sub delete_volume {
  my ($self) = @_;

  my @volumes = $self->pool->list_all_volumes();
  for my $vol (@volumes) {
    croak("Got no vol_name\n") if (!$self->vol_name);
    $self->logger->debug('Checking volume '.($vol->get_name || q{}));
    if ( $vol->get_name() eq $self->vol_name()) {
      $self->logger->info('Deleting volume ' . $vol->get_name);
      try {
        $vol->delete(Sys::Virt::StorageVol::DELETE_NORMAL);
      }
      catch {
        my ($e) = @_;
        if ( ref $e eq 'Sys::Virt::Error' ){
          croak($e->stringify());
        } else {
          croak($e);
        }
      };
    }
  }
  return;
}

sub get_image_size {
  my ($self) = @_;

  if ( $self->source_file ) {
    my $file = File::LibMagic->new();
    my $info = $file->info_from_filename($self->source_file);

    if ( $info->{description} =~ /^QEMU QCOW Image .* (\d+) bytes/ ) {
      $self->logger->debug("QCOW Image size: $1");
      return $1;
    } else {
      my @stat = stat($self->source_file);
      return $stat[7];
    }
  }
  my $vol  = $self->vol_name;
  my $size = $self->_string2bytes($self->size);
  $self->logger->debug(" -------- size: $size");

  croak("Size of volume '$vol' could not be determined\n") unless $size;

  return $size;
}

sub resize_image {
  my ($self, $img, $size) = @_;
  my $cfg = Kanku::Config->instance();
  my $tmp;

  $img = Path::Class::File->new($cfg->cache_dir, $img) unless ($img =~ m#/#);

  # 0 means that format is the same as suffix
  my %supported_formats = (
    qcow2    => 0,
    raw      => 0,
    img      => 'raw',
    vhdfixed => 'raw',
  );

  my $supported_suf = join q{|}, keys %supported_formats;

  if ( $img =~ /[.]($supported_suf)(\.xz|\.gz|\.bz2)?$/ ) {
    my $ext         = $1;
    my $compression = $2 || q{};
    if ( $size ) {
      my $template = 'XXXXXXXX';
      my $format = '-f ' . ( $supported_formats{$ext} || $ext );
      $tmp = File::Temp->new(
                                 TEMPLATE => $template,
                                 DIR      => $cfg->cache_dir,
                                 SUFFIX   => ".$ext",
                               );
      if ($compression)  {
        $self->logger->debug("--- uncompress '$img' to '$tmp'");
        my $input = (ref $img) ? $img->stringify : $img;
        my $status = anyuncompress $input => $tmp->filename
          or croak("anyuncompress failed: $AnyUncompressError\n");
      } else {
        $self->logger->debug("--- copying image '$img' to '$tmp'");
        copy($img, $tmp) or croak("Copy failed: $!");
      }
      $self->logger->debug("--- trying to resize image '$tmp' to $size (format: $format)");
      my @out = `qemu-img resize $format $tmp $size`;
      my $ec = $? >> 8;

      croak("ERROR while resizing (exit code: $ec): @out") if $ec;

      $self->logger->info("Sucessfully resized image '$tmp' to $size");
    }
  } else {
    croak("Image file has wrong suffix '$img'.\nList of supported suffixes: <$supported_suf> !\n");
  }

  return $tmp;
}

sub _string2bytes {
  my ($self, $size) = @_;

  my $sh = {
             b => 1,                   k => 1024 ,
             m => 1024*1024,           g => 1024*1024*1024,
             t => 1024*1024*1024*1024, p => 1024*1024*1024*1024*1024
           };

  $size =~ /^(\d+)([bkmgtp]m?)?/i;

  my $f = ($2) ? $sh->{lc $2} : 1;

  return ($1 || 0) * $f;
}

sub _copy_volume {
  my ($self, $vol) = @_;

  $self->_check_source_file();

  my $vmm  = $self->vmm();
  my $st   = $self->vmm()->new_stream();
  my $f    = $self->source_file();

  $self->_total_read(0);
  $self->_total_sent(0);

  $vol->upload($st, 0, 0);

  my $nbytes = 1024;


  if ( $f =~ /[.](gz|bz2|xz)$/ ) {
    $self->_extract_and_upload($f, $st);
  } else {
    $self->_simple_upload($f, $st);
  }

  $self->logger->info('-- total_read: '.$self->_total_read.' -- total_sent: '.$self->_total_sent);
  $self->logger->debug('-- final_size:'.$self->final_size);

  $self->_expand_raw_image($st);

  $self->logger->info('-- finally total bytes read/sent: '.$self->_total_read.q{/}.$self->_total_sent);

  $st->finish();

  return;
}

sub _expand_raw_image {
  my ($self, $st) = @_;
  my $final_size = $self->_string2bytes($self->final_size);
  if ( $self->format eq 'raw' && $final_size > $self->_total_sent ) {
    my $to_read = $final_size - $self->_total_sent;
    my $nbytes  = $self->_nbytes;

    $self->logger->info("-- Sending another $to_read bytes");

    my $f = '/dev/zero';

    open my $fh, '<', $f or croak("cannot open $f: $!");
    while (1) {
      my $data;
      my $length = ( $to_read > $nbytes ) ? $nbytes : $to_read;
      my $rv = sysread $fh, $data, $length;
      croak("cannot read $f: $!") if ($rv < 0);
      last if $rv == 0;
      $self->_total_read($self->_total_read + $rv);
      while ($rv > 0) {
	my $done = $st->send($data, $rv);
	if ($done) {
	  $data = substr $data, $done;
	  $rv -= $done;
	  $to_read -= $done;
	}
	$self->_total_sent($self->_total_sent + $done);
      }
    }
    close $fh or croak("Error while closing $f: $!");
  }
  return;
}

sub _simple_upload {
  my ($self, $f, $st) = @_;
  my $nbytes = $self->_nbytes;
  $self->logger->info('-- _copy_volume -- Uploading file');

  open my $fh, '<', $f or croak("cannot open $f: $!");

  try {
    while (1) {
	  my $data;
	  my $rv = sysread $fh, $data, $nbytes;
	  croak("cannot read $f: $!") if ($rv < 0);
	  last if $rv == 0;
	  $self->_total_read($self->_total_read + $rv);
	  while ($rv > 0) {
	      my $done = $st->send($data, $rv);
	      if ($done) {
		  $data = substr $data, $done;
		  $rv -= $done;
	      }
	      $self->_total_sent($self->_total_sent + $done);
	  }
    }
  } catch {
	close $fh or croak("Error while closing $f: $!");
	croak($_);
  };

  close $fh or croak("cannot save $f: $!");

  return;
}

sub _extract_and_upload {
  my ($self, $f, $st) = @_;

  $self->logger->info('-- _copy_volume -- Uncompressing and uploading file');

  my $z = new IO::Uncompress::AnyUncompress $f
    or croak("IO::Uncompress::AnyUncompress failed: $AnyUncompressError\n");

  while (1) {
	my $data;
	my $rv = $z->read(\$data);
	if ($rv < 0) {
	    croak("cannot read $f: $!");
	}
	last if $rv == 0;
	$self->_total_read($self->_total_read + $rv);
	while ($rv > 0) {
	  my $done = $st->send($data, $rv);
	  if ($done) {
		$data = substr $data, $done;
		$rv -= $done;
	  }
	  $self->_total_sent($self->_total_sent + $done);
	}
  }

  $z->close;

  return;
}

sub _check_source_file {
  my ($self) = @_;

  if ($self->source_file) {
    if (-f $self->source_file) {
       return;
    } else {
       croak('source_file "'.$self->source_file."\" does not exist!\n");
    }
  }

  my $size = $self->size;
  my $fmt  = '-f ' . $self->format;

  my $tmp_fh = $self->_temp_source_file();
  my $tmp_fn = $tmp_fh->filename;

  $self->source_file($tmp_fn);

  $self->logger->info("--- creating temporary source_file '$tmp_fn'");
  my $cmd = "qemu-img create $fmt $tmp_fn $size 2>&1";
  $self->logger->debug("--- executing command: '$cmd'");
  my @out = `$cmd`;

  for my $line (@out) { $self->logger->debug("CMD OUTPUT: $line"); }

  my $ec = $? >> 8;

  croak("ERROR while creating temporary source_file (exit code: $ec): @out") if $ec;

  $self->logger->info("--- sucessfully created new image '$tmp_fn'");

  return;
}

1;
