# NAME

    Kanku::NotifyQueue - A class to send notifications from daemons to rabbitmq

# SYNOPSIS

    my $notification = {
      type    => ...,
      message => '...'
    };

    my $nq = Kanku::NotifyQueue->new();
    $nq->prepare();
    $nq->send($notification);

# ATTRIBUTES

- shutdown\_file -

# METHODS

## prepare - create Kanku::RabbitMQ object and declare exchange if needed

    $nq->prepare();

## send - send a notification to the notify exchange

$notification can be a json string or a reference

    $nq->send($notification);
