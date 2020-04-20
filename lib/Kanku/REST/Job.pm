package Kanku::REST::Job;

use Moose;

with 'Kanku::Roles::REST';

use Try::Tiny;
use Kanku::Config;

sub list {
  my ($self) = @_;
  my $opts;
  my $search = {};
  my $limit = $self->params->{limit} || 10;

  if ($self->params->{show_only_latest_results}) {
    my $cfg = Kanku::Config->instance();
    $opts = {
      order_by =>{-asc =>'name'},
      distinct => 1,
      group_by => ['name'],
      rows => $limit,
      page => $self->params->{page} || 1,
      where => { name => [$cfg->job_list]},
    };
    if ($self->params->{state}) {
      $search->{state} = $self->params->{state};
    }
  } else {
    $opts = {
      order_by =>{-desc  =>'id'},
      rows => $limit,
      page => $self->params->{page} || 1,
    };
    if ($self->params->{state}) {
      $search->{state} = $self->params->{state};
    } else {
      $search->{state} = [qw/succeed running failed dispatching/];
    }
  }


  if ($self->params->{job_name}) {
	my $jn = $self->params->{job_name};
	$jn =~ s{^\s*(.*[^\s])\s*$}{$1}smx;
	$search->{name}= { like => $jn };
  }

  my $rs = $self->rset('JobHistory')->search($search, $opts);

  my $rv = [];

  my $allow_comments = ($self->has_role('User') || $self->has_role('Admin'));

  while ( my $ds = $rs->next ) {
    my $data = $ds->TO_JSON();

    if ($allow_comments) {
      $data->{comments} = [];
      my @comments = $ds->comments;
      for my $comment (@comments) {
        push @{$data->{comments}}, $comment->TO_JSON;
      }
    }

    $data->{pwrand} = $ds->pwrand if $self->has_role('Admin');

    my ($workerhost, $workerpid, $workerqueue) = split /:/smx, $ds->workerinfo;
    $data->{workerhost}  = $workerhost;
    $data->{workerpid}   = $workerpid;
    $data->{workerqueue} = $workerqueue;
    push @{$rv}, $data;
  }

  return {
    limit => $limit,
    jobs  => $rv,
  };
}

sub details {
  my ($self) = @_;
  my $job_id = $self->params->{id};

  unless ($job_id) {
    return {
      state => 'failed',
      msg   => "Job ID was empty!",
    };
  }

  my $job    = $self->rset('JobHistory')->find($job_id);

  unless ($job) {
    return {
      state => 'failed',
      msg   => "No job with ID '$job_id' found!",
    };
  }

  my $subtasks = [];

  my $job_history_subs = $job->job_history_subs();

  while (my $job_history_sub = $job_history_subs->next ) {
    push @{$subtasks}, $job_history_sub->TO_JSON();
  }

  # workerinfo:
  # kata.suse.de:23108:job-3878-340a157a-d27d-4138-97ab-bb8f49b5bef7
  my ($workerhost, $workerpid, $workerqueue) = split /:/smx, $job->workerinfo;

  return {
      %{$job->TO_JSON},
      subtasks    => $subtasks,
      result      => $job->result || '{}',
      workerhost  => $workerhost,
      workerpid   => $workerpid,
      workerqueue => $workerqueue,
  };
}

sub trigger {
  my ($self) = @_;
  my $name   = $self->params->{name};

  if ( $name ne 'remove-domain') {
    # search for active jobs
    my @active = $self->rset('JobHistory')->search({
      name  => $name,
      state => {'not in' => [qw/skipped succeed failed/]},
    });

    if (@active) {
      return {
        state => 'warning',
        msg   => "Skipped triggering job '$name'."
                 . ' Another job is already running',
      };
    }
  }

  my $jd = {
    name          => $name,
    state         => 'triggered',
    creation_time => time(),
    args 	  => $self->app->request->body,
  };

  if (!$self->has_role('Admin')) {
    $self->log('debug', "NO ADMIN ROLE");
    my $user = $self->current_user->{username};
    $jd->{trigger_user} = $self->current_user->{username};
    my $json = JSON::XS->new();
    my $args = $json->decode($jd->{args});
    for my $task (@$args) {
      $task->{domain_name} =~ s/^($user-)?/$user-/ if $task->{domain_name};
    }
    $jd->{args} = $json->encode($args);
  } else {
    $self->log('debug', "FOUND ADMIN ROLE");
  }

  $self->log('debug', " ----- ARGS: $jd->{args}");
  my $job = $self->rset('JobHistory')->create($jd);

  return {state => 'success', msg => "Successfully triggered job '$name' with id ".$job->id};
}

sub config {
  my ($self) = @_;
  my $cfg = Kanku::Config->instance();
  my $rval;

  try {
    $rval = $cfg->job_config_plain($self->params->{name});
  }
  catch {
    $rval = $_;
  };

  return { config => $rval };
}

__PACKAGE__->meta->make_immutable();

1;
