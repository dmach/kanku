# NAME

OpenStack::API

# SYNOPSIS

    my $osa = OpenStack::API->new();

    my $osa->authenticate();

    my $nova = $osa->service(type => 'compute');

# ATTRIBUTES

## os\_auth\_url

default: $ENV{OS\_AUTH\_URL}

## os\_tenant\_name

default: $ENV{OS\_TENANT\_NAME}

## os\_auth\_api\_version

## os\_username

default: $ENV{OS\_USERNAME}

## os\_password

default: $ENV{OS\_PASSWORD}

# METHODS

## tokens\_url

## authenticate

## service

    my $nova    = $osa->service(type => 'compute');

    my $glance  = $osa->service(name => 'glance');
