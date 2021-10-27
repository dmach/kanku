#!/usr/bin/env perl

use strict;
use Test::More tests => 1;
use FindBin;
use DBIx::Class::Migration;
use Kanku::Schema;
use Data::Dumper;
use Kanku::Dispatch::Local;
use Log::Log4perl qw(:easy);
Log::Log4perl->easy_init();

my $db = "$FindBin::Bin/tmp.db";
my $dsn = "dbi:SQLite:$db";
unlink $db;

# Init DB
my $schema = Kanku::Schema->connect($dsn);
my $migration = DBIx::Class::Migration->new(
  schema => $schema);
$migration->install;
$migration->populate('test');

my $d = Kanku::Dispatch::Local->new(schema=>$schema);
my $todo = $d->get_todo_list();

my @ids = map { $_->id } @$todo;
is_deeply(\@ids, [48, 49], 'Checking $dispatcher->get_todo_list()');

unlink $db;

exit 0;
