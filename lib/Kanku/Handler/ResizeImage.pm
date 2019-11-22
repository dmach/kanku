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
package Kanku::Handler::ResizeImage;

use Moose;
use Path::Class::File;
use Data::Dumper;
use File::Temp;
use File::Copy;
use Carp;
use Kanku::Config;

with 'Kanku::Roles::Handler';

has [qw/
      vm_image_file
      disk_size
/] => (is => 'rw',isa=>'Str');

has gui_config => (
  is => 'ro',
  isa => 'ArrayRef',
  lazy => 1,
  default => sub {
      [
        {
          param => 'disk_size',
          type  => 'text',
          label => 'New disk size',
        },
      ];
  },
);

sub distributable { return 1; }

sub execute {
  my $self = shift;
  my $ctx  = $self->job->context();
  my $cfg = Kanku::Config->instance();
  my ($tmp);

  my $img  = ($ctx->{vm_image_file} =~ m#/#) ? $ctx->{vm_image_file} : Path::Class::File->new($cfg->cache_dir,$ctx->{vm_image_file});
  my $size = $self->disk_size;

  # 0 means that format is the same as suffix
  my %supported_formats = (
    qcow2    => 0,
    raw      => 0,
    img      => 'raw',
    vhdfixed => 'raw',
  );

  my $supported_suf = join q{|}, keys %supported_formats;

  if ( $img =~ /[.]($supported_suf)$/ ) {
    my $ext = $1;
    if ( $size ) {
      my $template = 'XXXXXXXX';
      my $format = '-f ' . ( $supported_formats{$ext} || $ext );
      $tmp = $ctx->{tmp_image_file} = File::Temp->new(
                                 TEMPLATE => $template,
                                 DIR      => $cfg->cache_dir,
                                 SUFFIX   => ".$ext",
                               );
      $self->logger->debug("--- copying image '$img' to '$tmp'");
      copy($img, $tmp) or croak("Copy failed: $!");
      $self->logger->debug("--- trying to resize image '$tmp' to $size (format: $format)");
      my @out = `qemu-img resize $format $tmp $size`;
      my $ec = $? >> 8;

      croak("ERROR while resizing (exit code: $ec): @out") if $ec;

      $self->logger->info("Sucessfully resized image '$img' to $size");

      return "Sucessfully resized image '$tmp' to $size";
    }
  } else {
    croak("Image file has wrong suffix '$img'.\nList of supported suffixes: <$supported_suf> !\n");
  }
  return ();
}

1;

__END__

=head1 NAME

Kanku::Handler::ResizeImage

=head1 SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

  -
    use_module: Kanku::Handler::ResizeImage
    options:
      disk_size: 100G

=head1 DESCRIPTION

This handler resizes a downloaded image to a given size using 'qemu-img'

=head1 OPTIONS

    disk_size      : new size of disk in GB

=head1 CONTEXT

=head2 getters

 cache_dir

 vm_image_file

=head2 setters

 tmp_image_file

=head1 DEFAULTS

=cut
