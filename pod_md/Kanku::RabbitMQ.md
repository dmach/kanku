# NAME

Kanku::RabbitMQ - A helper class for Net::AMQP::RabbitMQ

# SYNOPSIS

    my $kmq = Kanku::RabbitMQ->new(%{ $config || {}});
    $kmq->shutdown_file($self->shutdown_file);
    $kmq->connect() or die "Could not connect to rabbitmq\n";
    $kmq->setup_worker();
    $kmq->create_queue(
      queue_name    => $self->worker_id,
      routing_key   =>'kanku.to_all_workers'
    );

# ATTRIBUTES

- channel
- port
- ssl

# METHODS

## connect - connect to a rabbitmq server

    $kmq->connect(no_retry=>1);

## connect\_info - return a hash ref containing config for connect

## recv - wait and read new incomming messages

## publish - send a message

    $kmq->publish($routing_key, $data, $opts);

## create\_queue -

## destroy\_queue - unbind and delete queue (if\_unused=>0,if\_empty=>0)

    $kmq->destroy_queue;

## reconnect - Try to disconnect and reconnect to rabbitmq

    $kmq->reconnect();
