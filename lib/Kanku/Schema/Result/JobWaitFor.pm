use utf8;
package Kanku::Schema::Result::JobWaitFor;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Kanku::Schema::Result::JobWaitFor;

=cut

use strict;
use warnings;

use base 'DBIx::Class::Core';

=head1 TABLE: C<user_roles>

=cut

__PACKAGE__->table("job_wait_for");

=head1 ACCESSORS

=head2 job_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

=head2 wait_for_job_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "job_id",
  { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
  "wait_for_job_id",
  { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
);

=head1 PRIMARY KEY

=over 4

=item * L</job_id>

=item * L</wait_for_job_id>

=back

=cut

__PACKAGE__->set_primary_key("job_id", "wait_for_job_id");

=head1 RELATIONS

=head2 role

Type: belongs_to

Related object: L<Kanku::Schema::Result::Job>

=cut

__PACKAGE__->belongs_to(
  "job",
  "Kanku::Schema::Result::JobHistory",
  { "foreign.id" => "self.job_id" },
  #  { is_deferrable => 0, on_delete => "CASCADE", on_update => "CASCADE" },
);

=head2 user

Type: belongs_to

Related object: L<Kanku::Schema::Result::Job>

=cut

__PACKAGE__->has_one(
  "wait_for",
  "Kanku::Schema::Result::JobHistory",
  { "foreign.id" => "self.wait_for_job_id" },
  #  { is_deferrable => 0, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07047 @ 2017-11-16 13:40:30
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:28dRUAL9LS47lwjuK5a+0A


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
