#!/bin/bash

# Built with MooseX::App::Plugin::BashCompletion::Command on 2019/07/02

kanku_COMMANDS='help api console db destroy init ip list login logout pfwd rabbit rcomment rguest rhistory rjob rtrigger rworker setup ssh startui startvm status stopui stopvm up'

_kanku_macc_help() {
    if [ $COMP_CWORD = 2 ]; then
        _kanku_compreply "$kanku_COMMANDS"
    else
        COMPREPLY=()
    fi
}

_kanku_macc_api() {
    _kanku_compreply "--user -u --apiurl -a --rc_file --password -p --details -d --list -l --data --help -h --usage -?"
}

_kanku_macc_console() {
    _kanku_compreply "--domain_name -d --help -h --usage -?"
}

_kanku_macc_db() {
    _kanku_compreply "--server --devel -d --dsn --upgrade -u --install -i --status -s --dbfile --homedir --share_dir --help -h --usage -?"
}

_kanku_macc_destroy() {
    _kanku_compreply "--domain_name -X --help -h --usage -?"
}

_kanku_macc_init() {
    _kanku_compreply "--default_job -j --domain_name -d --qemu_user -u --memory -m --vcpu -c --help -h --usage -?"
}

_kanku_macc_ip() {
    _kanku_compreply "--domain_name -d --login_user -u --login_pass -p --help -h --usage -?"
}

_kanku_macc_list() {
    _kanku_compreply "--global -g --help -h --usage -?"
}

_kanku_macc_login() {
    _kanku_compreply "--user -u --apiurl -a --rc_file --password -p --help -h --usage -?"
}

_kanku_macc_logout() {
    _kanku_compreply "--user -u --apiurl -a --rc_file --password -p --help -h --usage -?"
}

_kanku_macc_pfwd() {
    _kanku_compreply "--domain_name -d --ports -p --interface -i --help -h --usage -?"
}

_kanku_macc_rabbit() {
    _kanku_compreply "--listen -l --send -s --props -p --config -c --notification -n --output_plugin -o --help -h --usage -?"
}

_kanku_macc_rcomment() {
    _kanku_compreply "--user -u --apiurl -a --rc_file --password -p --details -d --list -l --job_id -j --comment_id -C --message -m --create -c --show -s --modify -M --delete -D --help -h --usage -?"
}

_kanku_macc_rguest() {
    _kanku_compreply "--user -u --apiurl -a --rc_file --password -p --details -d --list -l --help -h --usage -?"
}

_kanku_macc_rhistory() {
    _kanku_compreply "--user -u --apiurl -a --rc_file --password -p --details -d --list -l --full --limit --page --help -h --usage -?"
}

_kanku_macc_rjob() {
    _kanku_compreply "--user -u --apiurl -a --rc_file --password -p --details -d --list -l --config -c --help -h --usage -?"
}

_kanku_macc_rtrigger() {
    _kanku_compreply "--user -u --apiurl -a --rc_file --password -p --details -d --list -l --job -j --config -c --help -h --usage -?"
}

_kanku_macc_rworker() {
    _kanku_compreply "--user -u --apiurl -a --rc_file --password -p --details -d --list -l --help -h --usage -?"
}

_kanku_macc_setup() {
    _kanku_compreply "--server --distributed --devel --user --images_dir --apiurl --osc_user --osc_pass --dsn --ssl --apache --mq_host --mq_vhost --mq_user --mq_pass --interactive -i --dns_domain_name --ovs_ip_prefix --help -h --usage -?"
}

_kanku_macc_ssh() {
    _kanku_compreply "--domain_name -X --user -u --help -h --usage -?"
}

_kanku_macc_startui() {
    _kanku_compreply "--help -h --usage -?"
}

_kanku_macc_startvm() {
    _kanku_compreply "--domain_name -X --help -h --usage -?"
}

_kanku_macc_status() {
    _kanku_compreply "--domain_name -X --help -h --usage -?"
}

_kanku_macc_stopui() {
    _kanku_compreply "--help -h --usage -?"
}

_kanku_macc_stopvm() {
    _kanku_compreply "--domain_name -d --force -f --help -h --usage -?"
}

_kanku_macc_up() {
    _kanku_compreply "--offline -o --job_name -j --domain_name --skip_all_checks --skip_check_project --skip_check_package --help -h --usage -?"
}

_kanku_compreply() {
    COMPREPLY=($(compgen -W "$1" -- ${COMP_WORDS[COMP_CWORD]}))
}

_kanku_macc() {
    case $COMP_CWORD in
        0)
            ;;
        1)
            _kanku_compreply "$kanku_COMMANDS"
            ;;
        *)
            eval _kanku_macc_${COMP_WORDS[1]}

    esac
}

complete -o default -F _kanku_macc kanku


