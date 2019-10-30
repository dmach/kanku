# cmd - execute one or more commands on cli

    $con->cmd("mkdir -p /tmp/kanku","mount /tmp/kanku");

# get\_ipaddress - get ip address for given interface

Both arguments "interface" and "timeout" are mandatory

    $con->get_ipaddress(interface=>'eth0', timeout=>60);
