# NAME

Kanku::Handler::ExecuteCommandViaConsole - execute commands on the serial console

# SYNOPSIS

Here is an example how to configure the module in your jobs file or KankuFile

    -
      use_module: Kanku::Handler::ExecuteCommandViaConsole
      options:
        login_user: kanku
        login_pass: kankusho
        timeout: 600
        commands:
          - /bin/true
          - echo "Hello World!"
          - ...

# DESCRIPTION

This handler logs into serial console and executes the configured commands

# OPTIONS

    timeout - seconds to wait for command to return

# CONTEXT

# DEFAULTS
